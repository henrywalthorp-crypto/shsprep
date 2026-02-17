# API Reference

All endpoints are Next.js App Router API routes under `/api/`. Unless noted otherwise, all endpoints require authentication via Supabase session cookies.

---

## Auth

### POST `/api/auth/sign-up`

Create a new account.

**Auth required:** No

**Request body:**
```json
{
  "email": "string",
  "password": "string (min 6 chars)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "role": "'student' | 'parent'"
}
```

**Response (200):**
```json
{
  "message": "Account created successfully",
  "user": { /* Supabase User object */ }
}
```

**Errors:** `400` invalid input or Supabase error

---

### POST `/api/auth/sign-in`

Sign in with email and password.

**Auth required:** No

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Signed in successfully",
  "user": { /* Supabase User */ },
  "session": { /* Supabase Session */ }
}
```

**Errors:** `400` missing fields, `401` invalid credentials

---

### POST `/api/auth/sign-out`

Sign out the current user.

**Auth required:** Yes

**Response (200):**
```json
{ "message": "Signed out successfully" }
```

---

### GET `/api/auth/callback?code=...&next=...`

OAuth callback handler. Exchanges auth code for session and redirects.

**Auth required:** No

**Query params:**
- `code` — Auth code from OAuth provider
- `next` — Redirect path (default: `/dashboard`)

**Response:** `302` redirect

---

### POST `/api/auth/checkout`

Stripe checkout stub (not yet implemented).

**Response (200):**
```json
{ "message": "Stripe not configured yet" }
```

### GET `/api/auth/checkout`

Same stub as POST.

---

## Profile

### GET `/api/profile`

Get the authenticated user's profile.

**Auth required:** Yes

**Response (200):**
```json
{
  "profile": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "grade": "string",
    "target_school": "string",
    "avatar_url": "string",
    "onboarding_complete": "boolean",
    ...
  }
}
```

---

### PATCH `/api/profile`

Update profile fields.

**Auth required:** Yes

**Request body (all optional):**
```json
{
  "first_name": "string (1-100)",
  "last_name": "string (1-100)",
  "grade": "'6' | '7' | '8' | '9'",
  "target_school": "string (max 200)",
  "avatar_url": "string (URL)"
}
```

**Response (200):**
```json
{ "profile": { /* updated profile */ } }
```

---

### POST `/api/profile/onboarding`

Complete the onboarding flow.

**Auth required:** Yes

**Request body:**
```json
{
  "grade": "'6' | '7' | '8' | '9'",
  "targetSchool": "string (optional, max 200)",
  "studyGoal": "string (optional, max 500)",
  "first_name": "string (optional)",
  "last_name": "string (optional)"
}
```

**Response (201):**
```json
{ "profile": { /* updated profile with onboarding_complete: true */ } }
```

---

### POST `/api/profile/password`

Change password.

**Auth required:** Yes

**Request body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (8-128 chars)"
}
```

**Response (200):**
```json
{ "message": "Password updated successfully" }
```

---

## Practice

### POST `/api/practice`

Start a new practice session.

**Auth required:** Yes

**Request body:**
```json
{
  "section": "'ela' | 'math' (optional)",
  "category": "string (optional, prefix match)",
  "difficulty": "'1' | '2' | '3' (optional)",
  "mode": "'practice' | 'timed_practice'",
  "questionCount": "number (10-50)"
}
```

**Response (201):**
```json
{
  "sessionId": "uuid",
  "firstQuestion": {
    "id": "uuid",
    "section": "string",
    "category": "string",
    "subcategory": "string",
    "difficulty": "string",
    "type": "string",
    "stem": "string",
    "stimulus": "string | null",
    "options": "object",
    "passage_id": "uuid | null"
  },
  "totalQuestions": "number"
}
```

---

### GET `/api/practice/[sessionId]`

Get current state of a practice session.

**Auth required:** Yes

**Response (200):**
```json
{
  "session": {
    "id": "uuid",
    "mode": "string",
    "status": "string",
    "timeLimit": "number | null",
    "startedAt": "string (ISO date)"
  },
  "currentQuestion": { /* question object or null */ },
  "progress": {
    "answered": "number",
    "total": "number",
    "correct": "number"
  },
  "timeSpent": "number (seconds)"
}
```

---

### POST `/api/practice/[sessionId]/answer`

Submit an answer for the current question.

**Auth required:** Yes

**Request body:**
```json
{
  "questionId": "uuid",
  "answer": "string",
  "timeSpent": "number (seconds, integer >= 0)"
}
```

**Response (200):**
```json
{
  "isCorrect": "boolean",
  "correctAnswer": "string",
  "explanation": "string | null",
  "commonMistakes": "string | null",
  "nextQuestion": { /* question object or null */ }
}
```

**Side effects:** Updates student skill stats (mastery, accuracy, trend).

---

### POST `/api/practice/[sessionId]/complete`

Complete a practice session and get results.

**Auth required:** Yes

