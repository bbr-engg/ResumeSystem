# Vercel Deployment Guide 🚀

Complete guide to deploy both Backend (NestJS) and Frontend (Next.js) to Vercel.

---

## 🎯 Deployment Strategy

Since Vercel is optimized for serverless, we'll use:
- **Frontend:** Deploy directly to Vercel ✅
- **Backend:** Deploy to Vercel Serverless Functions (requires some adjustments)
- **Database:** Use **Neon PostgreSQL** (Free, serverless, perfect for Vercel)

---

## 📊 Step 1: Set Up Neon PostgreSQL (Free Cloud Database)

### Create Neon Database

1. **Go to:** https://neon.tech
2. **Sign up** with GitHub
3. **Create New Project:**
   - Name: `resume-system`
   - Region: Choose closest to you
   - PostgreSQL version: 15 or 16
4. **Copy Connection String:**
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
5. **Save it** - you'll need it for deployment!

### Alternative: Supabase
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database

---

## 🚀 Step 2: Deploy Backend to Vercel

### Option A: Using Vercel Dashboard (Easier)

1. **Go to:** https://vercel.com/new
2. **Import Git Repository:**
   - Select your `ResumeSystem` repo
   - Root Directory: `backend`
3. **Framework Preset:** Other
4. **Build Command:**
   ```bash
   npm install && npx prisma generate && npm run build
   ```
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

7. **Environment Variables:** Add these
   ```
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=your-strong-secret-key-change-this-in-production
   NODE_ENV=production
   ```

8. **Click Deploy!**

### Option B: Using Vercel CLI

```bash
cd /Users/babarsultan/Documents/ResumeSystem/backend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name? resume-system-backend
# - Directory? ./
# - Override settings? Y
# - Build Command? npm install && npx prisma generate && npm run build
# - Output Directory? dist
# - Development Command? npm run start:dev

# Set environment variables
vercel env add DATABASE_URL production
# Paste your Neon connection string

vercel env add JWT_SECRET production
# Enter a strong secret key

vercel env add NODE_ENV production
# Enter: production

# Deploy to production
vercel --prod
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### Option A: Vercel Dashboard

1. **Go to:** https://vercel.com/new
2. **Import Repository:** Select `ResumeSystem`
3. **Root Directory:** `frontend`
4. **Framework Preset:** Next.js (auto-detected)
5. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api/v1
   ```
6. **Click Deploy!**

### Option B: Vercel CLI

```bash
cd /Users/babarsultan/Documents/ResumeSystem/frontend

# Login
vercel login

# Deploy
vercel

# Follow prompts (mostly auto-detected)

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-url.vercel.app/api/v1

# Deploy to production
vercel --prod
```

---

## 🔧 Step 4: Backend Adjustments for Vercel Serverless

Vercel uses serverless functions. Let me create the necessary configuration:

### Create `vercel.json` in backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Update `package.json` in backend:

Add these scripts:
```json
{
  "scripts": {
    "vercel-build": "npx prisma generate && npx prisma migrate deploy && npm run build",
    "start:vercel": "node dist/main"
  }
}
```

---

## 🗄️ Step 5: Run Database Migrations

After backend is deployed:

```bash
# Set DATABASE_URL locally to your Neon database
export DATABASE_URL="your-neon-connection-string"

# Run migrations
cd /Users/babarsultan/Documents/ResumeSystem/backend
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

---

## ✅ Step 6: Verify Deployment

### Backend
- Visit: `https://your-backend.vercel.app/api/v1`
- Should see: `{"message":"Unauthorized","statusCode":401}`
- API Docs: `https://your-backend.vercel.app/api/docs`

### Frontend
- Visit: `https://your-frontend.vercel.app`
- Should see: Landing page with "Resume System"

---

## 🔗 Step 7: Connect Frontend to Backend

Update frontend environment variable on Vercel:

```bash
# Go to: https://vercel.com/your-username/frontend/settings/environment-variables
# Add:
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api/v1

# Redeploy frontend
vercel --prod
```

---

## 🎯 Quick Deployment (Recommended)

### Using Vercel Dashboard (Easiest):

**1. Deploy Frontend First:**
- Go to https://vercel.com/new
- Import `ResumeSystem` repo
- Root Directory: `frontend`
- Deploy

**2. Set Up Neon Database:**
- Create at https://neon.tech
- Copy connection string

**3. Deploy Backend:**
- Import `ResumeSystem` repo again
- Root Directory: `backend`
- Add DATABASE_URL environment variable
- Add JWT_SECRET environment variable
- Deploy

**4. Update Frontend:**
- Add NEXT_PUBLIC_API_URL with backend URL
- Redeploy

---

## 🐛 Troubleshooting

### Backend Won't Start on Vercel
- Check build logs
- Verify DATABASE_URL is set
- Ensure Prisma is generated
- Check for build errors

### Database Connection Issues
```bash
# Test connection locally
npx prisma db pull

# Check connection string format
# Should include ?sslmode=require for Neon
```

### Frontend Can't Connect to Backend
- Verify NEXT_PUBLIC_API_URL is set
- Check CORS is enabled in backend
- Verify backend is deployed and running

---

## 💡 Alternative: Railway (Easier for Backend)

If Vercel backend is complex, use Railway for backend:

```bash
# Backend on Railway (has PostgreSQL built-in)
# Frontend on Vercel (optimized for Next.js)

# This is actually recommended!
```

See `DEPLOYMENT_GUIDE.md` for Railway instructions.

---

## 🎉 Expected URLs

After deployment:
- **Frontend:** `https://resume-system.vercel.app`
- **Backend:** `https://resume-system-backend.vercel.app`
- **API Docs:** `https://resume-system-backend.vercel.app/api/docs`

---

**Let's start deploying! 🚀**

