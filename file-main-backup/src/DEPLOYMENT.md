# 🚀 Deployment Guide

Complete guide for deploying Caffélino to production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Building for Production](#building-for-production)
4. [Deployment Platforms](#deployment-platforms)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database schema deployed to Supabase
- [ ] Production build tested (`npm run build`)
- [ ] Security audit completed
- [ ] Analytics/monitoring setup
- [ ] Domain name registered (if custom domain)
- [ ] SSL certificate ready (usually automatic)
- [ ] Error tracking configured
- [ ] Backup strategy in place

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production`:

```env
# Supabase (Production)
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# App Configuration
VITE_APP_NAME=Caffélino
VITE_APP_URL=https://caffelino.com

# Payment Gateway (Production)
VITE_RAZORPAY_KEY_ID=your-production-key-id
VITE_RAZORPAY_KEY_SECRET=your-production-key-secret

# Feature Flags
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_NOTIFICATIONS=true

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Debug Mode (FALSE in production!)
VITE_DEBUG_MODE=false
```

### 2. Security Considerations

**DO NOT:**
- Commit `.env.production` to Git
- Use development keys in production
- Expose sensitive keys in frontend code
- Use `VITE_DEBUG_MODE=true` in production

**DO:**
- Use environment variables for secrets
- Enable RLS in Supabase
- Use HTTPS only
- Implement rate limiting
- Set up CORS properly

---

## Building for Production

### 1. Clean Build

```bash
# Remove old builds
rm -rf dist node_modules/.vite

# Clean install dependencies
npm ci

# Build for production
npm run build
```

### 2. Test Production Build Locally

```bash
# Preview production build
npm run preview

# Should open http://localhost:4173
```

### 3. Build Optimization Checklist

- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Bundle size analyzed
- [ ] Tree shaking verified
- [ ] CSS purged (Tailwind)
- [ ] Source maps configured

### 4. Analyze Bundle Size

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true
    })
  ]
});

# Build and analyze
npm run build
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Excellent React support

**Steps:**

#### A. Install Vercel CLI

```bash
npm install -g vercel
```

#### B. Login to Vercel

```bash
vercel login
```

#### C. Deploy

```bash
# First deployment (interactive)
vercel

# Follow prompts:
# - Set project name
# - Set root directory
# - Build command: npm run build
# - Output directory: dist

# Production deployment
vercel --prod
```

#### D. Configure Environment Variables

```bash
# Via CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Or via Vercel Dashboard:
# Settings → Environment Variables
```

#### E. Auto-Deploy from Git

1. Connect GitHub repository
2. Import project to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables
5. Deploy

**Automatic deployments:**
- Push to `main` → Production deploy
- Push to other branches → Preview deploy

---

### Option 2: Netlify

**Why Netlify:**
- Easy setup
- Free SSL
- Form handling
- Split testing

**Steps:**

#### A. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### B. Login

```bash
netlify login
```

#### C. Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### D. Deploy

```bash
# Test deployment
netlify deploy

# Production deployment
netlify deploy --prod
```

#### E. Configure Environment Variables

Via Netlify Dashboard:
- Site settings → Build & deploy → Environment
- Add all `VITE_*` variables

---

### Option 3: Firebase Hosting

**Why Firebase:**
- Google infrastructure
- Free tier
- Easy integration with Firebase services

**Steps:**

#### A. Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### B. Login

```bash
firebase login
```

#### C. Initialize

```bash
firebase init hosting

# Select:
# - Use existing project or create new
# - Public directory: dist
# - Single-page app: Yes
# - Set up automatic builds: No (or Yes for GitHub Actions)
```

#### D. Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy --only hosting
```

#### E. Configure Environment

Firebase doesn't support `.env` directly. Use build-time replacements:

```javascript
// firebase.json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

### Option 4: AWS S3 + CloudFront

**Why AWS:**
- Scalable
- Complete control
- Professional infrastructure

**Steps:**

#### A. Create S3 Bucket

```bash
# Via AWS CLI
aws s3 mb s3://caffelino-app --region us-east-1

# Enable static website hosting
aws s3 website s3://caffelino-app --index-document index.html --error-document index.html
```

#### B. Build and Upload

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://caffelino-app --delete

# Set public read permissions
aws s3 ls s3://caffelino-app --recursive | awk '{print $4}' | \
  xargs -I {} aws s3api put-object-acl --bucket caffelino-app --key {} --acl public-read
```

#### C. Create CloudFront Distribution

1. Go to AWS CloudFront console
2. Create distribution
3. Origin: `caffelino-app.s3.amazonaws.com`
4. Enable HTTPS
5. Set custom error response: 403 → /index.html (for SPA routing)

#### D. Configure DNS

Point your domain to CloudFront distribution.

---

### Option 5: Docker Deployment

**For advanced users**

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t caffelino:latest .

# Run container
docker run -p 80:80 caffelino:latest
```

---

## Post-Deployment

### 1. Verify Deployment

**Checklist:**
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images load properly
- [ ] Forms work
- [ ] Payments process (test mode)
- [ ] Database connections work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate valid

### 2. Configure Custom Domain

#### Vercel
```bash
# Add domain via CLI
vercel domains add caffelino.com

# Or via dashboard: Settings → Domains
```

#### Netlify
```bash
# Via dashboard: Domain settings → Add custom domain
```

### 3. Set Up Analytics

#### Google Analytics

```typescript
// Add to index.html or App.tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. Error Tracking with Sentry

```bash
npm install @sentry/react
```

```typescript
// App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 5. Performance Monitoring

Use:
- **Lighthouse** - Run audits
- **WebPageTest** - Performance testing
- **GTmetrix** - Speed analysis

---

## Monitoring & Maintenance

### 1. Health Checks

Set up monitoring:
- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Performance monitoring
- **StatusCake** - Global monitoring

### 2. Database Backups

#### Supabase Auto-Backups
- Pro plan: Daily automatic backups
- Free plan: Manual exports

#### Manual Backup
```bash
# Export database
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### 3. Logs and Debugging

#### Vercel Logs
```bash
vercel logs
```

#### Netlify Logs
Via dashboard: Deploys → [deployment] → Logs

### 4. Continuous Deployment

#### GitHub Actions (Example)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 5. Security Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Update packages
npm update
```

### 6. Performance Optimization

**After deployment:**
- Enable compression (gzip/brotli)
- Configure CDN caching
- Optimize images (lazy loading)
- Implement service workers (PWA)
- Add preloading for critical assets

---

## Rollback Strategy

### Quick Rollback

#### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

#### Netlify
Via dashboard: Deploys → Select previous deploy → Publish

#### Git-based
```bash
# Revert last commit
git revert HEAD

# Push
git push origin main
```

---

## Troubleshooting Deployment Issues

### Issue: Build fails

**Solution:**
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try local build
npm run build
```

### Issue: Environment variables not working

**Solution:**
- Ensure variables start with `VITE_`
- Rebuild after adding variables
- Check platform-specific env var syntax

### Issue: Routes return 404

**Solution:**
Add rewrite rules for SPA:

**Vercel** - `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** - `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Images not loading

**Solution:**
- Check `figma:asset` imports
- Verify image paths
- Check CORS headers
- Ensure images copied to `dist/`

---

## Cost Estimation

### Vercel
- **Hobby (Free)**: Perfect for MVP
- **Pro ($20/month)**: Production-ready
- **Enterprise**: Custom pricing

### Netlify
- **Free**: 100GB bandwidth
- **Pro ($19/month)**: 400GB bandwidth

### Firebase
- **Spark (Free)**: 10GB storage, 360MB/day
- **Blaze (Pay as you go)**: After free tier

### AWS
- **S3**: ~$0.023 per GB
- **CloudFront**: ~$0.085 per GB (first 10TB)
- Estimated: $5-50/month depending on traffic

---

## Production Checklist

Final checks before going live:

- [ ] Domain configured and SSL active
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Seed data loaded (if needed)
- [ ] Analytics tracking verified
- [ ] Error tracking active
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] SEO meta tags added
- [ ] Favicon and PWA icons set
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Privacy policy page added
- [ ] Terms of service page added
- [ ] Contact information updated
- [ ] Social media cards configured
- [ ] Monitoring/alerts configured
- [ ] Backup strategy tested
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done

---

<div align="center">
  <p>Made with ☕ by the Caffélino Team</p>
  <p>Ready to launch! 🚀</p>
</div>
