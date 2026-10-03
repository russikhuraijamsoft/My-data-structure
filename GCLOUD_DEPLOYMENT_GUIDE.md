# TalkOS Enterprise Restaurant ERP — Google Cloud Deployment Guide

This guide details the complete procedure for deploying and operating the **TalkOS Restaurant Operating System** on **Google Cloud Platform (GCP)** using **Google Cloud Run**, **Google Cloud Build**, **Google Artifact Registry**, and **Cloud Firestore Enterprise**.

---

## 1. System Architecture on Google Cloud

```
                                 [ Users / Restaurant POS / KDS ]
                                                │
                                    HTTPS / SSL Termination
                                                ▼
                                    [ Google Cloud DNS / CDN ]
                                                │
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │       Google Cloud Run (Serverless)          │
                         │                                              │
                         │   • Node.js 22 LTS Full-Stack Container      │
                         │   • Vite Static Distribution Assets          │
                         │   • Server API Engine & Health Probe         │
                         │   • Concurrency: 80 per instance             │
                         │   • Scale-to-zero (0 -> 10 instances)        │
                         └───────┬───────────────────────────────┬──────┘
                                 │                               │
                                 ▼                               ▼
     ┌──────────────────────────────────────┐     ┌──────────────────────────────┐
     │      Cloud Firestore Enterprise      │     │  Gemini 2.5 Flash / GenAI    │
     │                                      │     │                              │
     │ • DB: ai-studio-talkosarchitectu-... │     │ • Operations Intelligence    │
     │ • Real-time POS / KDS Synchronization│     │ • Forecasts & Margin Audit   │
     │ • ABAC Granular Security Rules       │     │ • Vertex AI / AI Studio API  │
     └──────────────────────────────────────┘     └──────────────────────────────┘
```

---

## 2. Fast-Track: 1-Command Deployment via `gcloud`

To immediately deploy TalkOS to Google Cloud Run:

```bash
# 1. Authenticate with your Google Cloud account
gcloud auth login

# 2. Set your Google Cloud Project ID
gcloud config set project gen-lang-client-0658820145

# 3. Execute the automated TalkOS deployment script
./deploy-to-gcloud.sh
```

Alternatively, invoke `gcloud run deploy` directly with the pre-configured parameters:

```bash
gcloud run deploy talkos-enterprise-erp \
  --source=. \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=80 \
  --cpu=1 \
  --memory=512Mi \
  --timeout=300s \
  --set-env-vars="NODE_ENV=production,GCP_PROJECT_ID=gen-lang-client-0658820145,GCP_REGION=asia-southeast1,VITE_FIREBASE_DATABASE_ID=ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574"
```

---

## 3. Automated CI/CD with Google Cloud Build

TalkOS includes a production-grade `cloudbuild.yaml` pipeline.

### Step 1: Submit a Manual Build
```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_REGION=asia-southeast1,_SERVICE_NAME=talkos-enterprise-erp
```

### Step 2: Set up a Git Trigger for Continuous Deployment
1. Navigate to [Google Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers).
2. Click **Create Trigger**.
3. Connect your GitHub or Cloud Source repository.
4. Select event: **Push to branch** (`main`).
5. Configuration: **Cloud Build configuration file (yaml or json)** at location `/cloudbuild.yaml`.
6. Add substitution variables:
   - `_REGION`: `asia-southeast1`
   - `_REPO_NAME`: `talkos`
   - `_SERVICE_NAME`: `talkos-enterprise-erp`
   - `_FIRESTORE_DB_ID`: `ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574`

---

## 4. Infrastructure as Code (Terraform)

All Google Cloud infrastructure is defined declaratively in `/terraform`.

```bash
cd terraform

# 1. Initialize Terraform Google Cloud Provider
terraform init

# 2. Plan the deployment
terraform plan -var="project_id=gen-lang-client-0658820145" -var="region=asia-southeast1"

# 3. Apply changes
terraform apply -auto-approve
```

---

## 5. Security & Secret Management

### Storing the Gemini AI API Key
Store your API key securely in Google Cloud Secret Manager instead of hardcoding:

```bash
# Create the secret
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create talkos-gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Grant Cloud Run Service Account access
PROJECT_NUMBER=$(gcloud projects describe gen-lang-client-0658820145 --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding talkos-gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Bind the secret to Cloud Run
gcloud run services update talkos-enterprise-erp \
  --region=asia-southeast1 \
  --update-secrets="GEMINI_API_KEY=talkos-gemini-api-key:latest"
```

---

## 6. Health Checks & Production Verification

Cloud Run utilizes container health checks defined in `Dockerfile` and `server.ts`:

- **Health Probe Endpoint:** `GET /api/health`
  ```json
  {
    "status": "healthy",
    "service": "talkos-enterprise-erp",
    "version": "1.0.0",
    "uptimeSeconds": 3482,
    "platform": "Google Cloud Run",
    "gcp": {
      "projectId": "gen-lang-client-0658820145",
      "region": "asia-southeast1",
      "firestoreDatabaseId": "ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574"
    }
  }
  ```

- **GCloud Status Endpoint:** `GET /api/gcloud/status`
- **In-App Cloud Operations Dashboard:** Access directly from the TalkOS UI via the **Settings -> Google Cloud & DevOps** tab.

---

## 7. Custom Domain & Google-Managed SSL

To map your custom domain (e.g., `pos.myrestaurant.com`):

```bash
# 1. Map custom domain to Cloud Run
gcloud beta run domain-mappings create \
  --service=talkos-enterprise-erp \
  --domain=pos.myrestaurant.com \
  --region=asia-southeast1

# 2. Add the generated DNS CNAME/A records to your domain DNS provider.
# Google automatically provisions and renews SSL/TLS certificates for free.
```

---

## 8. Revision Traffic Splitting (Canary & Blue/Green)

Deploy new versions safely with zero downtime:

```bash
# Deploy a new revision without routing traffic
gcloud run deploy talkos-enterprise-erp \
  --image=asia-southeast1-docker.pkg.dev/gen-lang-client-0658820145/talkos/talkos-enterprise-erp:v2 \
  --no-traffic

# Route 10% of traffic to the new revision for testing
gcloud run services update-traffic talkos-enterprise-erp \
  --to-revisions=v2=10,v1=90 \
  --region=asia-southeast1

# Route 100% traffic once verified
gcloud run services update-traffic talkos-enterprise-erp \
  --to-latest \
  --region=asia-southeast1
```
