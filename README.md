# Natanel Shani | AI-Driven Product Manager Portfolio

A dynamic, high-end portfolio website built with Next.js, Tailwind CSS, Framer Motion, and Firebase.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Firebase (Firestore, Storage)
- **Features:** Dark/Light mode, Glassmorphism, Responsive design, Dynamic routing

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore**, **Storage**, and **Authentication** (Email/Password sign-in)
3. Copy `.env.example` to `.env.local`
4. Add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore structure

Create a `projects` collection with documents like:

```json
{
  "slug": "competitor-agent",
  "title": "Competitor Research Agent",
  "description": "AI-powered agent for competitor research",
  "tags": ["AI", "LLMs", "Python"],
  "problem": "Manual research is time-consuming",
  "solution": "Autonomous AI agent",
  "impact": "80% time reduction",
  "videoUrl": "https://youtube.com/...",
  "prdUrl": "https://storage.googleapis.com/...",
  "strategyUrl": "https://storage.googleapis.com/...",
  "liveLink": "https://...",
  "order": 1,
  "featured": true
}
```

> **Index:** Add a Firestore composite index on `projects` for `order` (ascending) if you use `orderBy("order")`.

**caseStudies** collection:
```json
{
  "title": "AI Competitor Intelligence",
  "description": "Use case for an AI-powered competitor research agent",
  "useCase": "Product teams need real-time competitor insights...",
  "documentUrl": "https://storage.googleapis.com/.../file.pdf",
  "documentType": "pdf",
  "order": 1
}
```

**labs** collection:
```json
{
  "title": "AI PM Assistant",
  "description": "Internal tool for drafting PRDs with LLM assistance",
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "tags": ["Next.js", "OpenAI"],
  "order": 1
}
```

### 4. Admin mode

1. In Firebase Console → Authentication → Sign-in method, enable **Email/Password**
2. Create a user (e.g. your email + password)
3. Deploy `firestore.rules` and `storage.rules` so only authenticated users can write
4. Visit `/admin` to sign in and edit content (About, Case Studies, Labs)

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── project/[slug]/   # Dynamic project routes
├── components/
│   ├── home/             # Hero, AboutSection, CaseStudiesSection, LabsSection, BentoGrid
│   ├── project/          # ProjectOnePager
│   ├── layout/           # Navbar
│   ├── providers/        # ThemeProvider
│   └── ui/               # ThemeToggle
├── lib/firebase/         # Firebase config & projects service
├── data/                 # Mock projects fallback
└── types/                # TypeScript types
```

## Features

- **Hero:** High-tech aesthetic with animated gradient background
- **Bento Grid:** Interactive project cards with dynamic layout
- **One-Pager:** Problem, Solution, Impact + video + file downloads
- **Case Studies:** Document viewer modal with Use Case descriptions (PDF/DOCX/PPTX)
- **Labs & Side Projects:** GitHub and live links
- **Dark/Light Mode:** Default dark, toggle in nav
- **Responsive:** Premium layout on desktop and mobile
- **Glassmorphism:** Frosted glass nav and cards
- **Admin Panel:** Edit About, Case Studies, Labs; upload documents (auth required)
