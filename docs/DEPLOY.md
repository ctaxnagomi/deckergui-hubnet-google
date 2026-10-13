# Deploy — Cloud Run

The submission deploys the HUB NET service to **Cloud Run**. Result: one public URL.

- Cloud Run URL: `https://dgui-hubnet-google-<hash>-as.a.run.app`
- Root `/` returns a JSON overview; health is at `/health`.

Deployment is automatic on push to `main` via `.github/workflows/deploy.yml`
(keyless, using Workload Identity Federation).

---

## One-time setup

Run these in **Google Cloud Shell** (gcloud preinstalled). Replace `PROJECT_ID`
with the project you want (the ID must be globally unique).

```bash
export PROJECT_ID=deckergui-hubnet-google
export REGION=asia-southeast1
export REPO=ctaxnagomi/deckergui-hubnet-google

# 1. Create the project (skip if it already exists)
gcloud projects create "$PROJECT_ID" --name="DGUI HUB NET"
gcloud config set project "$PROJECT_ID"

# 2. Enable the APIs
gcloud services enable \
  run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com \
  iamcredentials.googleapis.com storage.googleapis.com
```

### Deploy service account + Workload Identity Federation

```bash
export SA=github-deploy
gcloud iam service-accounts create "$SA" --display-name="GitHub Actions deploy"
export SA_EMAIL="${SA}@${PROJECT_ID}.iam.gserviceaccount.com"

# 3. Roles the workflow needs
for R in \
  roles/run.admin roles/cloudbuild.builds.editor roles/storage.admin \
  roles/iam.serviceAccountUser roles/secretmanager.admin \
  roles/serviceusage.serviceUsageConsumer
do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" --role="$R" --condition=None >/dev/null
done

# 4. Workload Identity pool + GitHub OIDC provider
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global --workload-identity-pool=github \
  --display-name="GitHub" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='${REPO}'"

export PROJNUM="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

# 5. Let the GitHub repo impersonate the service account
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJNUM}/locations/global/workloadIdentityPools/github/attribute.repository/${REPO}"

# 6. Values to paste into GitHub below
echo "WIF_PROVIDER=projects/${PROJNUM}/locations/global/workloadIdentityPools/github/providers/github"
echo "WIF_SERVICE_ACCOUNT=${SA_EMAIL}"
echo "GCP_PROJECT_ID=${PROJECT_ID}"
```

### GitHub repository settings

**Settings → Secrets and variables → Actions**

| Kind | Name | Value |
|------|------|-------|
| Secret | `WIF_PROVIDER` | the `WIF_PROVIDER` value printed above |
| Secret | `WIF_SERVICE_ACCOUNT` | the `WIF_SERVICE_ACCOUNT` value above |
| Secret | `GEMINI_API_KEY` | your key (optional — the service runs the offline stub without it) |
| Variable | `GCP_PROJECT_ID` | your project ID |
| Variable | `GCP_REGION` | optional, defaults to `asia-southeast1` |

Then push to `main` (or run the workflow from the Actions tab).

---

## Manual deploy

Prefer `deploy.sh` — it creates the Artifact Registry image, stores the Gemini key
in Secret Manager, and deploys in one shot:

```bash
GEMINI_API_KEY=AIza... ./deploy.sh <PROJECT_ID> [REGION]
```

Or the raw Cloud Build path:

```bash
gcloud builds submit --tag "gcr.io/$PROJECT_ID/dgui-hubnet-google" .
gcloud run deploy dgui-hubnet-google \
  --image "gcr.io/$PROJECT_ID/dgui-hubnet-google" \
  --region asia-southeast1 --allow-unauthenticated \
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash,DGUI_HUBNET_I2I_LAN_ONLY=1"
```
