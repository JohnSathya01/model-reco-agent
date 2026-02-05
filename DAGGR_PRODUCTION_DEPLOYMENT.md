# Daggr Production Deployment - Complete Guide

## Overview

Your React app is currently configured to load the Daggr workflow from `http://127.0.0.1:7863`, which only works locally. To make it work in production (Firebase Hosting), you need to deploy the Daggr Python backend separately.

## What We've Set Up

### 1. Environment-Aware Configuration ✅

**File**: `src/components/dashboard/RetrainingTab.tsx`

The component now reads the Daggr URL from an environment variable:

```typescript
const DAGGR_URL = import.meta.env.VITE_DAGGR_URL || 'http://127.0.0.1:7863';
```

- **Local development**: Uses `http://127.0.0.1:7863` (default)
- **Production**: Uses the URL from `.env` file

### 2. Deployment Files ✅

Created the following files for easy deployment:

- **`daggr/Dockerfile`** - Container configuration for Cloud Run
- **`daggr/.dockerignore`** - Excludes unnecessary files from container
- **`daggr/cloudbuild.yaml`** - Automated Cloud Build configuration
- **`daggr/deploy.sh`** - One-command deployment script
- **`.env.example`** - Template for environment variables
- **`.gitignore`** - Updated to exclude `.env` files

### 3. Documentation ✅

- **`DAGGR_DEPLOYMENT_GUIDE.md`** - Comprehensive guide with all deployment options
- **`QUICK_DEPLOY.md`** - Fast deployment instructions
- **This file** - Production deployment overview

---

## Quick Start: Deploy to Production

### Option A: Google Cloud Run (Recommended)

**Why?** Integrates with Firebase, scales automatically, cost-effective

```bash
# 1. Deploy Daggr backend
cd daggr
./deploy.sh

# 2. Copy the output URL (e.g., https://daggr-workflow-xxxxx-uc.a.run.app)

# 3. Configure React app
cd ..
echo "VITE_DAGGR_URL=https://your-cloud-run-url" > .env

# 4. Build and deploy React app
npm run build
firebase deploy
```

**Cost**: ~$5-20/month, scales to zero when not in use

### Option B: Railway.app (Fastest)

**Why?** No CLI needed, deploys in 2 minutes

