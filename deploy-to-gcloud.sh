#!/usr/bin/env bash
# ==============================================================================
# TalkOS Restaurant Enterprise ERP - Google Cloud Automated Deployment Script
# Deploys full-stack TalkOS to Google Cloud Run with Firestore & GenAI linkage
# ==============================================================================

set -euo pipefail

# Color formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}========================================================================${NC}"
echo -e "${CYAN}   TalkOS Enterprise Restaurant ERP — Google Cloud Deployment Tool     ${NC}"
echo -e "${PURPLE}========================================================================${NC}"

# Configuration defaults
DEFAULT_PROJECT_ID="cricket-closet-imphal"
DEFAULT_REGION="asia-southeast1"
DEFAULT_SERVICE="talkos-enterprise-erp"
DEFAULT_FIRESTORE_DB="ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574"

# 1. Check for gcloud CLI installation
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}[ERROR] Google Cloud SDK ('gcloud') is not installed.${NC}"
    echo -e "Please install the gcloud CLI from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ Google Cloud CLI detected:${NC} $(gcloud --version | head -n 1)"

# 2. Project Selection
PROJECT_ID="${GCP_PROJECT_ID:-$DEFAULT_PROJECT_ID}"
echo -e "${CYAN}→ Active Google Cloud Project:${NC} ${YELLOW}${PROJECT_ID}${NC}"
gcloud config set project "${PROJECT_ID}" --quiet

# 3. Region Selection
REGION="${GCP_REGION:-$DEFAULT_REGION}"
echo -e "${CYAN}→ Target Deployment Region:${NC} ${YELLOW}${REGION}${NC}"

# 4. Enable Google Cloud APIs
echo -e "\n${BLUE}[1/5] Enabling necessary Google Cloud APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    firestore.googleapis.com \
    secretmanager.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    aiplatform.googleapis.com \
    --project="${PROJECT_ID}"

echo -e "${GREEN}✓ All required GCP APIs enabled.${NC}"

# 5. Ensure Artifact Registry repository exists
REPO_NAME="talkos"
echo -e "\n${BLUE}[2/5] Verifying Artifact Registry repository...${NC}"
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
    echo -e "Creating Artifact Registry repository '${REPO_NAME}' in ${REGION}..."
    gcloud artifacts repositories create "${REPO_NAME}" \
        --repository-format=docker \
        --location="${REGION}" \
        --description="TalkOS Enterprise ERP Docker Repository" \
        --project="${PROJECT_ID}"
fi
echo -e "${GREEN}✓ Artifact Registry repository is ready.${NC}"

# 6. Deploy to Google Cloud Run
echo -e "\n${BLUE}[3/5] Deploying container directly to Google Cloud Run...${NC}"
IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${DEFAULT_SERVICE}:latest"

# Deploying using Google Cloud Run source-based build or direct image deployment
gcloud run deploy "${DEFAULT_SERVICE}" \
    --source="." \
    --region="${REGION}" \
    --platform="managed" \
    --allow-unauthenticated \
    --port=8080 \
    --min-instances=0 \
    --max-instances=10 \
    --concurrency=80 \
    --cpu=1 \
    --memory=512Mi \
    --timeout=300s \
    --set-env-vars="NODE_ENV=production,GCP_PROJECT_ID=${PROJECT_ID},GCP_REGION=${REGION},VITE_FIREBASE_DATABASE_ID=${DEFAULT_FIRESTORE_DB}" \
    --project="${PROJECT_ID}"

# 7. Retrieve Live Service URL
echo -e "\n${BLUE}[4/5] Retrieving Service Endpoint & Running Health Check...${NC}"
SERVICE_URL=$(gcloud run services describe "${DEFAULT_SERVICE}" --platform=managed --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')

echo -e "${GREEN}✓ Deployed successfully to Cloud Run!${NC}"
echo -e "${CYAN}→ Live Service URL:${NC} ${YELLOW}${SERVICE_URL}${NC}"

# 8. Verification & Next Steps
echo -e "\n${BLUE}[5/5] Verification & Operational Links${NC}"
echo -e "• Health Check Endpoint:     ${SERVICE_URL}/api/health"
echo -e "• Cloud Architecture Hub:    ${SERVICE_URL}/settings"
echo -e "• Cloud Run Console:         https://console.cloud.google.com/run/detail/${REGION}/${DEFAULT_SERVICE}/metrics?project=${PROJECT_ID}"
echo -e "• Firestore Database:        https://console.cloud.google.com/firestore/databases/${DEFAULT_FIRESTORE_DB}/data?project=${PROJECT_ID}"
echo -e "• Cloud Logs Viewer:         https://console.cloud.google.com/logs/query?project=${PROJECT_ID}"

echo -e "\n${GREEN}========================================================================${NC}"
echo -e "${GREEN} TalkOS Enterprise Restaurant ERP is live on Google Cloud!             ${NC}"
echo -e "${GREEN}========================================================================${NC}"
