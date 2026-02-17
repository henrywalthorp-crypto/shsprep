# Security Audit — 2026-02-17

## Input Validation

### Routes using Zod validation ✅
- `POST /api/profile` — `updateProfileSchema` validates all fields
- `POST /api/profile/password` — `passwordSchema` validates current/new password
- `POST /api/profile/onboarding` — `onboardingSchema` validates grade, names, etc.
- `POST /api/practice` — `startPracticeSchema` validates section, difficulty, mode, questionCount
- `POST /api/practice/[sessionId]/answer` — `answerSchema` validates questionId (uuid), answer, timeSpent

### Routes with manual validation ⚠️
- `POST /api/auth/sign-up` — Manual checks for email, password length, role. Sufficient but could benefit from Zod for consistency.
- `POST /api/auth/sign-in` — Manual check for email/password presence. Minimal risk since values pass directly to Supabase auth.

### Routes with no user input (read-only, auth-gated) ✅
- `GET /api/analytics/summary` — No user input beyond auth
- `GET /api/analytics/trends` — No user input beyond auth
- `GET /api/analytics/skills` — No user input beyond auth
- `GET /api/exams` — No user input beyond auth
- `POST /api/auth/sign-out` — No user input
- `GET /api/auth/callback` — Uses `code` from URL param, passed to Supabase `exchangeCodeForSession`

### Routes with query param input ⚠️
- `GET /api/questions` — `limit` and `offset` are parsed with `parseInt` and `limit` is capped at 100. `section`, `category`, `difficulty` are passed to Supabase query builder (parameterized). Safe.
- `GET /api/analytics/history` — Same pattern as questions. Safe.

## SQL Injection
- **No raw SQL anywhere.** All database access goes through the Supabase JS client which uses parameterized queries. ✅
- `.like('category', ...)` calls use template literals but values flow through Supabase's parameterized query builder. Safe.

## XSS
- React auto-escapes all rendered content by default. No `dangerouslySetInnerHTML` found in any component. ✅
- User-generated content (names, categories) is rendered as text nodes only. ✅
- `currentQuestion.stimulus` and `currentQuestion.stem` are rendered as text inside `<div>` and `<p>` tags — auto-escaped by React.

## Authentication & Authorization
- All API routes (except auth routes) verify the user via `supabase.auth.getUser()` and return 401 if unauthorized. ✅
- Session/exam routes verify `student_id` matches the authenticated user (ownership check). ✅
- Middleware protects `/dashboard/*`, `/api/*`, and `/signup/onboarding/*` routes.

## Rate Limiting
- `POST /api/auth/sign-up` — 5 requests/minute per IP ✅
- `POST /api/auth/sign-in` — 10 requests/minute per IP ✅
- In-memory rate limiter with automatic cleanup.

## Security Headers (next.config.ts)
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Recommendations
1. Consider adding Zod validation to sign-up/sign-in routes for consistency
2. Add CSRF protection if cookie-based auth is used (Supabase uses cookies via middleware)
3. Consider adding `Content-Security-Policy` header once the app stabilizes
4. Add rate limiting to other sensitive endpoints (password change, practice session creation) if abuse is observed
5. The open redirect in `/api/auth/callback` (`next` param) should be validated to only allow relative paths — currently it accepts any path via `${origin}${next}`
