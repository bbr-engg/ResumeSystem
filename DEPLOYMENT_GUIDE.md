# Resume System - Deployment Guide 🚀

This guide provides step-by-step deployment instructions for the Resume System Backend (without Docker).

## 🎯 Deployment Options

### Option 1: Railway (Easiest - Recommended) ⭐

Railway provides free PostgreSQL and easy deployment from GitHub.

#### Step 1: Prepare Your Repository
```bash
cd /Users/babarsultan/Documents/ResumeSystem
git init
git add .
git commit -m "Initial commit: Resume System Backend"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL database:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway automatically creates and links the database

#### Step 3: Configure Environment Variables
In Railway dashboard, go to your service → Variables:
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=${{PORT}}
```

#### Step 4: Configure Build Settings
Railway auto-detects NestJS. If needed, set:
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npx prisma migrate deploy && npm run start:prod`

#### Step 5: Deploy
- Railway automatically deploys on git push
- Your API will be available at: `https://your-app.railway.app`

**Estimated Time:** 10 minutes  
**Cost:** Free tier available (500 hours/month)

---

### Option 2: Vercel + Supabase

Vercel for serverless backend, Supabase for PostgreSQL.

#### Step 1: Set up Supabase Database
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Project Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/babarsultan/Documents/ResumeSystem/backend
vercel
```

#### Step 3: Configure Environment Variables in Vercel
```bash
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
```

Or via Vercel dashboard:
- Project Settings → Environment Variables
- Add DATABASE_URL, JWT_SECRET, NODE_ENV

#### Step 4: Update package.json
Add vercel build script:
```json
{
  "scripts": {
    "vercel-build": "npx prisma generate && npx prisma migrate deploy && npm run build"
  }
}
```

**Estimated Time:** 15 minutes  
**Cost:** Free tier available

---

### Option 3: Render

Simple cloud platform with built-in PostgreSQL.

#### Step 1: Create PostgreSQL Database
1. Go to [render.com](https://render.com)
2. New → PostgreSQL
3. Name: `resume-system-db`
4. Copy internal database URL

#### Step 2: Create Web Service
1. New → Web Service
2. Connect GitHub repository
3. Configure:
   - **Name:** resume-system-api
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start:prod`

#### Step 3: Environment Variables
```env
DATABASE_URL=<your-render-postgres-url>
JWT_SECRET=strong-secret-key
NODE_ENV=production
PORT=3000
```

#### Step 4: Deploy
- Render auto-deploys on push
- Available at: `https://resume-system-api.onrender.com`

**Estimated Time:** 15 minutes  
**Cost:** Free tier available (builds can be slow)

---

### Option 4: Heroku

Classic PaaS with PostgreSQL addon.

#### Step 1: Install Heroku CLI
```bash
brew install heroku/brew/heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
cd /Users/babarsultan/Documents/ResumeSystem/backend
heroku create resume-system-api
```

#### Step 3: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

#### Step 4: Configure Environment
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

#### Step 5: Deploy
```bash
git push heroku main
heroku run npx prisma migrate deploy
heroku open
```

**Estimated Time:** 20 minutes  
**Cost:** ~$7/month (no free tier anymore)

---

### Option 5: DigitalOcean App Platform

Developer-friendly PaaS.

#### Step 1: Create App
1. Go to [digitalocean.com/products/app-platform](https://www.digitalocean.com/products/app-platform)
2. Create new app from GitHub
3. Select repository

#### Step 2: Add Database
- Add PostgreSQL database component
- DigitalOcean creates and links automatically

#### Step 3: Configure Build
```yaml
# app.yaml (auto-generated)
services:
  - name: api
    build_command: npm install && npx prisma generate && npm run build
    run_command: npx prisma migrate deploy && npm run start:prod
    environment_slug: node-js
    http_port: 3000
```

#### Step 4: Environment Variables
Add in App Platform dashboard:
```env
DATABASE_URL=${db.DATABASE_URL}
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**Estimated Time:** 15 minutes  
**Cost:** $5/month (basic plan)

---

### Option 6: AWS (EC2 + RDS)

Full control, more complex setup.

#### Step 1: Create RDS PostgreSQL Instance
1. AWS Console → RDS
2. Create database → PostgreSQL
3. Select Free Tier eligible (db.t3.micro)
4. Note endpoint and credentials

#### Step 2: Launch EC2 Instance
1. Launch Ubuntu 22.04 LTS instance
2. Select t2.micro (free tier)
3. Configure security group (ports 80, 443, 22, 3000)

#### Step 3: Connect and Set Up
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
sudo apt-get install postgresql-client

# Clone repository
git clone <your-repo>
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@rds-endpoint:5432/resume_system
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
EOF

# Run migrations
npx prisma migrate deploy

# Build and start
npm run build
npm run start:prod
```

#### Step 4: Set Up Process Manager (PM2)
```bash
# Install PM2
sudo npm install -g pm2

# Start app
pm2 start dist/main.js --name resume-api

# Save PM2 config
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx (Optional)
```bash
sudo apt install nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/default

# Add:
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Restart Nginx
sudo systemctl restart nginx
```

**Estimated Time:** 45-60 minutes  
**Cost:** Free tier available for 12 months

---

## 🔒 Security Checklist

Before deploying to production:

### 1. Environment Variables
- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use production database URL
- [ ] Set NODE_ENV=production
- [ ] Never commit .env files

### 2. Database Security
- [ ] Use strong database password
- [ ] Enable SSL for database connections
- [ ] Restrict database access to application IP only
- [ ] Enable automated backups

### 3. Application Security
- [ ] Configure CORS appropriately (don't use '*' in production)
- [ ] Enable HTTPS (use Let's Encrypt or cloud provider SSL)
- [ ] Set up rate limiting
- [ ] Enable helmet for security headers
- [ ] Implement request logging

### 4. Code Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Review and update dependencies
- [ ] Remove console.logs in production
- [ ] Implement proper error handling

---

## 📊 Post-Deployment Testing

After deployment, test your API:

```bash
# Replace with your deployed URL
API_URL="https://your-app.railway.app/api/v1"

# Test health
curl $API_URL

# Test registration
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Check Swagger docs
open https://your-app.railway.app/api/docs
```

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Migration Failures
```bash
# Reset migrations (⚠️ drops all data)
npx prisma migrate reset

# Deploy specific migration
npx prisma migrate deploy
```

### Build Errors
```bash
# Clear node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Memory Issues
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## 📈 Monitoring & Maintenance

### 1. Application Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Set up uptime monitoring (UptimeRobot, Pingdom)

### 2. Database Monitoring
- Monitor connection pool usage
- Track query performance
- Set up automated backups
- Monitor disk usage

### 3. Logs
```bash
# Railway: View logs in dashboard
# Render: View logs in dashboard
# PM2: pm2 logs resume-api
# Docker: docker logs <container-id>
```

---

## 🚀 CI/CD Setup (Optional)

### GitHub Actions
Create `.github/workflows/deploy.yml`:
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
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      # Add deployment steps for your platform
```

---

## 📞 Need Help?

- Check the main [README.md](backend/README.md)
- Review API docs at `/api/docs`
- Contact support team

---

**Deployment Status:** ✅ Ready for Production

Choose the deployment option that best fits your needs. Railway is recommended for beginners, AWS for full control.

