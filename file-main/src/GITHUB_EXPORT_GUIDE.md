# GitHub Export Guide

This guide helps you export your Caffélino project to GitHub.

---

## Quick Start

### Option 1: Using GitHub CLI (Recommended)

```bash
# 1. Install GitHub CLI
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 2. Login to GitHub
gh auth login

# 3. Navigate to your project
cd /path/to/caffelino

# 4. Initialize git (if not already)
git init

# 5. Create GitHub repository
gh repo create caffelino --public --source=. --remote=origin --push

# Done! Your project is now on GitHub
```

---

### Option 2: Using Git + GitHub Web Interface

#### Step 1: Initialize Git Locally

```bash
# Navigate to project
cd /path/to/caffelino

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Complete Caffélino v1.0.0"
```

#### Step 2: Create Repository on GitHub

1. Go to https://github.com
2. Click "+" → "New repository"
3. Fill in details:
   - **Repository name**: `caffelino`
   - **Description**: `Premium MeetUp Café Platform for Private Friends & Family Gatherings`
   - **Visibility**: Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

#### Step 3: Connect and Push

```bash
# Add remote
git remote add origin https://github.com/yourusername/caffelino.git

# Push to GitHub
git push -u origin main
```

---

### Option 3: Using GitHub Desktop

1. **Download GitHub Desktop**: https://desktop.github.com
2. **Install and login**
3. **Add local repository**:
   - File → Add Local Repository
   - Select your `caffelino` folder
   - If not a git repo, GitHub Desktop will offer to initialize it
4. **Publish repository**:
   - Click "Publish repository"
   - Choose public/private
   - Confirm
5. **Done!**

---

## Pre-Export Checklist

Before pushing to GitHub, ensure:

### 1. Remove Sensitive Data

```bash
# Check for exposed secrets
grep -r "sk_" .  # Stripe keys
grep -r "rzp_" .  # Razorpay keys
grep -r "password" .  # Passwords

# Remove any found secrets
```

### 2. Verify .gitignore

Ensure `.gitignore` contains:

```
node_modules/
.env
.env.local
.env.production
dist/
.DS_Store
```

### 3. Clean Build Artifacts

```bash
# Remove build outputs
rm -rf dist/
rm -rf node_modules/

# Clean cache
npm cache clean --force
```

### 4. Test Clean Install

```bash
# Fresh install
npm install

# Build
npm run build

# If successful, you're good to go!
```

---

## Repository Setup

### Configure Repository Settings

After creating the repository:

1. **About Section** (top right)
   - Description: `Premium MeetUp Café Platform`
   - Website: Your deployed URL
   - Topics: `react`, `typescript`, `tailwind`, `supabase`, `cafe`, `meetup`

2. **Settings → General**
   - Features: Enable Issues, Wikis, Discussions
   - Pull Requests: Enable auto-merge, auto-delete branches

3. **Settings → Branches**
   - Set `main` as default branch
   - Add branch protection rules:
     - Require pull request reviews
     - Require status checks to pass

4. **Settings → Secrets and variables → Actions**
   - Add environment secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_RAZORPAY_KEY_ID`

---

## Organizing Your Repository

### Recommended Structure

```
caffelino/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml (CI/CD)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── components/
├── utils/
├── styles/
├── imports/
├── supabase/
├── .gitignore
├── .env.example
├── README.md
├── INSTALLATION.md
├── ARCHITECTURE.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── CONTRIBUTORS.md
├── SECURITY.md
├── LICENSE
└── package.json
```

### Create Issue Templates

#### Bug Report Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - Device: [e.g. iPhone 12, Desktop]
 - OS: [e.g. iOS 15, Windows 11]
 - Browser: [e.g. Chrome 120, Safari 16]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

#### Feature Request Template

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or any other information.
```

### Create Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe testing approach

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on multiple devices

## Related Issues
Fixes #123
```

---

## Setting Up CI/CD (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## After Pushing to GitHub

### 1. Add Topics

On your repository page:
- Click gear icon next to "About"
- Add topics: `react`, `typescript`, `tailwind-css`, `supabase`, `cafe`, `meetup`, `bill-splitting`, `payments`

### 2. Create Releases

```bash
# Tag your first release
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"
git push origin v1.0.0
```

On GitHub:
- Go to Releases → Create a new release
- Choose tag: v1.0.0
- Title: "v1.0.0 - Initial Release"
- Description: Copy from CHANGELOG.md
- Publish release

### 3. Enable GitHub Pages (for documentation)

Settings → Pages:
- Source: Deploy from branch
- Branch: `main` / `docs` folder
- Save

### 4. Set Up Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

## Collaboration Setup

### Invite Collaborators

Settings → Collaborators and teams:
- Add people by username or email
- Set permissions (Read, Write, Admin)

### Enable Discussions

Settings → Features:
- Enable "Discussions"
- Set up categories:
  - Announcements
  - General
  - Ideas
  - Q&A
  - Show and Tell

---

## Promoting Your Repository

### Add Badges to README

```markdown
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/caffelino?style=social)](https://github.com/yourusername/caffelino/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/caffelino?style=social)](https://github.com/yourusername/caffelino/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/caffelino)](https://github.com/yourusername/caffelino/issues)
[![GitHub License](https://img.shields.io/github/license/yourusername/caffelino)](https://github.com/yourusername/caffelino/blob/main/LICENSE)
```

### Share on Social Media

- Twitter/X: Announce your release
- Reddit: r/reactjs, r/javascript, r/webdev
- Dev.to: Write a blog post
- Product Hunt: Launch your product

---

## Maintaining Your Repository

### Regular Tasks

**Weekly:**
- Review open issues
- Merge approved PRs
- Update dependencies

**Monthly:**
- Security audit (`npm audit`)
- Update documentation
- Review analytics

**Per Release:**
- Update CHANGELOG.md
- Create GitHub release
- Update version in package.json

---

## Troubleshooting

### Issue: Large files rejected

```bash
# Remove large files from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large/file' \
  --prune-empty --tag-name-filter cat -- --all
```

### Issue: Accidentally committed secrets

1. **Remove from history**:
```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

2. **Rotate all exposed keys immediately**

3. **Force push**:
```bash
git push origin --force --all
```

### Issue: Can't push - repository too large

```bash
# Check repository size
git count-objects -vH

# Remove node_modules if accidentally committed
git rm -r --cached node_modules/
echo "node_modules/" >> .gitignore
git commit -m "Remove node_modules"
```

---

## Next Steps

After pushing to GitHub:

1. ✅ Deploy to Vercel/Netlify (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. ✅ Set up custom domain
3. ✅ Enable analytics
4. ✅ Add social media links
5. ✅ Create project website
6. ✅ Write blog post announcement

---

<div align="center">
  <p>Your project is now on GitHub! 🎉</p>
  <p>Made with ☕ by the Caffélino Team</p>
</div>
