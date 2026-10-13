/**
 * Three-layer evidencing (whitepaper §5.2) — the CCD honesty gate.
 *
 *   L1 Structural Validation            — is the agent package complete?
 *   L2 Governance and Security          — does it pass the 3-DGM gate?
 *   L3 DSYNC/KPI Operational            — is a real dock agent behind it?
 *
 * The same semantics as the emitter, re-expressed for the Google build. L3 is
 * closed by the Gemini execution layer (`/execute`), which mints the dock agent.
 */

import { DOCK_RUNTIMES, HubNetAssignment } from './types.js';

export interface ValidationCheck {
  name: string;
  pass: boolean;
  detail: string;
}

export interface ValidationLayer {
  layer: 1 | 2 | 3;
  label: string;
  pass: boolean;
  checks: ValidationCheck[];
}

export interface ValidationResult {
  ok: boolean;
  layers: ValidationLayer[];
  validatedAt: number;
}

export const REQUIRED_SUB_AGENTS = [
  'Knowledge', 'Skill', 'Workflow', 'Tool', 'Runtime', 'Compliance', 'Security', 'Audit',
];

export interface PersonaRecord {
  id: string;
  name: string;
  role: string;
  traitProficiencies: string[];
  swarm: { primary: string; specialists: string[] };
}

export function generateSwarm(personaId: string): { primary: string; specialists: string[] } {
  return {
    primary: `primary_${personaId}`,
    specialists: REQUIRED_SUB_AGENTS.map(a => `Specialist · ${a}`),
  };
}

export function layer1Structural(assignment: HubNetAssignment, persona: PersonaRecord | null): ValidationLayer {
  const checks: ValidationCheck[] = [];
  const hasPersona = persona !== null;
  checks.push({ name: 'persona_reference', pass: hasPersona, detail: hasPersona ? `persona ${persona.id}` : 'no matched persona' });

  const swarm = persona ? persona.swarm : undefined;
  const hasPrimary = swarm !== undefined;
  checks.push({ name: 'primary_agent', pass: hasPrimary, detail: hasPrimary ? 'primary agent manifest present' : 'no swarm blueprint' });

  const specialists = swarm ? swarm.specialists.map(s => s.split(' · ').pop() ?? '') : [];
  const missing = REQUIRED_SUB_AGENTS.filter(r => !specialists.some(s => s.startsWith(r)));
  checks.push({ name: 'required_sub_agents', pass: missing.length === 0, detail: missing.length ? `missing ${missing.join(', ')}` : 'all 8 specialists present' });

  const runtimeSupported = DOCK_RUNTIMES.includes(assignment.runtimeFamily);
  checks.push({ name: 'runtime_requirements', pass: runtimeSupported, detail: runtimeSupported ? `runtime ${assignment.runtimeFamily}` : `unsupported runtime ${assignment.runtimeFamily}` });

  const hasTools = (persona?.traitProficiencies.length ?? 0) > 0;
  checks.push({ name: 'tools_and_skills', pass: hasTools, detail: hasTools ? `${persona?.traitProficiencies.length} proficiencies` : 'no tools/skills declared' });

  const depsResolved = hasPersona && hasPrimary && missing.length === 0;
  checks.push({ name: 'dependencies', pass: depsResolved, detail: depsResolved ? 'swarm closure resolved' : 'swarm dependency gap' });

  return { layer: 1, label: 'Structural Validation', pass: checks.every(c => c.pass), checks };
}

export function layer2Governance(assignment: HubNetAssignment): ValidationLayer {
  const checks: ValidationCheck[] = [];
  const gatePass = DOCK_RUNTIMES.includes(assignment.runtimeFamily);
  checks.push({ name: 'dgm_policy', pass: gatePass, detail: gatePass ? '3-DGM gate pass (dsync/guard/supervisor)' : 'one or more DGM agents failed' });
  checks.push({ name: 'security_boundaries', pass: assignment.runtimeFamily !== 'custom' || assignment.telemetryEnabled, detail: assignment.runtimeFamily === 'custom' ? 'custom runtime requires telemetry' : 'runtime within approved families' });
  checks.push({ name: 'execution_boundaries', pass: assignment.telemetryEnabled, detail: assignment.telemetryEnabled ? 'telemetry + audit enabled' : 'telemetry disabled — downstream audit at risk' });
  return { layer: 2, label: 'Governance and Security Validation', pass: checks.every(c => c.pass), checks };
}

export function layer3Operational(assignment: HubNetAssignment): ValidationLayer {
  const checks: ValidationCheck[] = [];
  checks.push({ name: 'user_association', pass: assignment.userId.length > 0, detail: `user ${assignment.userId}` });
  checks.push({ name: 'company_association', pass: assignment.companyName.length > 0, detail: `${assignment.companyId} / ${assignment.companyName}` });
  checks.push({ name: 'assignment_id', pass: assignment.assignmentId.startsWith('hna_'), detail: assignment.assignmentId });
  const hasSessionIdentity = assignment.personaId !== null && assignment.dockAgentId !== undefined;
  checks.push({ name: 'session_identity', pass: hasSessionIdentity, detail: hasSessionIdentity ? `dock agent ${assignment.dockAgentId}` : 'no dock agent yet' });
  checks.push({ name: 'kpi_schema', pass: assignment.kpiSchema.length > 0, detail: assignment.kpiSchema.join(', ') });
  checks.push({ name: 'telemetry', pass: assignment.telemetryEnabled, detail: assignment.telemetryEnabled ? 'telemetry on' : 'telemetry off' });
  return { layer: 3, label: 'DSYNC/KPI Operational Validation', pass: checks.every(c => c.pass), checks };
}

export function validateForMint(assignment: HubNetAssignment, persona: PersonaRecord | null): ValidationResult {
  const layers = [
    layer1Structural(assignment, persona),
    layer2Governance(assignment),
    layer3Operational(assignment),
  ];
  return { ok: layers.every(l => l.pass), layers, validatedAt: Date.now() };
}
