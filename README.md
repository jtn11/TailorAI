🧠 TailorAI — AI-Powered Resume Analysis Platform

TailorAI is a full-stack AI-powered web application that helps users analyze and improve their resumes for specific job descriptions.
It extracts resume content from PDFs, evaluates skill alignment with job requirements, and generates actionable insights — including a match score, missing skills, keyword gaps, and an AI-generated cover letter.

🚀 Features

📄 Resume Upload & Parsing
Upload resumes in PDF format
Client-side text extraction using PDF.js
Clean, structured text passed to AI for analysis

📝 Job Description Analysis

Users paste any job description
AI understands role requirements and expectations

🤖 AI-Driven Resume Evaluation

Uses Groq LLM (LLaMA 3.1) for fast inference
Generates:
Resume–Job match score
Missing skills and keywords
Improvement suggestions
Personalized AI-generated cover letter

📊 Match Score & Insights

Visual match percentage indicator
Color-coded skill gaps and recommendations
Optimized for ATS keyword alignment
🧾 History & Persistence
Stores past resume analyses per user
Fetch and view previous analysis sessions
Delete history entries from the dashboard

🔐 Authentication & Security

User authentication via Firebase Authentication
Secure server-side access using Firebase Admin SDK
Sensitive credentials managed via environment variables

🏗️ Tech Stack
Frontend
Next.js 15 (App Router)
TypeScript
React
Tailwind CSS
Context API for state management
Backend (Serverless)
Next.js API Routes
Groq SDK (LLaMA 3.1 model)
Firebase Admin SDK
Firestore for persistent storage

AI

Groq API
Model: llama-3.1-8b-instant
Structured JSON-only AI responses
Testing & CI
Jest for unit testing
AI service mocking for deterministic tests
GitHub Actions CI pipeline:
Install dependencies
Run tests
Build verification on PRs
Deployment
Vercel
Serverless Functions
Secure production environment variables

🧪 Testing Strategy

Unit tests for AI analysis service
JSON schema validation tests
Graceful handling of invalid AI responses
CI enforcement on all pull requests

🔐 Environment Variables
GROQ_API_KEY=****
FIREBASE_ADMIN_KEY=****
NEXT_PUBLIC_FIREBASE_API_KEY=****
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=****
NEXT_PUBLIC_FIREBASE_PROJECT_ID=****
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=****
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=****
NEXT_PUBLIC_FIREBASE_APP_ID=****


Firebase Admin key is stored as single-line JSON with escaped newlines for production safety.

📈 Why TailorAI?

Real-world ATS-style resume optimization
Fast AI inference using Groq
Secure, scalable, serverless architecture
Production-grade authentication and CI/CD
Built with modern full-stack best practices