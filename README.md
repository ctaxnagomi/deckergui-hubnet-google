# DGUI HUB NET — Google Cloud execution layer

**Google Cloud AI Builder Cup 2026 submission** (theme: *Future of Work*).

A self-contained **Cloud Run** service that runs the DGUI HUB NET phase-1
individual↔individual (i2i) flow with the execution layer moved to Google:
**Gemini** mints the dock agent (Google Gen AI SDK) and **Firestore** (or an
in-memory fallback) holds state. The domain semantics are identical to the DGUI
emitter — only the SDK and the execution layer are Google-based.

| Concern | Original stack | This build (cup entry) |
|---------|----------------|------------------------|
| Execution engine | local Claw runtime | **Gemini** (`@google/genai`) |
| Durable state | node:sqlite ledger | **Firestore** (falls back to in-memory) |
| Host | local emitter | **Cloud Run** |
| Dock agent | `claw` runtime | minted from a real Gemini call |

The bridge between the two is unchanged: the transport policy, the persona-match
gate, and the three-layer evidencing keep the same names and semantics.

## Quickstart (local)

```bash
npm install
npm run build
PORT=8090 GEMINI_API_KEY=<your-key> node dist/index.js
# → DGUI HUB NET (Google execution layer) listening on :8090
```

Without a key the service still runs — the engine falls back to a deterministic
stub so the demo is reproducible offline.

Then run the scripted demo (from the repo root, with the service on :8090):

```bash
bash demo/hubnet-google.sh
```

See `docs/service-readme.md` for the full API, and `demo/hubnet-google.md` for
the runbook.

## Deploy to Cloud Run

```bash
export GOOGLE_CLOUD_PROJECT=<project>
# keep the Gemini key in Secret Manager so it never bakes into the image
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
gcloud builds submit --config cloudbuild.yaml .
```

`cloudbuild.yaml` builds the image and deploys to Cloud Run
(`asia-southeast1`); uncomment `--set-secrets=GEMINI_API_KEY=gemini-api-key:latest`
to wire the key.

## The flow the demo shows

1. **Transport guard** — an i2i request to a public dock is refused before any manifest is pushed.
2. **LAN request** — Alex (individual) → Bella (Peer Reviewer).
3. **Approval** — Bella approves on her Docking Station (§9.1).
4. **Assignment** — an individual-request peer-review job.
5. **Persona-match gate** — REQUESTED → MATCHED, swarm blueprint attached.
6. **Evidencing** — three-layer validation.
7. **Execution** — `POST /execute` runs the job on Gemini and mints the dock agent.

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/health` | service, engine, store, transport policy |
| POST | `/connect` | `{afm,name?,company,companyName,link,dock}` → transport-guarded connection |
| POST | `/approve` | `{id,vendor?}` → vendor approves |
| POST | `/assign`  | `{afm,role,company,companyName,user}` → individual-request |
| POST | `/advance` | `{id}` → persona-match gate (REQUESTED → MATCHED) |
| POST | `/validate`| `{id}` → three-layer evidencing |
| POST | `/execute` | `{id}` → run the job on Gemini, mint the dock agent |
| GET  | `/list`, `/show/:id` | topology / detail |

## Layout

```
src/            service source (transport, hubnet flow, gemini, store, validation)
demo/           runbook + runnable demo script
docs/           service readme, submission deck (HTML/PDF), video script, whitepaper
cloudbuild.yaml Cloud Run deploy pipeline
Dockerfile      container image
deploy.sh       one-shot deploy helper
```

## Provenance

This is a **fresh, standalone prototype** built for the Google Cloud AI Builder
Cup. The DGUI HUB NET architecture it demonstrates is documented in
`docs/DGUI_HUB_NET_Technical_Whitepaper.md`.

## License

Proprietary — all rights reserved. See `LICENSE`.
