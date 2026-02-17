# Backend Scaffold Plan

> Generated: 2026-02-17

## 1. Pages → API Routes Mapping

| Page | Needs | API Routes / Actions |
|------|-------|---------------------|
| `/sign-in` | Auth | `POST /api/auth/sign-in`, `POST /api/auth/google`, `GET /api/auth/callback` |
| `/signup/student` | Registration | `POST /api/auth/sign-up` |
| `/signup/parent` | Registration | `POST /api/auth/sign-up` (role=parent) |
| `/signup/onboarding/*` | Save onboarding data | Server action: `saveOnboardingData()` — replaces localStorage |
| `/signup/paywall` | Stripe checkout | `POST /api/auth/checkout` (creates Stripe session) |
| `/signup/success` | Verify payment | `GET /api/auth/checkout?session_id=` |
| `/dashboard` | User profile + stats | `GET /api/profile`, `GET /api/analytics/summary` |
| `/dashboard/practice` | Question engine | `POST /api/practice/start`, `GET /api/practice/[sessionId]`, `POST /api/practice/[sessionId]/answer`, `POST /api/practice/[sessionId]/complete` |
| `/dashboard/performance` | Analytics | `GET /api/analytics/skills`, `GET /api/analytics/history`, `GET /api/analytics/trends` |
| `/dashboard/mock-exams` | Exam management | `GET /api/exams`, `POST /api/exams/start`, `GET /api/exams/[examId]`, `POST /api/exams/[examId]/complete` |
| `/dashboard/profile` | Profile CRUD | `GET /api/profile`, `PATCH /api/profile`, `POST /api/profile/password` |
| `/dashboard/resources` | Static (keep as-is for now) | — |
| `/dashboard/partners` | Static (keep as-is for now) | — |
| `/dashboard/exam-info` | Static (keep as-is) | — |
| `/resources`, `/resources/[slug]` | Future CMS | — (keep hardcoded for MVP) |

## 2. Auth Flow

**Provider:** Supabase Auth (replaces better-auth + drizzle + libsql)

### Email/Password
1. Student/parent fills signup form → `supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, role } } })`
2. Supabase creates `auth.users` row → trigger creates `profiles` row
3. Redirect to onboarding flow
4. On onboarding complete → `PATCH /api/profile` with onboarding data

### Google OAuth
1. Click "Sign in with Google" → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback' } })`
2. `/api/auth/callback` exchanges code for session, checks if profile exists
3. New users → redirect to onboarding; existing → redirect to dashboard

### Session Management
- Supabase handles JWTs via `@supabase/ssr` package
- Middleware at `src/middleware.ts` refreshes session on every request
- Protected routes: all `/dashboard/*` require auth
- Server components use `createServerClient()` to get user

### Route Protection
```
src/middleware.ts → checks auth for /dashboard/*, /api/* (except /api/auth/*)
```

## 3. API Route Structure

```
src/app/api/
├── auth/
│   ├── sign-up/route.ts          POST - register with email/password
│   ├── sign-in/route.ts          POST - login with email/password
│   ├── sign-out/route.ts         POST - clear session
│   ├── callback/route.ts         GET  - OAuth callback handler
│   └── checkout/route.ts         POST - create Stripe checkout session
│                                 GET  - verify checkout completion
├── questions/
│   ├── route.ts                  GET  - list/filter questions (admin)
│   └── [questionId]/route.ts     GET  - single question detail
├── practice/
│   ├── route.ts                  POST - start new practice session
│   └── [sessionId]/
│       ├── route.ts              GET  - get session state & current question
│       ├── answer/route.ts       POST - submit answer for current question
│       └── complete/route.ts     POST - end session, compute results
├── exams/
│   ├── route.ts                  GET  - list student's exams
│                                 POST - start new full-length exam
│   └── [examId]/
│       ├── route.ts              GET  - get exam state
│       └── complete/route.ts     POST - submit exam, compute scores
├── analytics/
│   ├── summary/route.ts          GET  - dashboard summary stats
│   ├── skills/route.ts           GET  - per-skill breakdown
│   ├── history/route.ts          GET  - session history list
│   └── trends/route.ts           GET  - score trends over time
└── profile/
    ├── route.ts                  GET  - get profile; PATCH - update profile
    ├── onboarding/route.ts       POST - save onboarding responses
    └── password/route.ts         POST - change password
```

## 4. Server Actions

For form submissions that don't need REST endpoints (used directly in Server Components):

```typescript
// lib/actions/onboarding.ts
'use server'
export async function saveOnboardingStep(step: string, data: Record<string, any>) { ... }
export async function completeOnboarding() { ... }

// lib/actions/practice.ts  
'use server'
export async function submitAnswer(sessionId: string, questionId: string, answer: string) { ... }
export async function skipQuestion(sessionId: string, questionId: string) { ... }

// lib/actions/profile.ts
'use server'
export async function updateProfile(data: ProfileUpdateData) { ... }
```

## 5. Adaptive Question Engine

### Algorithm Overview

The engine uses a **Bayesian mastery estimation** approach combined with **spaced repetition** principles:

