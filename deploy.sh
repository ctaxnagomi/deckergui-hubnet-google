#!/usr/bin/env bash
# Deploy the DGUI HUB NET Google execution layer to Cloud Run.
#
#   GEMINI_API_KEY=AIza... ./deploy.sh <PROJECT_ID> [REGION]
#
# Works in Google Cloud Shell (gcloud preinstalled). On Windows, run it in Cloud
# Shell rather than locally. Deploying without GEMINI_API_KEY is allowed — the
# service then serves the offline stub until a key is added.
set -euo pipefail

PROJECT="${1:-${GOOGLE_CLOUD_PROJECT:-}}"
REGION="${2:-asia-southeast1}"
SERVICE="dgui-hubnet-google"
SECRET="gemini-api-key"

[ -n "$PROJECT" ] || { echo "usage: GEMINI_API_KEY=... ./deploy.sh <PROJECT_ID> [REGION]"; exit 1; }
CTX="$(cd "$(dirname "$0")" && pwd)"

gcloud config set project "$PROJECT" >/dev/null
gcloud services enable \
  run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com >/dev/null

SECRET_FLAG=()
if [ -n "${GEMINI_API_KEY:-}" ]; then
  if gcloud secrets describe "$SECRET" >/dev/null 2>&1; then
    printf '%s' "$GEMINI_API_KEY" | gcloud secrets versions add "$SECRET" --data-file=- >/dev/null
  else
    printf '%s' "$GEMINI_API_KEY" | gcloud secrets create "$SECRET" --data-file=- >/dev/null
  fi
  PROJNUM="$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')"
  gcloud secrets add-iam-policy-binding "$SECRET" \
    --member="serviceAccount:${PROJNUM}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
  SECRET_FLAG=(--set-secrets="GEMINI_API_KEY=${SECRET}:latest")
  echo "→ Gemini key stored in Secret Manager ($SECRET)"
else
  echo "! GEMINI_API_KEY not set — deploying with the offline stub (Gemini disabled)"
fi

gcloud builds submit --tag "gcr.io/$PROJECT/$SERVICE" "$CTX"

gcloud run deploy "$SERVICE" \
  --image "gcr.io/$PROJECT/$SERVICE" \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash,DGUI_HUBNET_I2I_LAN_ONLY=1" \
  ${SECRET_FLAG[@]+"${SECRET_FLAG[@]}"}

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo
echo "✓ deployed: $URL"
echo "  verify:   curl -s $URL/health"
