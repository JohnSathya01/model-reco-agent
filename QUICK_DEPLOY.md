# Quick Deployment Guide

## Deploy Daggr Backend + React Frontend

### Step 1: Deploy Daggr to Google Cloud Run (5 minutes)

```bash
# Navigate to daggr folder
cd daggr

# Run deployment script
./deploy.sh

# Follow the prompts:
# - Service name: daggr-workflow (or your choice)
# - Region: us-central1 (or your choice)
```

The script will output a URL like:
```
https://daggr-workflow-xxxxx-uc.a.run.app
```

### Step 2: Configure React App

Create a `.env` file in your project root:

```bash
cd ..
echo "VITE_DAGGR_URL=https://daggr-workflow-xxxxx-uc.a.run.app" > .env
```

Replace the URL with your actual Cloud Run URL from Step 1.

### Step 3: Deploy React App to Firebase

```bash
# Build the React app with the new environment variable
npm run build

# Deploy to Firebase
firebase deploy
```

### Step 4: Test

Visit your Firebase URL and navigate to the Retraining tab. The Daggr workflow should load!

---

## Alternative: Quick Test with Railway.app (2 minutes)

If you don't want to use Google Cloud:

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `/daggr`
6. Railway will auto-deploy
7. Copy the generated URL
8. Update `.env` with the Railway URL
9. Rebuild and deploy React app

---

## Cost Comparison

| Platform | Free Tier | Typical Cost | Best For |
|----------|-----------|--------------|----------|
| **Google Cloud Run** | 2M requests/month | $5-20/month | Production, scales to zero |
| **Railway.app** | $5 credit/month | $20/month | Quick deployment |
| **Heroku** | Limited free | $7/month | Simple setup |
| **AWS EC2** | 750 hours/month (1 year) | $10-30/month | Full control |

---

## Troubleshooting

### "gcloud: command not found"
Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install

### "No project is set"
```bash
gcloud config set project YOUR_PROJECT_ID
```

### Iframe not loading in production
1. Check CORS settings in Daggr
2. Verify the URL is accessible: `curl https://your-url.com`
3. Check browser console for errors

### High costs
- Ensure `--min-instances 0` is set (scales to zero)
- Add request caching
- Set up Cloud CDN

---

## Manual Deployment (if script fails)

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

---

## Need Help?

- Google Cloud Run docs: https://cloud.google.com/run/docs
- Railway docs: https://docs.railway.app
- Daggr docs: https://github.com/GradienceAI/daggr
