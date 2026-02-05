#!/bin/bash

# Daggr Deployment Script
# This script helps you deploy the Daggr workflow to Google Cloud Run

set -e

echo "🚀 Daggr Workflow Deployment Script"
echo "===================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No Google Cloud project is set"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📦 Project: $PROJECT_ID"
echo ""

# Prompt for service name
read -p "Enter service name (default: daggr-workflow): " SERVICE_NAME
SERVICE_NAME=${SERVICE_NAME:-daggr-workflow}

# Prompt for region
read -p "Enter region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

echo ""
echo "🔨 Building and deploying to Cloud Run..."
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Deploy to Cloud Run
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --min-instances 0 \
  --max-instances 10

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📍 Service URL: $SERVICE_URL"
echo ""
echo "Next steps:"
echo "1. Copy the URL above"
echo "2. Create a .env file in your React project root:"
echo "   VITE_DAGGR_URL=$SERVICE_URL"
echo "3. Rebuild your React app: npm run build"
echo "4. Deploy to Firebase: firebase deploy"
echo ""
echo "🎉 Done!"
