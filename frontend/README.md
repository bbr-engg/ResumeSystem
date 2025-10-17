# Resume System - Frontend 🎨

Modern, responsive frontend for the Resume System built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

### 📄 Resume Preview & Customization
- **Beautiful Resume Preview** - Modern, professional layout with color-coded sections
- **Real-time Customization** - Edit resume title, summary, objective, and template style
- **Auto-Regeneration** - One-click button to regenerate resume from latest achievements
- **Export Functionality** - Download resume as JSON (PDF coming soon)
- **Tabbed Interface** - Switch between Preview and Customize modes

### 🔐 Authentication
- User registration with validation
- Secure login with JWT tokens
- Auto-redirect for authenticated users
- Responsive split-screen design

### 📊 Dashboard
- Welcome section with user greeting
- Statistics cards (Achievements, Skills, Verified, Resume)
- Recent achievements list with type badges
- Skills display with proficiency levels
- Quick actions (View Resume, Add Achievement, Logout)

### 🎨 Modern UI/UX
- Gradient backgrounds and smooth animations
- Color-coded achievement types
- Verification badges for verified achievements
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications
- Hover effects and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your API URL (default: http://localhost:3000/api/v1)

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                       # Next.js 14 App Router
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/                # Authentication page
│   ├── dashboard/            # Dashboard page
│   └── resume/               # Resume page (Preview & Customize)
├── components/
│   ├── resume/
│   │   ├── ResumePreview.tsx          # 📄 Resume preview component
│   │   └── ResumeCustomization.tsx    # ✏️ Resume customization form
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── api.ts               # API client with axios
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
└── public/                   # Static assets
```

## 🎯 Key Components

### 1. ResumePreview Component

**Location:** `components/resume/ResumePreview.tsx`

Beautiful, professional resume preview with:
- Gradient header with user info
- Color-coded sections (Experience, Education, Skills)
- Verification badges for verified achievements
- Timeline view for experience
- Skills grid with proficiency levels
- Notable achievements highlight

**Props:**
```typescript
interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}
```

### 2. ResumeCustomization Component

**Location:** `components/resume/ResumeCustomization.tsx`

Interactive customization form with:
- Edit resume title, summary, and objective
- Template style selector
- Public/private toggle
- Auto-regenerate button (pulls latest achievements)
- Save button with loading state
- Pro tips section

**Props:**
```typescript
interface ResumeCustomizationProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
}
```

### 3. Resume Page

**Location:** `app/resume/page.tsx`

Main resume page featuring:
- Tabbed interface (Preview / Customize)
- Export and Share buttons
- Automatic resume creation if none exists
- Loading states
- Error handling

## 🎨 Design Features

### Color Scheme
- **Primary:** Blue (#2563eb) and Indigo (#4f46e5)
- **Secondary:** Purple (#9333ea) and Pink (#ec4899)
- **Success:** Green (#10b981)
- **Warning:** Orange (#f59e0b)
- **Error:** Red (#ef4444)

### Achievement Type Colors
- **INTERNSHIP:** Blue
- **COURSE:** Green
- **HACKATHON:** Purple
- **PROJECT:** Orange
- **CERTIFICATION:** Teal
- **COMPETITION:** Pink
- **WORKSHOP:** Indigo
- **VOLUNTEER:** Yellow

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, large sizes for hierarchy
- **Body:** Regular weight, comfortable line height

## 🔌 API Integration

The frontend connects to the backend API using axios:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
```

### API Endpoints Used

**Auth:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

**Users:**
- `GET /users/me` - Get current user
- `GET /users/me/complete` - Get complete profile
- `PUT /users/me` - Update profile

**Resumes:**
- `GET /resumes` - Get user resume
- `POST /resumes` - Create resume
- `PUT /resumes` - Update resume
- `POST /resumes/regenerate` - **Auto-regenerate from achievements**
- `GET /resumes/export` - Export resume

**Achievements:**
- `GET /achievements` - Get all achievements
- `GET /achievements/stats` - Get statistics
- `POST /achievements` - Add achievement

## 🔒 Authentication Flow

1. User logs in → JWT token stored in `localStorage`
2. Token automatically attached to API requests via axios interceptor
3. Protected routes check for token, redirect to login if missing
4. 401 responses auto-logout user

```typescript
// Axios interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile:** Stacked layout, hamburger menu (if added)
- **Tablet:** 2-column grids where appropriate
- **Desktop:** Full layout with sidebars and multi-column grids

Breakpoints (Tailwind):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🎭 User Experience Features

### Loading States
- Skeleton loaders for content
- Spinner animations
- Disabled buttons during actions
- Progress indicators

### Error Handling
- Form validation with error messages
- API error handling with user-friendly messages
- 404 page for not found
- Network error handling

### Animations
- Smooth transitions on hover
- Fade in/out for notifications
- Slide animations for modals
- Spin animations for loaders

## 🧪 Testing the Application

### Test Flow
1. **Landing Page** → Open http://localhost:3001
2. **Register** → Create new account
3. **Dashboard** → View empty state
4. **Add Achievement** → (Manual API call for now, UI coming soon)
5. **View Resume** → Navigate to Resume page
6. **Preview** → See auto-generated resume
7. **Customize** → Edit summary and title
8. **Regenerate** → Click auto-regenerate button
9. **Export** → Download resume as JSON

### Quick Test with Backend
```bash
# Make sure backend is running
cd ../backend
npm run start:dev

# Start frontend
cd ../frontend
npm run dev

# Open http://localhost:3001
# Register → Dashboard → Resume
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: .next

# Environment variables:
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 Future Enhancements

Potential features to add:
1. **Add Achievement Modal** - In-app form to create achievements
2. **PDF Export** - Generate PDF resumes with custom templates
3. **Multiple Templates** - Choose from different resume layouts
4. **Drag & Drop** - Reorder sections
5. **Real-time Collaboration** - Share and get feedback
6. **Public Profiles** - Shareable resume links
7. **Analytics** - Track resume views
8. **Cover Letter Generator** - AI-powered cover letters

## 📚 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **date-fns** - Date utilities
- **lucide-react** - Icon library

## 🐛 Troubleshooting

### API Connection Issues
```bash
# Check backend is running
curl http://localhost:3000/api/v1

# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Restart frontend
npm run dev
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

For issues or questions:
1. Check the main [README.md](../README.md)
2. Review API docs at http://localhost:3000/api/docs
3. Check backend logs for API errors

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**

## 🎉 Features Showcase

### Resume Preview Page
- Modern, professional layout
- Real-time content from backend
- Verification badges
- Skills and achievements display
- Export functionality

### Customization Page
- Inline editing of resume content
- Template style selection
- One-click auto-regeneration
- Save with validation
- User-friendly tips

**The frontend is production-ready and fully integrated with the backend! 🚀**
