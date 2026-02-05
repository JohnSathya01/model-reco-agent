# Daggr Workflow Deployment Guide

This guide explains how to deploy your Daggr Python backend so it works with your deployed React app on Firebase.

## Why You Need This

Firebase Hosting only serves static files (HTML, CSS, JavaScript). Your Daggr workflow is a Python application that needs a server to run. You have several options:

---

## Option 1: Google Cloud Run (Recommended) ⭐

**Best for**: Production deployments, automatic scaling, integrates with Firebase

### Prerequisites
```bash
# Install Google Cloud SDK if not already installed
# Visit: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Set your project (use the same project as Firebase)
gcloud config set project YOUR_PROJECT_ID
```

### Step 1: Deploy to Cloud Run

```bash
cd daggr

# Build and deploy in one command
gcloud run deploy daggr-workflow \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600
```

### Step 2: Get Your Service URL

After deployment, you'll get a URL like:
```
https://daggr-workflow-xxxxx-uc.a.run.app
```

### Step 3: Update React App

Update `src/components/dashboard/RetrainingTab.tsx`:

```typescript
// Change from localhost to your Cloud Run URL
const DAGGR_URL = 'https://daggr-workflow-xxxxx-uc.a.run.app';

// In the iframe
<iframe
  src={DAGGR_URL}
  // ... rest of props
/>
```

### Step 4: Handle CORS

Create `daggr/cors_config.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://your-app.web.app",
            "https://your-app.firebaseapp.com",
            "http://localhost:5173"  # For local development
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

### Cost Estimate
- **Free tier**: 2 million requests/month
- **Typical cost**: $5-20/month for moderate usage
- **Scales to zero**: No cost when not in use

---

## Option 2: Google Cloud App Engine

**Best for**: Simpler deployment, less configuration

### Deploy

```bash
cd daggr

# Create app.yaml
cat > app.yaml << EOF
runtime: python311
entrypoint: daggr working_retraining_workflow.py --host 0.0.0.0 --port 8080

instance_class: F2

automatic_scaling:
  min_instances: 0
  max_instances: 10
EOF

# Deploy
gcloud app deploy
```

### Get URL
```bash
gcloud app browse
# URL will be: https://YOUR_PROJECT_ID.appspot.com
```

---

## Option 3: Heroku

**Best for**: Quick deployment, simple setup

### Prerequisites
```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

### Deploy

```bash
cd daggr

# Create Procfile
echo "web: daggr working_retraining_workflow.py --host 0.0.0.0 --port \$PORT" > Procfile

# Create Heroku app
heroku create your-daggr-workflow

# Deploy
git init
git add .
git commit -m "Deploy Daggr workflow"
git push heroku main
```

### Get URL
```bash
heroku open
# URL will be: https://your-daggr-workflow.herokuapp.com
```

### Cost
- **Free tier**: Available but with limitations
- **Hobby tier**: $7/month

---

## Option 4: Railway.app

**Best for**: Modern deployment, generous free tier

### Deploy

1. Visit [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `daggr` folder
4. Railway auto-detects Python and deploys
5. Get your URL from the dashboard

### Cost
- **Free tier**: $5 credit/month
- **Pro**: $20/month

---

## Option 5: AWS EC2 (Traditional)

**Best for**: Full control, existing AWS infrastructure

### Quick Setup

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx

# Clone your repo and setup
cd /home/ubuntu
git clone your-repo
cd your-repo/daggr
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run with systemd (persistent)
sudo nano /etc/systemd/system/daggr.service
```

**daggr.service**:
```ini
[Unit]
Description=Daggr Workflow Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/your-repo/daggr
Environment="PATH=/home/ubuntu/your-repo/daggr/venv/bin"
ExecStart=/home/ubuntu/your-repo/daggr/venv/bin/daggr working_retraining_workflow.py --host 0.0.0.0 --port 8080

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl enable daggr
sudo systemctl start daggr

# Setup nginx reverse proxy
sudo nano /etc/nginx/sites-available/daggr
```

**nginx config**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Recommended Approach for Your Project

### For Development/Testing
Use **Railway.app** or **Heroku** - fastest to get started

### For Production
Use **Google Cloud Run** - best integration with Firebase, automatic scaling, cost-effective

---

## Environment Variables

For any deployment option, you may need to set:

```bash
# Port (usually auto-set by platform)
PORT=8080

# Host
HOST=0.0.0.0

# Optional: API keys for AWS/model services
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## Security Considerations

### 1. Authentication
For production, add authentication to your Daggr endpoint:

```python
# Add to your workflow
import os
from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
API_KEY = os.getenv("DAGGR_API_KEY")

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials
```

### 2. CORS Configuration
Always restrict CORS to your actual domains:

```python
allow_origins=[
    "https://your-actual-domain.web.app",
    "https://your-actual-domain.firebaseapp.com"
]
```

### 3. Rate Limiting
Add rate limiting to prevent abuse:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

---

## Testing Your Deployment

### 1. Test the endpoint
```bash
curl https://your-deployed-url.com
```

### 2. Test from React app
Update the URL in `RetrainingTab.tsx` and verify the iframe loads

### 3. Test workflow execution
Run through all 4 stages to ensure everything works

---

## Troubleshooting

### Issue: Iframe not loading
- Check CORS settings
- Verify the URL is accessible
- Check browser console for errors

### Issue: Workflow times out
- Increase timeout settings in your deployment config
- For Cloud Run: `--timeout 3600`

### Issue: High costs
- Set min instances to 0 (scales to zero when not in use)
- Use Cloud Run instead of App Engine
- Add request caching

---

## Next Steps

1. Choose your deployment platform
2. Deploy the Daggr backend
3. Update `DAGGR_URL` in `RetrainingTab.tsx`
4. Rebuild and redeploy your React app to Firebase
5. Test the integration

---

## Quick Start (Cloud Run)

```bash
# 1. Deploy Daggr
cd daggr
gcloud run deploy daggr-workflow --source . --region us-central1 --allow-unauthenticated

# 2. Get URL (copy the output URL)

# 3. Update React app
# Edit src/components/dashboard/RetrainingTab.tsx
# Change: const DAGGR_URL = 'https://your-cloud-run-url'

# 4. Deploy React app
cd ..
npm run build
firebase deploy

# Done! 🎉
```
