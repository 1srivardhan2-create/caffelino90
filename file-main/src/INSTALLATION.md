# 📦 Installation Guide

Complete step-by-step installation and setup guide for Caffélino.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation Steps](#installation-steps)
4. [Supabase Setup (Optional)](#supabase-setup-optional)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should show v18+
  ```
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
  ```bash
  npm --version   # Should show v9+
  ```

### Optional
- **Git** (for version control)
- **VS Code** (recommended editor)
- **Supabase Account** (for production database)

---

## Environment Setup

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/caffelino.git

# OR using SSH
git clone git@github.com:yourusername/caffelino.git

# Navigate to project directory
cd caffelino
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

This will install all required packages including:
- React 18+
- TypeScript 5+
- Tailwind CSS v4
- Motion (Framer Motion)
- ShadCN UI components
- Lucide React icons
- React Router
- And 60+ other dependencies

### 3. Verify Installation

```bash
# Check if node_modules was created
ls -la node_modules

# Check package.json
cat package.json
```

---

## Supabase Setup (Optional)

The app works fully with **demo data** without Supabase. Connect Supabase only for production persistence.

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in details:
   - **Name**: Caffelino
   - **Database Password**: (strong password)
   - **Region**: (closest to your users)
5. Click "Create new project"

### Step 2: Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** API key

### Step 3: Set Up Database Schema

Run the SQL schema from `DATABASE_ARCHITECTURE.md`:

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy the schema from `/DATABASE_ARCHITECTURE.md`
4. Click "Run"

The schema includes tables for:
- Users
- Cafes
- Meetups
- Orders
- Payments
- Notifications
- And more...

---

## Configuration

### 1. Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Edit Environment Variables

Open `.env.local` and add your values:

```env
# Supabase Configuration (Optional - app works without this)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=Caffélino
VITE_APP_URL=http://localhost:3000

# Payment Gateway (Razorpay)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Feature Flags
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_PAYMENTS=false
VITE_ENABLE_NOTIFICATIONS=true

# Debug Mode
VITE_DEBUG_MODE=true
```

> **Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.

### 3. Configure Demo Data (Optional)

If running without Supabase, the app uses demo data from:
- `/utils/cafesData.ts` - Café listings
- `/utils/mockMeetups.ts` - Sample meetups
- `/utils/mockGroups.ts` - Sample groups

You can customize this data by editing these files.

---

## Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# OR with yarn
yarn dev
```

The app will be available at:
- **Local**: `http://localhost:3000`
- **Network**: `http://192.168.x.x:3000` (for mobile testing)

### Production Build

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

### Testing on Mobile Devices

1. Ensure your mobile device is on the same network
2. Start dev server: `npm run dev`
3. Note the network URL (e.g., `http://192.168.1.100:3000`)
4. Open this URL on your mobile browser

---

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

---

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# OR run on different port
npm run dev -- --port 3001
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript version
npm list typescript

# Should be 5.x.x
# If not, reinstall
npm install typescript@latest
```

### Issue: Tailwind styles not working

**Solution:**
```bash
# Verify Tailwind v4 is installed
npm list tailwindcss

# Clear cache and rebuild
rm -rf .next dist
npm run build
```

### Issue: Supabase connection fails

**Solution:**
1. Verify `.env.local` has correct values
2. Check Supabase project status in dashboard
3. Verify API keys are not expired
4. Check browser console for specific errors

### Issue: LocalStorage errors (403)

**Solution:**
The app includes a `safeStorage` utility that handles this automatically. If you still see errors:

1. Check if browser is in private/incognito mode
2. Clear browser data and cookies
3. Try a different browser

### Issue: Images not loading

**Solution:**
```bash
# Verify assets exist
ls -la imports/

# Check ImageWithFallback component
cat components/figma/ImageWithFallback.tsx

# Verify figma:asset imports are correct (no ./ prefix)
```

---

## VS Code Setup (Recommended)

### Recommended Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Folder Permissions

Ensure proper permissions:

```bash
# Make sure you own the project folder
sudo chown -R $USER:$USER .

# Set proper permissions
chmod -R 755 .
```

---

## Database Setup (Detailed)

If using Supabase, follow these steps:

### 1. Run Migration Scripts

```bash
# Navigate to supabase folder
cd supabase

# Initialize Supabase (if not done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 2. Seed Demo Data

```sql
-- Run this in Supabase SQL Editor
-- See DATABASE_QUICK_REFERENCE.md for complete seed data
```

### 3. Verify Tables

```bash
# Check tables exist
supabase db list
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_SUPABASE_URL` | No | - | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | - | Supabase anonymous key |
| `VITE_APP_NAME` | No | Caffélino | App name |
| `VITE_APP_URL` | No | localhost:3000 | App URL |
| `VITE_ENABLE_SUPABASE` | No | false | Enable Supabase |
| `VITE_ENABLE_PAYMENTS` | No | false | Enable real payments |
| `VITE_DEBUG_MODE` | No | false | Debug logging |

---

## Next Steps

After installation:

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. ✅ Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. ✅ Review [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for testing
4. ✅ See [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute

---

## Getting Help

- **Documentation Issues**: [GitHub Issues](https://github.com/yourusername/caffelino/issues)
- **Setup Help**: support@caffelino.com
- **Community**: [Discord Server](#) (coming soon)

---

## Quick Start Summary

```bash
# 1. Clone
git clone https://github.com/yourusername/caffelino.git
cd caffelino

# 2. Install
npm install

# 3. Configure (optional)
cp .env.example .env.local
# Edit .env.local with your values

# 4. Run
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

That's it! 🎉 You should now have Caffélino running locally.

---

<div align="center">
  <p>Made with ☕ by the Caffélino Team</p>
</div>
