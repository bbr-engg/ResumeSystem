# 🚀 Deploy to Vercel - Complete Guide

**Status:** Ready to deploy! Follow these steps carefully.

---

## 🎯 Deployment Overview

We'll deploy in this order:
1. **Set up Neon PostgreSQL** (Free cloud database)
2. **Deploy Backend** to Vercel
3. **Deploy Frontend** to Vercel
4. **Connect them together**

**Time Required:** 15-20 minutes

---

## 📊 STEP 1: Set Up Neon PostgreSQL (5 minutes)

### Create Free Database

1. **Go to:** https://neon.tech
2. **Click:** "Sign Up" → "Continue with GitHub"
3. **Create Project:**
   - **Project Name:** `resume-system`
   - **Region:** US East (Ohio) or closest to you
   - **PostgreSQL:** Version 16
   - **Click:** "Create Project"

4. **Get Connection String:**
   - After project is created, you'll see a connection string
   - Click "Copy" on the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   - **Save this!** You'll need it in Step 2

### Alternative: Supabase (Also Free)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database → Connection string (Pooling)

---

## 🔧 STEP 2: Deploy Backend to Vercel (5 minutes)

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to:** https://vercel.com
2. **Login** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Import Repository:**
   - Find and select `ResumeSystem`
   - Click "Import"

5. **Configure Project:**
   - **Root Directory:** Click "Edit" → Select `backend`
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Environment Variables:** Click "Add"
   
   Add these three variables:
   
   **Variable 1:**
   ```
   Name: DATABASE_URL
   Value: [Paste your Neon connection string from Step 1]
   ```
   
   **Variable 2:**
   ```
   Name: JWT_SECRET
   Value: your-super-secret-production-key-2024-change-this
   ```
   
   **Variable 3:**
   ```
   Name: NODE_ENV
   Value: production
   ```

7. **Click:** "Deploy"

8. **Wait for deployment** (2-3 minutes)

9. **Copy Backend URL:**
   - After deployment, you'll see: `https://resume-system-backend-xxx.vercel.app`
   - **Copy this URL!** You'll need it for frontend

10. **Test Backend:**
    - Visit: `https://your-backend-url.vercel.app/api/docs`
    - You should see Swagger documentation!

### Option B: Using Vercel CLI

```bash
cd /Users/babarsultan/Documents/ResumeSystem/backend

# Login to Vercel
vercel login
# Choose: Continue with GitHub

# Deploy
vercel

# Answer prompts:
# Set up and deploy? Y
# Which scope? Your username
# Link to existing project? N
# Project name? resume-system-backend
# Directory? ./
# Override settings? Y
# Build Command? npm run vercel-build
# Output Directory? dist
# Development Command? npm run start:dev

# Add environment variables
vercel env add DATABASE_URL production
# Paste your Neon connection string

vercel env add JWT_SECRET production
# Enter: your-super-secret-production-key-2024

vercel env add NODE_ENV production
# Enter: production

# Deploy to production
vercel --prod
```

---

## 🎨 STEP 3: Deploy Frontend to Vercel (3 minutes)

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to:** https://vercel.com/new
2. **Import `ResumeSystem`** repository again
3. **Configure Project:**
   - **Root Directory:** Click "Edit" → Select `frontend`
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Environment Variables:**
   
   Add one variable:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.vercel.app/api/v1
   ```
   (Use the backend URL from Step 2)

5. **Click:** "Deploy"

6. **Wait for deployment** (1-2 minutes)

7. **Copy Frontend URL:**
   - `https://resume-system-xxx.vercel.app`

### Option B: Using Vercel CLI

```bash
cd /Users/babarsultan/Documents/ResumeSystem/frontend

# Deploy
vercel

# Answer prompts:
# Link to existing project? N
# Project name? resume-system
# Directory? ./
# Override settings? N (Next.js auto-detected)

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-url.vercel.app/api/v1

# Deploy to production
vercel --prod
```

---

## ✅ STEP 4: Verify Everything Works

