# Deployment Checklist

## ✅ Pre-Deployment Setup (Already Done)

- [x] Created Dockerfile for Daggr
- [x] Created deployment script (`daggr/deploy.sh`)
- [x] Updated RetrainingTab to use environment variables
- [x] Created `.env.example` template
- [x] Updated `.gitignore` to exclude `.env` files
- [x] Created comprehensive documentation

## 📋 Deployment Steps

### Step 1: Deploy Daggr Backend

- [ ] Install Google Cloud SDK (if not already installed)
  ```bash
  # Visit: https://cloud.google.com/sdk/docs/install
  ```

- [ ] Login to Google Cloud
  ```bash
  gcloud auth login
  gcloud config set project YOUR_PROJECT_ID
  ```

- [ ] Deploy Daggr to Cloud Run
  ```bash
  cd daggr
  ./deploy.sh
  ```

- [ ] Copy the output URL (e.g., `https://daggr-workflow-xxxxx-uc.a.run.app`)

### Step 2: Configure React App

- [ ] Create `.env` file in project root
  ```bash
  cd ..
  echo "VITE_DAGGR_URL=https://your-cloud-run-url" > .env
  ```

- [ ] Verify the URL is correct
  ```bash
  cat .env
  ```

### Step 3: Test Locally (Optional but Recommended)

- [ ] Start local development server
  ```bash
  npm run dev
  ```

- [ ] Open browser and navigate to Retraining tab

- [ ] Verify Daggr workflow loads from deployed URL

- [ ] Test all 4 workflow stages work correctly

### Step 4: Deploy React App to Firebase

- [ ] Build the React app
  ```bash
  npm run build
  ```

- [ ] Verify build completed successfully
  ```bash
  ls -la dist/
  ```

- [ ] Deploy to Firebase
  ```bash
  firebase deploy
  ```

- [ ] Note the deployed URL (e.g., `https://your-app.web.app`)

### Step 5: Production Testing

- [ ] Visit your Firebase URL

- [ ] Login to the application

- [ ] Navigate to the Retraining tab

- [ ] Verify Daggr workflow loads correctly

- [ ] Test Stage 1: Dataset Preparation
  - [ ] Enter S3 URI
  - [ ] Select model type
  - [ ] Set validation split
  - [ ] Click Run
  - [ ] Verify output appears

- [ ] Test Stage 2: Training Job
  - [ ] Set epochs
  - [ ] Set batch size
  - [ ] Set learning rate
  - [ ] Toggle LoRA if needed
  - [ ] Click Run
  - [ ] Verify training output

- [ ] Test Stage 3: Model Deployment
  - [ ] Select instance type
  - [ ] Configure autoscaling
  - [ ] Click Run
  - [ ] Verify deployment output

- [ ] Test Stage 4: Inference Testing
  - [ ] Enter test input
  - [ ] Set temperature
  - [ ] Click Run
  - [ ] Verify inference results

## 🔒 Security Checklist (Optional but Recommended)

- [ ] Add CORS configuration to Daggr backend
  - [ ] Allow only your Firebase domains
  - [ ] Block other origins

- [ ] Add authentication to Daggr endpoint
  - [ ] Generate API key
  - [ ] Add to environment variables
  - [ ] Update React app to send API key

- [ ] Add rate limiting
  - [ ] Install slowapi
  - [ ] Configure rate limits
  - [ ] Test rate limiting works

- [ ] Enable HTTPS only
  - [ ] Verify Cloud Run uses HTTPS
  - [ ] Update iframe to use HTTPS URL

## 💰 Cost Optimization Checklist

- [ ] Verify min instances is set to 0
  ```bash
  gcloud run services describe daggr-workflow --region us-central1 | grep minInstanceCount
  ```

- [ ] Set up billing alerts
  - [ ] Go to Google Cloud Console
  - [ ] Set budget alert at $10, $20, $50

- [ ] Monitor usage
  - [ ] Check Cloud Run metrics weekly
  - [ ] Review request counts
  - [ ] Optimize if costs are high

