/**
 * DGUI HUB NET — Google Cloud execution layer.
 *
 * A self-contained Cloud Run service that runs the phase-1 i2i flow with the
 * execution layer on Google: Gemini mints the dock agent, Firestore (or memory)
 * holds state. The emitter's domain semantics are preserved.
 */

import express from 'express';
import { createStore } from './store.js';
import { hubTransportPolicy } from './transport.js';
import {
  createConnection, approveConnection, createAssignment, advanceAssignment,
  validateAssignment, executeAssignment, listAll, show,
} from './hubnet.js';

const app = express();
app.use(express.json({ limit: '256kb' }));

const store = await createStore();

function geminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY);
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'dgui-hubnet-google',
    engine: 'gemini',
    geminiConfigured: geminiConfigured(),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    store: store.kind,
    transport: hubTransportPolicy(),
    at: Date.now(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    service: 'DGUI HUB NET · Google execution layer',
    basis: 'phase-1 individual↔individual (i2i) — same semantics as the DGUI emitter',
    engine: 'Gemini (Google Gen AI SDK)',
    store: store.kind,
    endpoints: {
      health: 'GET /health',
      connect: 'POST /connect {afm,name?,company,companyName,link,dock}',
      approve: 'POST /approve {id,vendor?}',
      assign: 'POST /assign {afm,role,company,companyName,user}',
      advance: 'POST /advance {id}',
      validate: 'POST /validate {id}',
      execute: 'POST /execute {id}  ← runs the job on Gemini, mints the dock agent',
      list: 'GET /list',
      show: 'GET /show/:id',
    },
  });
});

app.post('/connect', async (req, res) => {
  const { afm, name, company, companyName, link, dock } = req.body ?? {};
  if (!afm || !company || !companyName || !dock || !link) {
    return res.status(400).json({ ok: false, error: 'afm, company, companyName, link, dock are required' });
  }
  const outcome = await createConnection(store, { afm, name, company, companyName, link, dock });
  if (!outcome.ok) return res.status(outcome.status).json({ ok: false, error: outcome.error, transport: outcome.verdict });
  res.json({ ok: true, connectionId: outcome.connection.connectionId, state: outcome.connection.state, dock: outcome.connection.dock, transport: outcome.connection.transport, manifestPushed: outcome.manifestPushed });
});

app.post('/approve', async (req, res) => {
  const { id, vendor } = req.body ?? {};
  const connection = await approveConnection(store, id, vendor);
  if (!connection) return res.status(404).json({ ok: false, error: `connection ${id} not found` });
  res.json({ ok: true, connectionId: connection.connectionId, state: connection.state, vendor: connection.provider.companyName });
});

app.post('/assign', async (req, res) => {
  const { afm, role, company, companyName, user } = req.body ?? {};
  if (!afm || !role || !company || !companyName || !user) {
    return res.status(400).json({ ok: false, error: 'afm, role, company, companyName, user are required' });
  }
  const assignment = await createAssignment(store, { afm, role, company, companyName, user });
  res.json({ ok: true, assignmentId: assignment.assignmentId, direction: assignment.direction, state: assignment.state });
});

app.post('/advance', async (req, res) => {
  const { id } = req.body ?? {};
  const assignment = await advanceAssignment(store, id);
  if (!assignment) return res.status(404).json({ ok: false, error: `assignment ${id} not found` });
  res.json({ ok: true, assignmentId: assignment.assignmentId, state: assignment.state, personaId: assignment.personaId });
});

app.post('/validate', async (req, res) => {
  const { id } = req.body ?? {};
  const out = await validateAssignment(store, id);
  if (!out) return res.status(404).json({ ok: false, error: `assignment ${id} not found` });
  res.json({ assignmentId: id, ...out.result });
});

app.post('/execute', async (req, res) => {
  const { id } = req.body ?? {};
  const outcome = await executeAssignment(store, id);
  if (!outcome.ok) return res.status(outcome.status).json({ ok: false, error: outcome.error });
  res.json({ ok: true, assignmentId: outcome.assignment.assignmentId, dockAgentId: outcome.assignment.dockAgentId, engine: outcome.execution.engine, model: outcome.execution.model, tokens: outcome.execution.tokens, latencyMs: outcome.execution.latencyMs, text: outcome.execution.text });
});

app.get('/list', async (_req, res) => {
  const all = await listAll(store);
  res.json({
    ok: true,
    assignments: all.assignments.map(a => ({ id: a.assignmentId, state: a.state, direction: a.direction, role: a.role, company: a.companyName, dockAgentId: a.dockAgentId, liveStatus: a.liveStatus })),
    connections: all.connections.map(c => ({ id: c.connectionId, link: c.link, state: c.state, requester: c.requester.name, provider: c.provider.companyName, dock: c.dock })),
  });
});

app.get('/show/:id', async (req, res) => {
  const doc = await show(store, req.params.id);
  if (!doc) return res.status(404).json({ ok: false, error: `${req.params.id} not found` });
  res.json({ ok: true, doc });
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`DGUI HUB NET (Google execution layer) listening on :${PORT}`);
  console.log(`  engine=gemini  store=${store.kind}  geminiConfigured=${geminiConfigured()}`);
  console.log(`  transport: ${hubTransportPolicy().note}`);
});