### Test Backend
```bash
# Visit Swagger docs
open https://your-backend-url.vercel.app/api/docs

# Test health endpoint
curl https://your-backend-url.vercel.app/api/v1
# Expected: {"message":"Unauthorized","statusCode":401}
```

### Test Frontend
```bash
# Open in browser
open https://your-frontend-url.vercel.app

# Should see beautiful landing page!
```

### Test Complete Flow
1. **Open frontend URL**
2. **Click "Get Started"**
3. **Register** new account
4. **Login** → Dashboard
5. **Add Achievement** (via API for now)
6. **View Resume** → See auto-generated resume!

---

## 🔗 STEP 5: Update Backend CORS (Important!)

After deploying, update backend CORS to allow frontend domain:

**Edit:** `backend/src/main.ts`

```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://your-frontend-url.vercel.app'  // Add this
  ],
  credentials: true,
});
```

Then redeploy backend:
```bash
cd /Users/babarsultan/Documents/ResumeSystem/backend
git add .
git commit -m "Update CORS for production frontend"
git push
vercel --prod
```

---

## 🎉 SUCCESS! Your URLs

After deployment, you'll have:

### Production URLs:
- **Frontend:** `https://resume-system-xxx.vercel.app`
- **Backend:** `https://resume-system-backend-xxx.vercel.app`
- **API Docs:** `https://resume-system-backend-xxx.vercel.app/api/docs`

### Features Live:
- ✅ User registration & login
- ✅ Dashboard with statistics
- ✅ Achievement tracking
- ✅ Auto-updating resumes
- ✅ Resume preview & customization
- ✅ Webhook integration
- ✅ Export functionality

---

## 🔧 Troubleshooting

### Backend Build Fails
**Check:**
- DATABASE_URL is set correctly
- Includes `?sslmode=require` at the end
- JWT_SECRET is set
- Build command is `npm run vercel-build`

**Fix:**
- Go to Vercel project → Settings → Environment Variables
- Verify all variables are set
- Redeploy

### Frontend Can't Connect to Backend
**Check:**
- NEXT_PUBLIC_API_URL is set
- Points to correct backend URL
- Includes `/api/v1` at the end

**Fix:**
- Vercel Dashboard → Project → Settings → Environment Variables
- Update NEXT_PUBLIC_API_URL
- Redeploy

### Database Connection Fails
**Check:**
- Neon database is running
- Connection string is correct
- SSL mode is enabled

**Fix:**
```bash
# Test connection
npx prisma db pull --schema=./backend/prisma/schema.prisma
```

### CORS Error
**Fix:**
Update `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'https://your-frontend.vercel.app'],
  credentials: true,
});
```

---

## 📝 Environment Variables Summary

### Backend (Vercel):
```
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-production-key-2024
NODE_ENV=production
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api/v1
```

---

## 🎯 Quick Start Commands

### If Using Vercel CLI:

```bash
# Login once
vercel login

# Deploy Backend
cd /Users/babarsultan/Documents/ResumeSystem/backend
vercel --prod

# Deploy Frontend
cd /Users/babarsultan/Documents/ResumeSystem/frontend
vercel --prod
```

### If Using Vercel Dashboard:

1. **Neon Database:** https://neon.tech → Create project → Copy connection string
2. **Backend:** https://vercel.com/new → Import repo → Root: `backend` → Add env vars → Deploy
3. **Frontend:** https://vercel.com/new → Import repo → Root: `frontend` → Add env vars → Deploy

---

## 🚀 Recommended Approach (Easiest)

**I recommend using Vercel Dashboard for easier deployment:**

1. ✅ **Step 1:** Create Neon database (https://neon.tech)
2. ✅ **Step 2:** Deploy backend via Vercel dashboard
3. ✅ **Step 3:** Deploy frontend via Vercel dashboard
4. ✅ **Step 4:** Test everything works!

**Total time: 15 minutes**

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Check CORS settings

---

## 🎉 You're Ready!

**Your Resume System is ready for deployment! Just follow the steps above.**

**Recommended:** Use Vercel Dashboard for the easiest experience.

**Start here:** 
1. https://neon.tech (database)
2. https://vercel.com/new (deployment)

**Good luck! 🚀**