## 📊 Monitoring Setup (Optional)

- [ ] Set up Cloud Monitoring
  - [ ] Create dashboard for Daggr service
  - [ ] Add request count metric
  - [ ] Add latency metric
  - [ ] Add error rate metric

- [ ] Set up alerts
  - [ ] Alert on high error rate (>5%)
  - [ ] Alert on high latency (>10s)
  - [ ] Alert on service down

- [ ] Set up logging
  - [ ] Verify logs are being collected
  - [ ] Create log-based metrics
  - [ ] Set up log exports (optional)

## 🚀 CI/CD Setup (Optional)

- [ ] Create GitHub Actions workflow
  - [ ] Auto-deploy Daggr on push to main
  - [ ] Auto-deploy React on push to main

- [ ] Set up staging environment
  - [ ] Deploy to staging first
  - [ ] Test before production
  - [ ] Promote to production

## 🐛 Troubleshooting Checklist

If something doesn't work:

### Daggr Backend Issues

- [ ] Check Cloud Run logs
  ```bash
  gcloud run services logs read daggr-workflow --region us-central1
  ```

- [ ] Verify service is running
  ```bash
  curl https://your-cloud-run-url.com
  ```

- [ ] Check service status
  ```bash
  gcloud run services describe daggr-workflow --region us-central1
  ```

### React App Issues

- [ ] Check browser console for errors

- [ ] Verify `.env` file exists and has correct URL
  ```bash
  cat .env
  ```

- [ ] Verify build includes environment variable
  ```bash
  grep -r "VITE_DAGGR_URL" dist/
  ```

- [ ] Check Firebase hosting logs
  ```bash
  firebase hosting:channel:list
  ```

### Iframe Loading Issues

- [ ] Check CORS errors in browser console

- [ ] Verify iframe src URL is correct
  - [ ] Open browser dev tools
  - [ ] Inspect iframe element
  - [ ] Check src attribute

- [ ] Test URL directly in new tab
  - [ ] Copy iframe URL
  - [ ] Open in new browser tab
  - [ ] Verify it loads

- [ ] Check Content Security Policy
  - [ ] Look for CSP errors in console
  - [ ] Update CSP headers if needed

## 📝 Documentation Checklist

- [ ] Update README.md with deployment instructions

- [ ] Document environment variables

- [ ] Document deployment process for team

- [ ] Create runbook for common issues

## ✨ Post-Deployment

- [ ] Share deployed URL with team

- [ ] Document any issues encountered

- [ ] Update this checklist with lessons learned

- [ ] Celebrate! 🎉

---

## Quick Reference

### Useful Commands

```bash
# Deploy Daggr
cd daggr && ./deploy.sh

# View logs
gcloud run services logs read daggr-workflow --region us-central1

# Update service
gcloud run services update daggr-workflow --region us-central1 --memory 4Gi

# Delete service (if needed)
gcloud run services delete daggr-workflow --region us-central1

# Build React app
npm run build

# Deploy to Firebase
firebase deploy

# View Firebase logs
firebase hosting:channel:list
```

### Important URLs

- **Google Cloud Console**: https://console.cloud.google.com
- **Firebase Console**: https://console.firebase.google.com
- **Cloud Run Documentation**: https://cloud.google.com/run/docs
- **Daggr Documentation**: https://github.com/GradienceAI/daggr

---

## Estimated Time

- **First-time deployment**: 30-45 minutes
- **Subsequent deployments**: 5-10 minutes
- **With CI/CD**: 2-3 minutes (automated)

---

## Support

If you get stuck:

1. Check the logs (Cloud Run and browser console)
2. Review `DAGGR_DEPLOYMENT_GUIDE.md`
3. Check `QUICK_DEPLOY.md` for fast solutions
4. Google Cloud Run documentation
5. Daggr GitHub issues

---

## Notes

- Keep your `.env` file secure (never commit to git)
- Monitor costs regularly
- Test thoroughly before sharing with users
- Document any custom configurations
