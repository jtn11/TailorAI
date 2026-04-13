# 🧠 TailorAI — Next-Gen AI Career Co-Pilot

TailorAI is a full-stack, AI-powered web application that acts as your end-to-end career co-pilot. It seamlessly extracts resume content from PDFs, evaluates skill alignment with job requirements, generates actionable insights (including a match score and AI-generated cover letter), and now **finds live matching jobs across the web using the jSearch RapidAPI**.

---

## 🚀 Features

### 📄 Resume Upload & Parsing
*   Upload resumes in PDF format.
*   Client-side text extraction using PDF.js.
*   Clean, structured text passed securely to the AI for analysis.

### 📝 Job Description Analysis
*   Users paste target job descriptions.
*   AI understands role requirements, seniority, and expectations.

### 🤖 AI-Driven Resume Evaluation
*   Uses Groq LLM (LLaMA 3.1) for lightning-fast inference.
*   Generates:
    *   **Resume–Job Match Score**.
    *   **Missing Skills and Keyword gaps**.
    *   **Improvement suggestions** tailored specifically to the posting.
    *   **Personalized AI-generated Cover Letter** (Exportable directly to PDF).

### 🌐 Smart Web Job Matching (jSearch Integration)
*   Automatically connects your optimized resume footprint to the **jSearch RapidAPI**.
*   Searches the web for live, active job listings matching your specific role and location.
*   **Dual-Input Search**: Filter actively by "Role" and specific "Locations".
*   **Remote-Only Filtering**: Toggle to exclusively find remote opportunities.

### 📊 Match Score & Insights UI
*   High-fidelity, glassmorphic UI matching enterprise SaaS standards.
*   Visual match percentage indicators with color-coded skill gaps.
*   Optimized layout for ATS keyword alignment understanding.

### 🧾 History & Persistence
*   Stores past resume analyses per user securely in Firestore.
*   Fetch and view previous analysis sessions from the sleek sidebar.
*   Delete history entries instantly from the dashboard.

### 🔐 Authentication & Security
*   User authentication via Firebase Authentication.
*   Secure server-side access using Firebase Admin SDK.
*   Secret Serverless API proxies (protecting `RAPIDAPI_KEY` from client exposure).

---

## 🏗️ Tech Stack

**Frontend**
*   Next.js 15 (App Router)
*   TypeScript & React
*   Tailwind CSS (Advanced Glassmorphism & Animations)
*   Lucide React (Iconography)
*   Context API for state management

**Backend (Serverless)**
*   Next.js Serverless API Routes
*   Groq SDK (LLaMA 3.1 model)
*   **jSearch API via RapidAPI** (Live Web Job Scraping)
*   Firebase Admin SDK & Firestore

**Testing & CI**
*   Jest for unit testing.
*   AI service mocking for deterministic tests.
*   GitHub Actions CI pipeline (Install, Test, Build Verification).

---

## 🔐 Environment Variables Configuration

To run TailorAI locally, create an `.env.local` file at the root of the project with the following keys:

```env
# AI Models
GROQ_API_KEY=\***\*

# Live Job Scraping Configuration
RAPIDAPI_KEY=\***\*

# Firebase Authentication & DB
FIREBASE_ADMIN_KEY=\*\***
NEXT_PUBLIC_FIREBASE_API_KEY=\***\*
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=\*\***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=\***\*
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=\*\***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=\***\*
NEXT_PUBLIC_FIREBASE_APP_ID=\*\***
```

*(Note: Firebase Admin key should be stored as single-line JSON with escaped newlines for production safety.)*

---

## 📈 Why TailorAI?

TailorAI bridges the gap between static resume-reviewers and live job hunting. By combining lightning-fast Groq AI architecture, robust Firebase persistence, and live jSearch API scraping, it delivers a modern, production-grade Career Co-Pilot built with modern full-stack best practices.
