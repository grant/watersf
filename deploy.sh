#!/bin/bash

SERVICE="${SERVICE:?SERVICE is required}"
GCP_PROJECT="${GCP_PROJECT:?GCP_PROJECT is required}"
GCP_REGION="${GCP_REGION:?GCP_REGION is required}"

if [[ "${RUN_ENV}" == "PROD" ]]; then
  # Disable update check to avoid prompt
  gcloud config set component_manager/disable_update_check true
fi
echo "Deploying ${SERVICE}"

# Build the app
npm run build;

buildStatus=$?

if [[ $buildStatus -eq 0 ]]; then
  echo "!!! Build successful !!!"

  # Deploys the web app
  gcloud run deploy "$SERVICE" \
  --project "$GCP_PROJECT" \
  --region "$GCP_REGION" \
  --source . \
  --allow-unauthenticated;
else
  echo "!!! Build failed. Fix build then redeploy !!!"
fi
