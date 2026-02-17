# Parent Dashboard — Execution Plan

> Date: 2026-02-17

## Overview

Parents sign up separately (role=parent), link to their child's student account, and get a read-only dashboard showing their child's progress, scores, and study activity. They cannot take practice sessions or exams.

## Architecture

### Data Flow
1. Parent signs up → `profiles.role = 'parent'`
2. Parent links to student via **invite code** (student generates a 6-character code from their profile)
3. `parent_student_links` table stores the relationship
4. Parent dashboard queries student data via RLS policies (already defined in schema)
5. Parent can have multiple linked students; student can have multiple linked parents

### DB Changes Needed
- Add `invite_code` column to `profiles` table (for students to share with parents)
- Add RLS policies for `parent_student_links` (INSERT for parents, SELECT for both, DELETE for either party)
- Add RLS policies so parents can read linked students' `student_skill_stats`, `exams`, `weekly_plans`
- Migration: `supabase/migrations/002_parent_features.sql`

## Execution Steps

### Step 1: Database Migration
Create `supabase/migrations/002_parent_features.sql`:
- ALTER profiles ADD invite_code VARCHAR(8) UNIQUE
- Function to generate random 6-char alphanumeric invite code on student profile creation
- RLS on parent_student_links: parents can INSERT (link), both can SELECT, either can DELETE (unlink)
- RLS: parents can SELECT student_skill_stats, exams, weekly_plans for linked students
- RLS: parents can SELECT practice_sessions for linked students (already exists but verify)

### Step 2: API Routes (6 new endpoints)
```
src/app/api/parent/
├── children/
│   ├── route.ts              GET  — list linked students with summary stats
│   └── [studentId]/
│       ├── route.ts           GET  — detailed student profile + stats
│       ├── sessions/route.ts  GET  — student's practice session history
│       ├── skills/route.ts    GET  — student's skill breakdown
│       └── exams/route.ts     GET  — student's exam history + scores
├── link/route.ts              POST — link to student via invite code
└── unlink/route.ts            POST — unlink from student
```

Plus 1 student-side endpoint:
```
src/app/api/profile/invite-code/route.ts  POST — generate/regenerate invite code
```

### Step 3: Student Profile Update
- Add "Parent Access" section to student profile page
- Show current invite code (or button to generate one)
- Copy-to-clipboard button
- List linked parents with option to unlink

### Step 4: Dashboard Layout — Role-Based Navigation
Modify `src/app/dashboard/layout.tsx`:
- Fetch user role from profile
- If role=parent: show parent-specific nav items (My Children, no Practice/Mock Exams)
- If role=student: show current nav (Practice, Mock Exams, etc.)
- Store role in context for child components

### Step 5: Parent Dashboard Pages (5 pages)

**A. Parent Home — `/dashboard/parent` (or role-aware `/dashboard`)**
- List all linked children as cards
- Each card shows: name, grade, last active, overall accuracy, streak
- "Link a Child" button (enter invite code)
- Empty state: "Link your child's account to start tracking their progress"

**B. Child Detail — `/dashboard/parent/[studentId]`**
- Header: student name, grade, target school, last active
- Summary stats: total questions, accuracy, streak, sessions this week
- Quick charts: accuracy trend (last 4 weeks), section breakdown (math vs ELA)
- Recent activity feed (last 10 sessions with scores)
- Links to detailed views (skills, exams)

**C. Child Skills — `/dashboard/parent/[studentId]/skills`**
- Same data as student performance page but read-only
- Skill mastery bars grouped by section
- Strengths and weaknesses highlighted
- Trend indicators (improving/declining/stable)

**D. Child Exams — `/dashboard/parent/[studentId]/exams`**
- List of mock exams with composite scores
- Score trend chart
- Section breakdowns per exam
- Comparison to previous attempts

**E. Child Sessions — `/dashboard/parent/[studentId]/sessions`**
- Paginated session history
- Filter by section, date range
- Per-session: questions attempted, accuracy, time spent, date

### Step 6: Link Flow UI
- Parent enters 6-character invite code → POST /api/parent/link
- Validates code exists and belongs to a student
- Creates parent_student_links row
- Shows success with student name
- Error handling: invalid code, already linked, linking to non-student

### Step 7: Notifications Stub
- Add `parent_notifications` concept (future: email digest of weekly progress)
- For now, just a "notification preferences" toggle in parent profile
- Schema-ready but no email sending in MVP

## Component Structure
```
src/components/parent/
├── ChildCard.tsx          — summary card for linked student
├── ChildStats.tsx         — stat cards (accuracy, streak, etc.)
├── ChildActivityFeed.tsx  — recent sessions list
├── LinkChildModal.tsx     — invite code input modal
├── SkillsOverview.tsx     — mastery bars for parent view
└── ExamScoreCard.tsx      — individual exam result display
```

## Testing
- Unit tests for invite code generation
- Verify RLS policies: parent can only see linked students' data
- Verify student can only see their own data (parent link doesn't leak)
- Verify unlinking removes access immediately
