# DGUI HUB NET — Google execution layer runbook (AI Builder Cup)

The **same phase-1 individual↔individual (i2i) basis** as the DGUI emitter — transport
policy, persona-match, three-layer evidencing — with the **SDK and the execution layer
moved to Google**:

| Concern | Original stack (demo v11) | This build (cup entry) |
|---------|---------------------------|------------------------|
| Execution engine | local Claw runtime | **Gemini** (Google Gen AI SDK) |
| Durable state | node:sqlite ledger | **Firestore** (falls back to in-memory) |
| Host | local emitter :3021 | **Cloud Run** |
| Dock agent | `claw` runtime | minted from a real Gemini call |

The bridge between the two is unchanged: the transport policy, the persona-match gate,
and the three-layer evidencing keep the same names and semantics.

## Run locally

```bash
npm install
npm run build
PORT=8090 DGUI_HUBNET_I2I_LAN_ONLY=1 GEMINI_API_KEY=<your-key> node dist/index.js
# → DGUI HUB NET (Google execution layer) listening on :8090
```

Then, with the service running:

```bash
bash demo/hubnet-google.sh
```

## Deploy to Cloud Run (the contest requirement)

```bash
export GOOGLE_CLOUD_PROJECT=<project>
# store the Gemini key as a secret so it never bakes into the image
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
gcloud builds submit --config cloudbuild.yaml .
# then (uncomment --set-secrets in cloudbuild.yaml) it runs on Gemini at:
# https://dgui-hubnet-google-<hash>-as.a.run.app
```

## The flow (what the demo shows)

1. **Transport guard** — an i2i request to a public dock is refused before any manifest is pushed.
2. **LAN request** — Alex (individual) → Bella (Peer Reviewer), same basis as the original i2i runbook.
3. **Approval** — Bella approves on her Docking Station (§9.1).
4. **Assignment** — an individual-request peer-review job.
5. **Persona-match gate** — REQUESTED → MATCHED, swarm blueprint attached.
6. **Evidencing (pre-execution)** — L1 PASS, L2 PASS, **L3 FAIL** (no dock agent yet).
7. **Google execution layer** — `POST /execute` runs the job on **Gemini** and mints the dock agent.
8. **Evidencing (post-execution)** — **L1 · L2 · L3 all PASS** → the package is mintable.
9. **Topology** — the recorded connection + assignment.

Without `GEMINI_API_KEY` the execution layer degrades to a deterministic stub so the
demo runs offline; set the key (or deploy with the secret) to see real Gemini output.

## Same basis, Google execution — the pitch

> The DGUI HUB NET doesn't change when it moves to Google Cloud: the physical gate, the
> trust topology and the honesty gate are identical. Only the **execution layer** changes —
> Gemini mints the dock agent, Firestore holds the ledger, Cloud Run serves it. The
> governance story survives the platform swap, which is exactly what a "Future of Work"
> agent fabric needs.
