# UTRA STORE - Security Audit & Secret Management Guide

## ⚠️ CRITICAL SECURITY WARNING & SECRET ROTATION
> **ROTATE ALL PREVIOUSLY HARDCODED SECRETS IMMEDIATELY!**
> Any API key, admin credentials, secret token, or PIN that existed as a string literal in source code or git history must be considered compromised. 
> Please rotate all Firebase API keys and Admin PINs in their respective developer portals before deploying to production.

---

## 🔒 Secret Safety Pass Checklist Overview

### 1. Environment Variable Architecture
All sensitive keys and configurations have been moved out of code literals and migrated to environment variables:
- **Server-Side Secrets** (`GEMINI_API_KEY`): Managed exclusively in server-side AI contexts. Never exposed in browser bundles.
- **Client-Side Safe Public Variables** (`VITE_ADMIN_EMAILS`, `VITE_ADMIN_PINS`, `VITE_FIREBASE_*`): Properly prefixed with `VITE_` and configured with safe fallbacks in `src/lib/firebase.ts` and `src/context/AuthContext.tsx`.

### 2. Frontend Exposure Safety
- Verified that no secret keys (such as `GEMINI_API_KEY` or Firebase Admin credentials) are prefixed with `NEXT_PUBLIC_`, `REACT_APP_`, or `VITE_` for server operations.
- Firebase Web API Key is used strictly for public client initialization alongside Firestore security rules (`firestore.rules`).

### 3. Git Security & Ignore Rules
- `.gitignore` explicitly prevents `.env` and `.env.local` files from being committed (`.env*` excluded, `!.env.example` tracked).
- `.env.example` is committed with placeholder values for quick onboarding.

### 4. Logging & Error Safety
- Audited all `console.warn` and error handlers across authentication, payment modals, and store context.
- Confirmed no tokens, passwords, or raw connection strings are printed to console or returned in user-facing error dialogs.