1. Visit [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory: `/daggr`
5. Copy the generated URL
6. Create `.env` file: `VITE_DAGGR_URL=https://your-railway-url`
7. Run: `npm run build && firebase deploy`

**Cost**: $5 free credit/month, then $20/month

---

## Detailed Deployment Steps

### Prerequisites

For Google Cloud Run:
```bash
# Install Google Cloud SDK
# Visit: https://cloud.google.com/sdk/docs/install

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 1: Deploy Daggr Backend

#### Using the deployment script:
```bash
cd daggr
./deploy.sh
```

#### Manual deployment:
```bash
cd daggr

gcloud run deploy daggr-workflow \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --min-instances 0 \
  --max-instances 10
```

**Output**: You'll get a URL like `https://daggr-workflow-xxxxx-uc.a.run.app`

### Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```bash
cd ..
nano .env
```

Add:
```
VITE_DAGGR_URL=https://daggr-workflow-xxxxx-uc.a.run.app
```

Replace with your actual Cloud Run URL.

### Step 3: Test Locally (Optional)

```bash
# Start React app with production URL
npm run dev

# Navigate to Retraining tab
# Verify it loads the deployed Daggr workflow
```

### Step 4: Deploy React App

```bash
# Build with environment variable
npm run build

# Deploy to Firebase
firebase deploy
```

### Step 5: Verify Production

1. Visit your Firebase URL (e.g., `https://your-app.web.app`)
2. Navigate to the Retraining tab
3. The Daggr workflow should load from your deployed backend
4. Test all 4 workflow stages

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Firebase Hosting (Static Files)       │
│  - React App                            │
│  - HTML, CSS, JavaScript                │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  RetrainingTab Component       │    │
│  │  (iframe)                      │    │
│  └────────────┬───────────────────┘    │
└───────────────┼────────────────────────┘
                │
                │ HTTPS Request
                │
                ▼
┌─────────────────────────────────────────┐
│  Google Cloud Run (Python Backend)     │
│  - Daggr Server                         │
│  - FastAPI/Uvicorn                      │
│  - Model Retraining Workflow            │
└─────────────────────────────────────────┘
```

---

## Environment Variables Reference

### Development (.env.local or .env)
```bash
VITE_DAGGR_URL=http://127.0.0.1:7863
```

### Production (.env.production)
```bash
VITE_DAGGR_URL=https://daggr-workflow-xxxxx-uc.a.run.app
```

### How Vite Handles Env Variables

- Variables must start with `VITE_` to be exposed to the client
- `.env` files are loaded automatically
- `.env.production` is used for production builds
- Access in code: `import.meta.env.VITE_DAGGR_URL`

---

## Security Considerations

### 1. CORS Configuration

Your Daggr backend needs to allow requests from your Firebase domain.

Create `daggr/cors_middleware.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://your-app.web.app",
            "https://your-app.firebaseapp.com",
            "http://localhost:5173",  # Local dev
            "http://localhost:4173"   # Preview
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

### 2. Authentication (Optional)

For production, consider adding API key authentication:

```python
import os
from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
API_KEY = os.getenv("DAGGR_API_KEY", "your-secret-key")

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials
```

Then in React:
```typescript
const DAGGR_URL = `${import.meta.env.VITE_DAGGR_URL}?token=${import.meta.env.VITE_DAGGR_API_KEY}`;
```

### 3. Rate Limiting

Add to prevent abuse:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    return {"status": "ok"}
```

---

## Cost Optimization

### Google Cloud Run

1. **Scale to Zero**: Set `--min-instances 0`
   - No cost when not in use
   - Cold start: ~2-5 seconds

2. **Right-size Resources**:
   ```bash
   --memory 2Gi    # Adjust based on usage
   --cpu 2         # Adjust based on usage
   ```

3. **Set Timeouts**:
   ```bash
   --timeout 3600  # 1 hour max
   ```

4. **Monitor Usage**:
   ```bash
   gcloud run services describe daggr-workflow --region us-central1
   ```

### Expected Costs

| Usage | Requests/Month | Cost |
|-------|----------------|------|
| Light | < 100K | Free |
| Medium | 100K - 1M | $5-10 |
| Heavy | 1M - 5M | $10-30 |

---

## Monitoring & Debugging

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read daggr-workflow --region us-central1

# Follow logs in real-time
gcloud run services logs tail daggr-workflow --region us-central1
```

### Check Service Status

```bash
gcloud run services describe daggr-workflow --region us-central1
```

### Test Endpoint

```bash
# Test if service is running
curl https://your-cloud-run-url.com

# Test with verbose output
curl -v https://your-cloud-run-url.com
```

### Common Issues

#### 1. Iframe not loading
- **Check CORS**: Ensure your Firebase domain is allowed
- **Check URL**: Verify the URL is correct in `.env`
- **Check browser console**: Look for CORS or network errors

#### 2. Workflow times out
- **Increase timeout**: `--timeout 3600`
- **Increase resources**: `--memory 4Gi --cpu 4`

#### 3. Cold starts
- **Set min instances**: `--min-instances 1` (costs more)
- **Use Cloud Scheduler**: Ping endpoint every 5 minutes

---

## CI/CD Setup (Optional)

### Automated Deployment with GitHub Actions

Create `.github/workflows/deploy-daggr.yml`:

```yaml
name: Deploy Daggr to Cloud Run

on:
  push:
    branches: [main]
    paths:
      - 'daggr/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Deploy to Cloud Run
        run: |
          cd daggr
          gcloud run deploy daggr-workflow \
            --source . \
            --region us-central1 \
            --allow-unauthenticated
```

---

## Rollback

If something goes wrong:

```bash
# List revisions
gcloud run revisions list --service daggr-workflow --region us-central1

# Rollback to previous revision
gcloud run services update-traffic daggr-workflow \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

---

## Alternative Platforms

### Heroku
```bash
cd daggr
echo "web: daggr working_retraining_workflow.py --host 0.0.0.0 --port \$PORT" > Procfile
heroku create
git push heroku main
```

### AWS App Runner
```bash
# Use the Dockerfile
# Deploy via AWS Console or CLI
```

### DigitalOcean App Platform
```bash
# Connect GitHub repo
# Select daggr folder
# Auto-deploys
```

---

## Next Steps

1. ✅ Deploy Daggr backend to Cloud Run
2. ✅ Configure `.env` with production URL
3. ✅ Build and deploy React app to Firebase
4. ✅ Test the integration
5. 🔒 Add authentication (optional)
6. 📊 Set up monitoring (optional)
7. 🚀 Configure CI/CD (optional)

---

## Support

- **Google Cloud Run**: https://cloud.google.com/run/docs
- **Daggr**: https://github.com/GradienceAI/daggr
- **Firebase**: https://firebase.google.com/docs/hosting

---

## Summary

You now have everything needed to deploy your Daggr workflow to production:

1. **Deployment script**: `daggr/deploy.sh`
2. **Environment config**: `.env.example`
3. **Docker setup**: `daggr/Dockerfile`
4. **Documentation**: This guide + `QUICK_DEPLOY.md`

Run `cd daggr && ./deploy.sh` to get started! 🚀