**Response (200):**
```json
{
  "accuracy": "number (0-1)",
  "totalCorrect": "number",
  "totalQuestions": "number",
  "skillBreakdown": [
    {
      "category": "string",
      "correct": "number",
      "total": "number",
      "accuracy": "number"
    }
  ],
  "timeSpent": "number (seconds)"
}
```

---

## Exams

### GET `/api/exams`

List all completed mock exams for the current user.

**Auth required:** Yes

**Response (200):**
```json
{
  "exams": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "session_id": "uuid",
      "ela_raw_score": "number",
      "math_raw_score": "number",
      "ela_scaled_score": "number",
      "math_scaled_score": "number",
      "composite_score": "number",
      ...
    }
  ]
}
```

---

### POST `/api/exams`

Create a new full-length mock exam (57 ELA + 57 Math, 3-hour limit).

**Auth required:** Yes

**Response (201):**
```json
{
  "examId": "uuid",
  "totalQuestions": "number",
  "timeLimit": 10800
}
```

---

### GET `/api/exams/[examId]`

Get current state of an in-progress or completed exam.

**Auth required:** Yes

**Response (200):**
```json
{
  "session": {
    "id": "uuid",
    "mode": "exam",
    "status": "string",
    "startedAt": "string",
    "timeLimit": "number"
  },
  "currentQuestion": { /* question object or null */ },
  "progress": {
    "answered": "number",
    "total": "number",
    "correct": "number"
  },
  "timeRemaining": "number (seconds)"
}
```

---

### POST `/api/exams/[examId]/complete`

Complete a mock exam. Calculates scaled scores.

**Auth required:** Yes

**Response (200):**
```json
{
  "examId": "uuid",
  "elaRawScore": "number",
  "mathRawScore": "number",
  "elaScaledScore": "number (200-800)",
  "mathScaledScore": "number (200-800)",
  "compositeScore": "number (400-1600)",
  "breakdown": {
    "elaRevising": { "correct": "number", "total": "number" },
    "elaReading": { "correct": "number", "total": "number" },
    "mathMultipleChoice": { "correct": "number", "total": "number" },
    "mathGridIn": { "correct": "number", "total": "number" }
  },
  "timeSpent": "number (seconds)"
}
```

---

## Questions

### GET `/api/questions`

List questions with optional filters and pagination.

**Auth required:** Yes

**Query params:**
- `section` — `ela` or `math`
- `category` — Category prefix (e.g., `math.algebra`)
- `difficulty` — `1`, `2`, or `3`
- `limit` — Results per page (default 20, max 100)
- `offset` — Pagination offset (default 0)

**Response (200):**
```json
{
  "questions": [
    {
      "id": "uuid",
      "section": "string",
      "category": "string",
      "subcategory": "string",
      "difficulty": "string",
      "type": "string",
      "stem": "string",
      "stimulus": "string | null",
      "options": "object",
      "passage_id": "uuid | null",
      "skills": "array",
      "tags": "array",
      "times_attempted": "number",
      "times_correct": "number"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

### GET `/api/questions/[questionId]`

Get a single question with its associated passage.

**Auth required:** Yes

**Response (200):**
```json
{
  "question": {
    /* full question object */
    "passages": { /* associated passage if any */ }
  }
}
```

---

## Analytics

### GET `/api/analytics/summary`

Get an overview of the student's performance.

**Auth required:** Yes

**Response (200):**
```json
{
  "totalPracticed": "number",
  "overallAccuracy": "number (0-1)",
  "currentStreak": "number (days)",
  "weakestSkills": [
    { "category": "string", "mastery": "number", "accuracy": "number" }
  ],
  "strongestSkills": [
    { "category": "string", "mastery": "number", "accuracy": "number" }
  ],
  "recentSessions": [ /* last 5 completed sessions */ ]
}
```

---

### GET `/api/analytics/skills`

Get per-category skill breakdown.

**Auth required:** Yes

**Response (200):**
```json
{
  "skills": [
    {
      "category": "string",
      "mastery": "number",
      "accuracy": "number",
      "totalAttempted": "number",
      "trend": "'improving' | 'declining' | 'stable'"
    }
  ]
}
```

---

### GET `/api/analytics/trends`

Get weekly and monthly accuracy trends.

**Auth required:** Yes

**Response (200):**
```json
{
  "weekly": [
    { "week": "YYYY-MM-DD", "avgAccuracy": "number", "questionsCompleted": "number" }
  ],
  "monthly": [
    { "month": "YYYY-MM", "avgAccuracy": "number", "questionsCompleted": "number" }
  ]
}
```

---

### GET `/api/analytics/history`

Get paginated session history.

**Auth required:** Yes

**Query params:**
- `limit` — Results per page (default 20, max 100)
- `offset` — Pagination offset (default 0)

**Response (200):**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "mode": "string",
      "section": "string | null",
      "accuracy": "number",
      "questionsCount": "number",
      "timeSpent": "number",
      "completedAt": "string (ISO date)"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```
