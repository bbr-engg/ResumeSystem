# Resume System Backend 🚀

An auto-updating resume ecosystem built with NestJS, PostgreSQL, and Prisma. This system automatically generates and updates resumes based on user achievements from internships, courses, hackathons, and projects.

## 🌟 Features

### Core Functionality
- **🔐 JWT Authentication** - Secure user registration and login
- **👤 User Profile Management** - Complete user profile with achievements and skills
- **📄 Auto-Updating Resumes** - Resumes automatically update when achievements change
- **🏆 Achievement Tracking** - Track internships, courses, hackathons, projects, certifications
- **🔗 Webhook Integration** - External platforms can send webhooks to auto-add achievements
- **✅ Verification System** - Verify achievements from external platforms
- **📊 Statistics & Analytics** - Track achievement statistics and skill progression
- **🎨 Export Functionality** - Export resumes in multiple formats (JSON, PDF coming soon)

### Auto-Update Magic ✨
The system's **key innovation** is automatic resume generation:
1. User adds an achievement (internship, course, hackathon, project)
2. System automatically extracts skills and updates skill list
3. Resume is instantly regenerated with new information
4. Experience and education sections are automatically populated
5. Professional summary is auto-generated based on achievements

## 🛠️ Tech Stack

- **Backend Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Passport
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer
- **Security:** bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v15 or higher)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username@localhost:5432/resume_system?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="7d"

# Application Configuration
PORT=3000
NODE_ENV="development"
```

### 4. Set up PostgreSQL database
```bash
# Create database
createdb resume_system

# Or using psql
psql postgres -c "CREATE DATABASE resume_system;"
```

### 5. Run database migrations
```bash
npx prisma migrate dev
```

### 6. Generate Prisma client
```bash
npx prisma generate
```

### 7. Start the server
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

Once the server is running, access the interactive API documentation:
- **Swagger UI:** http://localhost:3000/api/docs
- **API Base URL:** http://localhost:3000/api/v1

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/me/complete` - Get complete profile with achievements
- `PUT /api/v1/users/me` - Update user profile
- `DELETE /api/v1/users/me` - Delete user account

### Resumes
- `POST /api/v1/resumes` - Create/initialize resume
- `GET /api/v1/resumes` - Get user resume
- `PUT /api/v1/resumes` - Update resume
- `POST /api/v1/resumes/regenerate` - Regenerate resume from achievements (Auto-update)
- `GET /api/v1/resumes/export` - Export resume (JSON/PDF)

### Achievements
- `POST /api/v1/achievements` - Add achievement (auto-updates resume)
- `GET /api/v1/achievements` - Get all achievements
- `GET /api/v1/achievements/stats` - Get achievement statistics
- `GET /api/v1/achievements/:id` - Get single achievement
- `PUT /api/v1/achievements/:id` - Update achievement (auto-updates resume)
- `DELETE /api/v1/achievements/:id` - Delete achievement (auto-updates resume)

### Integrations & Webhooks
- `POST /api/v1/integrations/webhook` - Receive webhook from external platforms
- `GET /api/v1/integrations/webhook-logs` - Get webhook logs
- `GET /api/v1/integrations/stats` - Get integration statistics

## 🧪 Testing

Run the comprehensive test script:
```bash
./test-api.sh
```

This script tests:
- User registration and authentication
- Achievement creation (Internship, Course, Hackathon)
- Auto-resume generation
- Webhook integration
- Export functionality

## 📊 Database Schema

### User Model
- Basic information (name, email, phone, profile image)
- One-to-one relationship with Resume
- One-to-many relationships with Achievements and Skills

### Resume Model
- Auto-generated content from achievements
- Customizable summary, objective, and template style
- JSON fields for experience and education
- Tracks last generation time

### Achievement Model
- Supports 8 types: INTERNSHIP, COURSE, HACKATHON, PROJECT, CERTIFICATION, COMPETITION, WORKSHOP, VOLUNTEER
- Verification system for external platform validation
- Skills and highlights arrays
- Date tracking with start/end dates

### Skill Model
- Auto-added from achievement skills
- Categorized (Programming, Framework, Database, Tools, etc.)
- Proficiency levels (Beginner, Intermediate, Advanced, Expert)
- Endorsement system

## 🔄 How Auto-Update Works

1. **Achievement Created:**
   ```typescript
   // When user adds achievement
   POST /api/v1/achievements
   ```

2. **Skills Auto-Added:**
   - System extracts skills from achievement
   - Automatically creates/updates user's skill list
   - Categorizes skills (Programming, Framework, etc.)

3. **Resume Auto-Regenerated:**
   - Experience section updated with internships
   - Education section updated with courses/certifications
   - Summary auto-generated based on achievements
   - Skills section updated with proficiency levels

