/**
 * HUB NET domain — the same basis as the emitter's phase-1 i2i flow, with the
 * execution layer swapped to Google: the dock agent is minted by Gemini and the
 * KPI/DSYNC layer meters the model call. State lives behind the `Store`.
 */

import type { Store } from './store.js';
import { assertHubTransport, type HubNetLinkKind } from './transport.js';
import { validateForMint, generateSwarm, type PersonaRecord, type ValidationResult } from './validation.js';
import { executeJob, type ExecutionResult } from './gemini.js';
import type { HubNetAssignment, HubNetConnection, AssignmentEvent, DockRuntimeFamily } from './types.js';

const DEFAULT_KPI = ['token_efficiency', 'task_completion', 'session_duration'];

function rid(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
}

function personaIdFor(afmId?: string): string {
  return `persona_${(afmId ?? 'guest').replace(/^afm_/, '')}`;
}

function ev(state: AssignmentEvent['state'], note: string): AssignmentEvent {
  return { state, at: Date.now(), note };
}

export interface ConnectInput {
  afm: string;
  name?: string;
  company: string;
  companyName: string;
  link: HubNetLinkKind;
  dock: string;
}

export type ConnectOutcome =
  | { ok: true; connection: HubNetConnection; manifestPushed: boolean }
  | { ok: false; status: number; error: string; verdict: ReturnType<typeof assertHubTransport> };

export async function createConnection(store: Store, input: ConnectInput): Promise<ConnectOutcome> {
  const verdict = assertHubTransport(input.link, input.dock);
  if (!verdict.ok) {
    return { ok: false, status: 400, error: verdict.error ?? 'transport refused', verdict };
  }

  const now = Date.now();
  const connection: HubNetConnection = {
    connectionId: rid('dock'),
    link: input.link,
    state: 'requested',
    requester: { afmId: input.afm, name: input.name ?? input.afm, kind: 'individual' },
    provider: { companyId: input.company, companyName: input.companyName, kind: 'individual' },
    dock: input.dock,
    transport: { mode: verdict.mode, scope: verdict.classification.scope, reason: verdict.classification.reason },
    events: [{ state: 'requested', at: now, note: `link ${input.link} · ${input.name ?? input.afm} → ${input.companyName} · transport ${verdict.mode}` }],
    createdAt: now,
    updatedAt: now,
  };

  const manifestPushed = await pushManifest(input.dock, connection);
  if (manifestPushed) connection.events.push({ state: 'requested', at: Date.now(), note: `manifest pushed to Docking Station ${input.dock}` });

  await store.put('connections', connection.connectionId, connection);
  return { ok: true, connection, manifestPushed };
}

