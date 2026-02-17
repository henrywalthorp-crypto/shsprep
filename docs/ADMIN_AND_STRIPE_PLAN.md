# Admin Question Management & Stripe Integration — Execution Plan

> Date: 2026-02-17

---

## Part A: Admin Question Management System

### Overview
Admins (role='admin') get a dashboard to review, edit, approve, and upload questions. This is critical for quality control of the 502 AI-generated questions.

### Admin Features
1. **Question Browser** — filterable table of all questions with status, section, category, difficulty
2. **Question Review** — view question with answer, explanation, mark as approved/needs-edit/rejected
3. **Question Editor** — inline edit stem, options, answer, explanation, difficulty, category
4. **Bulk Upload** — drag-and-drop JSON file to import new question batches
5. **Passage Manager** — view/edit passages, see linked questions
6. **Stats Dashboard** — question counts by status, section, difficulty distribution

### DB Changes
Migration `003_admin_features.sql`:
- No new tables needed — questions already have `review_status` enum (draft/reviewed/approved/published)
- Add admin RLS policies: admins can CRUD all questions and passages (already exists but verify)
- Add admin nav flag or just check role='admin' in layout

### API Routes (7 new)
```
src/app/api/admin/
├── questions/
│   ├── route.ts                GET  — list all questions (any status), POST — create new
│   ├── [questionId]/
│   │   ├── route.ts            GET/PATCH/DELETE — single question CRUD
│   │   └── status/route.ts     PATCH — change review_status
│   └── bulk/route.ts           POST — bulk import from JSON
├── passages/
│   ├── route.ts                GET — list passages, POST — create
│   └── [passageId]/route.ts    GET/PATCH/DELETE — single passage CRUD
└── stats/route.ts              GET — question bank statistics
```

### Admin Pages (4 pages)
```
src/app/dashboard/admin/
├── page.tsx                    — Admin home: stats overview + quick actions
├── questions/
│   ├── page.tsx                — Question browser table with filters + bulk actions
│   └── [questionId]/page.tsx   — Question detail/editor
├── passages/page.tsx           — Passage manager
└── upload/page.tsx             — Bulk upload interface
```

### Components
```
src/components/admin/
├── QuestionTable.tsx           — sortable/filterable table
├── QuestionEditor.tsx          — inline edit form
├── QuestionPreview.tsx         — render question as student would see it
├── StatusBadge.tsx             — colored badge for review status
├── BulkUploadZone.tsx          — drag-and-drop JSON upload
├── PassageEditor.tsx           — passage text editor
├── AdminStatsCards.tsx         — question bank statistics
└── QuestionFilters.tsx         — filter bar (section, category, difficulty, status)
```

---

## Part B: Stripe Integration

### Overview
Freemium model: free tier gets limited practice (20 questions/day), paid tier gets unlimited + mock exams + detailed analytics.

### Pricing Structure (MVP)
- **Free Tier**: 20 questions/day, basic performance stats, no mock exams
- **Monthly Plan**: $14.99/mo — unlimited everything
- **Annual Plan**: $99.99/yr — unlimited everything (save 44%)
- **Family Plan**: $19.99/mo — up to 3 students (future)

### DB Changes
Migration `004_stripe_features.sql`:
- ALTER profiles ADD subscription_status VARCHAR(20) DEFAULT 'free' (free/active/canceled/past_due)
- ALTER profiles ADD stripe_customer_id TEXT
- ALTER profiles ADD subscription_plan VARCHAR(20) (monthly/annual)
- ALTER profiles ADD subscription_ends_at TIMESTAMPTZ
- ALTER profiles ADD daily_question_count INT DEFAULT 0
- ALTER profiles ADD daily_question_reset_at DATE
- CREATE TABLE payment_history (id, profile_id, stripe_payment_intent_id, amount, currency, status, created_at)

### API Routes (5 new)
```
src/app/api/stripe/
├── checkout/route.ts           POST — create Stripe checkout session
├── portal/route.ts             POST — create billing portal session
├── webhook/route.ts            POST — handle Stripe webhooks
├── status/route.ts             GET  — current subscription status
└── prices/route.ts             GET  — available plans and prices
```

### Stripe Setup
- Create Stripe products and prices (monthly + annual)
- Configure webhook endpoint
- Handle events: checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.deleted

### UI Changes
1. **Paywall page** (already exists at /signup/paywall) — wire to Stripe checkout
2. **Pricing section** on landing page — show plans with "Start Free" / "Go Premium" CTAs
3. **Upgrade prompts** — when free user hits daily limit, show upgrade modal
4. **Profile page** — subscription status, manage billing button (Stripe portal)
5. **Dashboard** — subtle "Free Plan" badge or "Premium" badge in sidebar

### Usage Limiting
- Middleware or practice API checks daily_question_count
- Reset daily at midnight via count + reset_at date comparison
- Free users: blocked from /dashboard/mock-exams and /api/exams
- Free users: limited analytics (summary only, no trends/detailed skills)

### Components
```
src/components/billing/
├── PricingCards.tsx             — plan comparison cards
├── UpgradeModal.tsx            — shown when hitting free limit
├── SubscriptionBadge.tsx       — free/premium indicator
└── BillingSection.tsx          — profile page billing management
```

---

## Execution Order

### Batch 1 (parallel):
- Agent A: Admin DB migration + API routes (7 endpoints)
- Agent B: Admin pages + components (4 pages, 8 components)

### Batch 2 (parallel):
- Agent C: Stripe DB migration + API routes (5 endpoints) + webhook handler
- Agent D: Stripe UI (paywall, pricing, upgrade modal, billing section, usage limiting)

### Batch 3:
- Integration testing, build verification, commit