4. **Real-Time Updates:**
   - Any achievement update triggers resume regeneration
   - Deleting achievement removes from resume
   - Webhook creates achievement + triggers update

## 🔌 Webhook Integration

External platforms can send webhooks to automatically add achievements:

```bash
POST /api/v1/integrations/webhook
Content-Type: application/json

{
  "platform": "coursera",
  "eventType": "course_completed",
  "userEmail": "user@example.com",
  "data": {
    "courseName": "Machine Learning",
    "description": "Advanced ML course",
    "startDate": "2024-01-01",
    "endDate": "2024-03-01",
    "skills": ["Python", "TensorFlow", "ML"],
    "certificateUrl": "https://coursera.org/cert/123"
  }
}
```

Supported Event Types:
- `course_completed` - Course/certification completion
- `internship_completed` - Internship completion
- `hackathon_participated` - Hackathon participation
- `project_published` - Project publication
- `certification_earned` - Certification earned

## 🚢 Deployment

### Option 1: Railway (Recommended)
1. Sign up at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Set environment variables
6. Deploy!

### Option 2: Vercel + Supabase
1. Create Supabase project for PostgreSQL
2. Deploy to Vercel
3. Configure environment variables
4. Update DATABASE_URL

### Option 3: Render
1. Create Render account
2. Add PostgreSQL database
3. Create Web Service
4. Connect GitHub repository
5. Configure environment variables

### Production Environment Variables
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret-key"
JWT_EXPIRATION="7d"
NODE_ENV="production"
PORT=3000
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                 # JWT authentication module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── strategies/      # Passport JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # User management module
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── resumes/             # Resume management module
│   │   ├── dto/
│   │   ├── resumes.controller.ts
│   │   ├── resumes.service.ts  # 🔥 Auto-update logic
│   │   └── resumes.module.ts
│   ├── achievements/        # Achievement tracking module
│   │   ├── dto/
│   │   ├── achievements.controller.ts
│   │   ├── achievements.service.ts  # 🔥 Triggers auto-update
│   │   └── achievements.module.ts
│   ├── integrations/        # Webhook integration module
│   │   ├── dto/
│   │   ├── integrations.controller.ts
│   │   ├── integrations.service.ts
│   │   └── integrations.module.ts
│   ├── database/            # Prisma database module
│   │   ├── prisma.service.ts
│   │   └── database.module.ts
│   ├── common/              # Common utilities
│   │   ├── decorators/      # Custom decorators
│   │   └── guards/          # Auth guards
│   ├── app.module.ts        # Main application module
│   └── main.ts              # Application entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── test-api.sh              # API testing script
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## 🔐 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **Input Validation:** class-validator for request validation
- **SQL Injection Prevention:** Prisma ORM prevents SQL injection
- **CORS:** Configurable cross-origin resource sharing
- **Environment Variables:** Sensitive data in .env files

## 🎯 Key Implementation Highlights

### 1. Auto-Resume Generation
The `achievements.service.ts` contains the magic:
```typescript
private async triggerResumeUpdate(userId: string) {
  // Automatically regenerates resume when achievements change
  // Extracts experience, education, and generates summary
}
```

### 2. Skill Auto-Addition
When adding achievements, skills are automatically extracted:
```typescript
private async autoAddSkills(userId: string, skills: string[]) {
  // Auto-categorizes and adds skills to user profile
}
```

### 3. Webhook Processing
External platforms can integrate seamlessly:
```typescript
async processWebhook(webhookPayload: WebhookPayloadDto) {
  // Processes webhook, creates achievement, updates resume
}
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql@15
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Migration Issues
```bash
# Reset database and migrations
npx prisma migrate reset
npx prisma migrate dev
```

## 📝 Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Comprehensive JSDoc comments
- Modular architecture with clear separation of concerns

### Adding New Features
1. Create DTOs in respective module's `dto/` folder
2. Implement service logic
3. Add controller endpoints
4. Update Swagger documentation
5. Test thoroughly

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Babar Sultan**
- GitHub: [@babarsultan](https://github.com/babarsultan)

## 🙏 Acknowledgments

- NestJS for the amazing framework
- Prisma for the excellent ORM
- PostgreSQL for reliable database

## 📞 Support

For questions or issues, please:
1. Check the API documentation at `/api/docs`
2. Review this README
3. Open an issue on GitHub
4. Contact the development team

---

## 🎉 Quick Test

After starting the server, run:
```bash
# Test all functionality
./test-api.sh

# Or manually test
curl http://localhost:3000/api/v1
```

Access Swagger docs: **http://localhost:3000/api/docs**

---

**Built with ❤️ using NestJS, PostgreSQL, and Prisma**