async function pushManifest(dock: string, connection: HubNetConnection): Promise<boolean> {
  try {
    const res = await fetch(`${dock.replace(/\/$/, '')}/hubnet/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId: connection.connectionId, link: connection.link, requester: connection.requester, transport: connection.transport }),
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function approveConnection(store: Store, id: string, vendor?: string): Promise<HubNetConnection | undefined> {
  const connection = await store.get<HubNetConnection>('connections', id);
  if (!connection) return undefined;
  connection.state = 'connected';
  connection.events.push({ state: 'connected', at: Date.now(), note: `vendor ${vendor ?? connection.provider.companyName} approved the connection (§9.1)` });
  connection.updatedAt = Date.now();
  await store.put('connections', id, connection);
  return connection;
}

export interface AssignInput {
  afm: string;
  role: string;
  company: string;
  companyName: string;
  user: string;
  runtimeFamily?: DockRuntimeFamily;
}

export async function createAssignment(store: Store, input: AssignInput): Promise<HubNetAssignment> {
  const now = Date.now();
  const assignment: HubNetAssignment = {
    assignmentId: rid('hna'),
    direction: 'individual-request',
    state: 'REQUESTED',
    personaId: null,
    role: input.role,
    capability: input.role,
    userId: input.user,
    companyId: input.company,
    companyName: input.companyName,
    runtimeFamily: input.runtimeFamily ?? 'claw',
    kpiSchema: [...DEFAULT_KPI],
    telemetryEnabled: true,
    afmId: input.afm,
    engine: 'gemini',
    events: [ev('REQUESTED', 'individual-request created — awaiting persona match')],
    createdAt: now,
    updatedAt: now,
  };
  await store.put('assignments', assignment.assignmentId, assignment);
  return assignment;
}

/** Persona-match gate: REQUESTED → MATCHED, attaching the swarm blueprint (closes L1). */
export async function advanceAssignment(store: Store, id: string): Promise<HubNetAssignment | undefined> {
  const assignment = await store.get<HubNetAssignment>('assignments', id);
  if (!assignment) return undefined;
  if (assignment.state === 'REQUESTED') {
    const personaId = personaIdFor(assignment.afmId);
    const persona: PersonaRecord = {
      id: personaId,
      name: assignment.userId,
      role: assignment.role,
      traitProficiencies: ['synthesis', 'citation', 'precision'],
      swarm: generateSwarm(personaId),
    };
    await store.put('personas', personaId, persona);
    assignment.personaId = personaId;
    assignment.state = 'MATCHED';
    assignment.events.push(ev('MATCHED', 'advanced REQUESTED -> MATCHED (persona match; swarm blueprint attached)'));
  } else {
    assignment.events.push(ev(assignment.state, 'advance no-op'));
  }
  assignment.updatedAt = Date.now();
  await store.put('assignments', id, assignment);
  return assignment;
}

export async function validateAssignment(store: Store, id: string): Promise<{ assignment: HubNetAssignment; result: ValidationResult } | undefined> {
  const assignment = await store.get<HubNetAssignment>('assignments', id);
  if (!assignment) return undefined;
  const persona = assignment.personaId ? (await store.get<PersonaRecord>('personas', assignment.personaId)) ?? null : null;
  const result = validateForMint(assignment, persona);
  assignment.state = assignment.state === 'REQUESTED' ? 'MATCHED' : assignment.state;
  assignment.events.push(ev(assignment.state, `three-layer validation ${result.ok ? 'PASSED' : 'failed'} — L1 ${result.layers[0].pass ? 'PASS' : 'FAIL'} · L2 ${result.layers[1].pass ? 'PASS' : 'FAIL'} · L3 ${result.layers[2].pass ? 'PASS' : 'FAIL'}`));
  assignment.updatedAt = Date.now();
  await store.put('assignments', id, assignment);
  return { assignment, result };
}

export type ExecuteOutcome =
  | { ok: true; assignment: HubNetAssignment; execution: ExecutionResult }
  | { ok: false; status: number; error: string };

/** The Google execution layer: run the assignment on Gemini and mint the dock agent. */
export async function executeAssignment(store: Store, id: string): Promise<ExecuteOutcome> {
  const assignment = await store.get<HubNetAssignment>('assignments', id);
  if (!assignment) return { ok: false, status: 404, error: `assignment ${id} not found` };

  assignment.liveStatus = 'EXECUTING';
  assignment.liveStatusDetail = 'dispatching to Gemini';
  assignment.liveStatusPct = 10;
  await store.put('assignments', id, assignment);

  const execution = await executeJob({
    assignmentId: assignment.assignmentId,
    role: assignment.role,
    persona: assignment.userId,
    instructions: 'You are a governed DGUI dock agent. Be precise and concise.',
  });

  if (!execution.ok) {
    assignment.liveStatus = 'FAILED';
    assignment.liveStatusDetail = execution.error ?? 'execution failed';
    assignment.events.push(ev(assignment.state, `execution FAILED on ${execution.model}: ${execution.error}`));
    assignment.updatedAt = Date.now();
    await store.put('assignments', id, assignment);
    return { ok: false, status: 502, error: execution.error ?? 'execution failed' };
  }

  assignment.dockAgentId = `dock_${assignment.assignmentId}_${assignment.runtimeFamily}`;
  assignment.engine = 'gemini';
  assignment.liveStatus = 'COMPLETED';
  assignment.liveStatusDetail = `${execution.engine}:${execution.model}`;
  assignment.liveStatusPct = 100;
  assignment.execution = { engine: execution.engine, model: execution.model, text: execution.text, tokens: execution.tokens, latencyMs: execution.latencyMs };
  assignment.state = 'ACTIVE';
  assignment.events.push(ev('ACTIVE', `dock agent ${assignment.dockAgentId} minted by ${execution.engine} (${execution.model}) — ${execution.tokens} tokens in ${execution.latencyMs}ms`));
  assignment.updatedAt = Date.now();
  await store.put('assignments', id, assignment);
  return { ok: true, assignment, execution };
}

export async function listAll(store: Store): Promise<{ assignments: HubNetAssignment[]; connections: HubNetConnection[] }> {
  const assignments = (await store.list<HubNetAssignment>('assignments')).sort((a, b) => b.createdAt - a.createdAt);
  const connections = (await store.list<HubNetConnection>('connections')).sort((a, b) => b.createdAt - a.createdAt);
  return { assignments, connections };
}

export async function show(store: Store, id: string): Promise<HubNetAssignment | HubNetConnection | undefined> {
  return (await store.get<HubNetAssignment>('assignments', id)) ?? (await store.get<HubNetConnection>('connections', id));
}
