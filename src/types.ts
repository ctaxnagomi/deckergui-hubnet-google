/** HUB NET domain types — mirrored from the emitter's `engine/hubnet/types.ts`. */

export type HubNetLinkKind = 'i2i' | 'i2e' | 'e2e';

export type HubNetAssignmentState =
  | 'REQUESTED' | 'MATCHED' | 'VALIDATING' | 'MINTED'
  | 'ACTIVE' | 'COMPLETED' | 'REWARDED' | 'ARCHIVED';

export type HubNetDirection = 'company-request' | 'individual-request';

export type DockRuntimeFamily = 'claw' | 'hermes' | 'custom' | 'langchain';

export const DOCK_RUNTIMES: DockRuntimeFamily[] = ['claw', 'hermes', 'custom', 'langchain'];

/** In this Google build the runtime family is `custom`-free — Gemini powers `claw`. */
export type ExecutionEngine = 'gemini';

export interface AssignmentEvent {
  state: HubNetAssignmentState;
  at: number;
  note: string;
}

export interface HubNetAssignment {
  assignmentId: string;
  direction: HubNetDirection;
  state: HubNetAssignmentState;
  personaId: string | null;
  role: string;
  capability: string;
  userId: string;
  companyId: string;
  companyName: string;
  runtimeFamily: DockRuntimeFamily;
  kpiSchema: string[];
  telemetryEnabled: boolean;
  afmId?: string;
  dockAgentId?: string;
  engine?: ExecutionEngine;
  liveStatus?: 'QUEUED' | 'PREPARING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  liveStatusDetail?: string;
  liveStatusPct?: number;
  /** Output of the Gemini execution layer once the job has run. */
  execution?: { engine: string; model: string; text: string; tokens: number; latencyMs: number };
  events: AssignmentEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface ConnectionEvent {
  state: string;
  at: number;
  note: string;
}

export interface HubNetConnection {
  connectionId: string;
  link: HubNetLinkKind;
  state: 'requested' | 'connected' | 'refused' | 'revoked';
  requester: { afmId: string; name: string; kind: 'individual' | 'company' };
  provider: { companyId: string; companyName: string; kind: 'individual' | 'company' };
  dock: string;
  transport: { mode: string; scope: string; reason: string };
  events: ConnectionEvent[];
  createdAt: number;
  updatedAt: number;
}
