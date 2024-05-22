#!/bin/bash

SERVICE=""
if [[ "${RUN_ENV}" == "PROD" ]]; then
  # Disable update check to avoid prompt
  gcloud config set component_manager/disable_update_check true
  SERVICE="watersf"
else
  # Default to staging
  SERVICE="watersf-staging"
fi
echo "Deploying to project: ${SERVICE}"

# Build the app
npm run build;

buildStatus=$?

if [[ $buildStatus -eq 0 ]]; then
  echo "!!! Build successful !!!"

  # Deploys the web app to Cloud Run
  gcloud run deploy $SERVICE \
  --project watersfcom \
  --region us-central1 \
  --source . \
  --allow-unauthenticated;
else
  echo "!!! Build failed. Fix build then redeploy !!!"
fi