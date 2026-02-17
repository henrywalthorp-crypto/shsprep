# Build Plan — Backend Integration Sprint

> Created: 2026-02-17 08:20 EST
> Goal: Build everything that can work without live DB, flip the switch when Supabase connects

## Phase 1: Foundation (do first)
1. **Clean up deps** — remove stripe, @tabler/icons-react, react-icons, tailwindcss-animate
2. **Supabase client utils** — verify/fix client.ts, server.ts, middleware.ts (already scaffolded)
3. **Root middleware.ts** — auth route protection for /dashboard/*, session refresh
4. **Auth provider** — client-side context for user state across components

## Phase 2: Auth Pages (wire existing UI)
4. **Sign-in page** — wire to supabase.auth.signInWithPassword + Google OAuth
5. **Student signup** — wire to supabase.auth.signUp with role=student
6. **Parent signup** — wire to supabase.auth.signUp with role=parent
7. **OAuth callback** — /api/auth/callback route (code exchange)
8. **Sign-out** — /api/auth/sign-out route
9. **Onboarding flow** — server actions to save onboarding data to profiles table

## Phase 3: Core API Routes (full implementation)
10. **Profile API** — GET/PATCH /api/profile, POST /api/profile/onboarding
11. **Questions API** — GET /api/questions (with filters), GET /api/questions/[id]
12. **Practice API** — POST start, GET state, POST answer, POST complete
13. **Exams API** — GET list, POST start, GET state, POST complete
14. **Analytics API** — GET summary, skills, history, trends

## Phase 4: Adaptive Engine (full implementation)
15. **Expand engine.ts** — full Bayesian mastery, spaced repetition, question selection
16. **Server actions** — submitAnswer, skipQuestion with engine integration

## Phase 5: Dashboard Pages (wire to real data)
17. **Dashboard layout** — shared sidebar + auth guard + user context
18. **Dashboard home** — fetch summary stats, recent activity
19. **Practice page** — question-taking UI (render question, options, timer, explanations)
20. **Performance page** — skill breakdown charts, trends
21. **Mock exams page** — exam list, start exam flow
22. **Profile page** — edit profile form

## Phase 6: Seed Script & Finalization
23. **Question seed script** — imports all_questions.json into Supabase via service role
24. **Git commit & push**

## Execution Order
Phases 1-4 as subagents in parallel where possible.
Phase 5 sequentially (depends on API routes).
Phase 6 last.
