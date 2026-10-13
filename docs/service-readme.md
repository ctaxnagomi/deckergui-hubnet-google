# DGUI HUB NET — Google Cloud execution layer

A self-contained **Cloud Run** service that runs the DGUI HUB NET phase-1 i2i flow with
the execution layer on Google: **Gemini** mints the dock agent (Google Gen AI SDK) and
**Firestore** (or in-memory) holds state. Same domain semantics as the DGUI emitter —
only the SDK and execution layer are Google-based.

- Engine: `@google/genai` (`GEMINI_MODEL`, default `gemini-2.5-flash`)
- Store: `@google-cloud/firestore` when `GOOGLE_CLOUD_PROJECT` + ADC are present, else in-memory
- Transport: phase-1 i2i LAN-only by default (`DGUI_HUBNET_I2I_LAN_ONLY=1`)

## Run

```bash
npm install
npm run build
PORT=8080 GEMINI_API_KEY=<key> node dist/index.js
```

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET  | `/health` | service, engine, store, transport policy |
| POST | `/connect` | `{afm,name?,company,companyName,link,dock}` → transport-guarded connection |
| POST | `/approve` | `{id,vendor?}` → vendor approves (§9.1) |
| POST | `/assign`  | `{afm,role,company,companyName,user}` → individual-request |
| POST | `/advance` | `{id}` → persona-match gate (REQUESTED → MATCHED) |
| POST | `/validate`| `{id}` → three-layer evidencing |
| POST | `/execute` | `{id}` → **run the job on Gemini**, mint the dock agent |
| GET  | `/list`, `/show/:id` | topology / detail |

## Deploy

`cloudbuild.yaml` builds the image and deploys to Cloud Run (`asia-southeast1`). Keep the
Gemini key in Secret Manager and enable `--set-secrets=GEMINI_API_KEY=gemini-api-key:latest`.

## Demo

`demo/hubnet-google.md` (runbook) and `demo/hubnet-google.sh` (runnable).