```
Score(question) = w1 * weakness_priority + w2 * spaced_repetition + w3 * difficulty_match + w4 * variety
```

### Selection Algorithm

1. **Fetch student's `student_skill_stats`** for all categories
2. **Rank categories** by: lowest mastery_level first, then least recently practiced
3. **Within selected category**, pick questions where:
   - `difficulty` matches student's mastery band:
     - mastery < 0.4 → difficulty '1'
     - mastery 0.4–0.7 → difficulty '2'  
     - mastery > 0.7 → difficulty '3'
   - Question hasn't been seen recently (not in last 50 attempts)
   - Passage-based questions are grouped (all questions for a passage together)
4. **After each answer**, update `student_skill_stats`:
   - Bayesian update: `new_mastery = mastery + K * (is_correct - mastery)` where K=0.1
   - Update `recent_accuracy` (rolling window of last 20)
   - Update `trend` based on direction

### Practice Session Flow (End-to-End)

1. **Student selects practice mode** (topic-based, mixed, or timed)
2. **`POST /api/practice`** → creates `practice_sessions` row, engine selects first batch of questions (10-20)
3. **`GET /api/practice/[id]`** → returns current question + progress
4. **Student answers** → `POST /api/practice/[id]/answer`
   - Records `practice_attempts` row
   - Updates `student_skill_stats` via engine
   - Triggers `update_question_stats` DB trigger
   - Returns correct/incorrect + explanation
   - Engine selects next question adaptively
5. **Session ends** (student clicks done, or reaches question limit, or time expires)
   - `POST /api/practice/[id]/complete` → computes session accuracy, marks complete
6. **Results shown** with per-skill breakdown

### Full Exam Flow

1. **`POST /api/exams/start`** → creates exam session with fixed question set (57 ELA + 57 Math per real SHSAT)
2. Questions served in order (not adaptive — simulates real test)
3. Timer tracked client-side, synced on each answer
4. **`POST /api/exams/[id]/complete`** → compute raw/scaled/composite scores, create `exams` row

## 6. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # server-only, for admin operations

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # for OAuth redirects
```

## 7. Migration Plan: Modify vs Create

### New Files to Create
- `src/middleware.ts` — auth middleware
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client
- `src/lib/supabase/middleware.ts` — middleware helper
- `src/lib/questions/engine.ts` — adaptive question selection
- `src/lib/actions/onboarding.ts` — server actions
- `src/lib/actions/practice.ts` — server actions
- `src/lib/actions/profile.ts` — server actions
- All `src/app/api/**` route files
- `.env.local` — environment variables

### Existing Files to Modify
| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Remove Orchids scripts, add Supabase session provider |
| `src/app/sign-in/page.tsx` | Wire up Supabase auth (signInWithPassword, signInWithOAuth) |
| `src/app/signup/student/page.tsx` | Wire form to `supabase.auth.signUp()` |
| `src/app/signup/parent/page.tsx` | Wire form to `supabase.auth.signUp()` |
| `src/app/signup/onboarding/*.tsx` | Replace localStorage with server actions |
| `src/app/signup/paywall/page.tsx` | Wire to Stripe checkout API |
| `src/app/signup/success/page.tsx` | Read from Stripe session verification |
| `src/app/dashboard/page.tsx` | Fetch real data from Supabase, extract sidebar to layout |
| `src/app/dashboard/practice/page.tsx` | Wire to practice API, build question UI |
| `src/app/dashboard/performance/page.tsx` | Fetch real analytics data |
| `src/app/dashboard/mock-exams/page.tsx` | Wire to exams API |
| `src/app/dashboard/profile/page.tsx` | Wire to profile API |
| `package.json` | Add `@supabase/supabase-js`, `@supabase/ssr`; remove unused deps |

### Files to Delete
- `src/visual-edits/` — Orchids integration (unless actively used)
- `.orchids/` — Orchids config

## 8. Unused Dependencies to Remove

These are installed but not used anywhere in the codebase:

| Package | Reason |
|---------|--------|
| `stripe` | Installed but not integrated — will re-add when implementing payments |
| `@tabler/icons-react` | Redundant with lucide-react |
| `react-icons` | Redundant with lucide-react |
| `tailwindcss-animate` | Using `tw-animate-css` instead (Tailwind v4) |

**Previously removed (per CODEBASE_ANALYSIS):** The analysis mentions @react-three/fiber, three, cobe, @tsparticles, dotted-map, simplex-noise, swiper, react-fast-marquee, react-responsive-masonry, react-syntax-highlighter, react-wrap-balancer, react-dropzone, better-auth, drizzle-orm, drizzle-kit, @libsql/client, bcrypt — but these are **not in the current package.json**, so they've already been removed.

**Packages to remove now:**
- `stripe` (re-add when ready for payment integration)
- `@tabler/icons-react` (consolidate to lucide-react)
- `react-icons` (consolidate to lucide-react)
- `tailwindcss-animate` (superseded by tw-animate-css for Tailwind v4)

**Packages to add:**
- `@supabase/supabase-js`
- `@supabase/ssr`
