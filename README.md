# SHSPrep — SHSAT Prep Platform

An adaptive SHSAT preparation platform for NYC middle school students targeting admission to Specialized High Schools. Built with Next.js 15, Supabase, and an intelligent practice engine that adapts to each student's skill level.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.3.6 | React framework (App Router, Turbopack) |
| React | 19.0.0 | UI library |
| TypeScript | 5.x | Type safety |
| Supabase | — | Auth, PostgreSQL database, real-time |
| Radix UI | — | Accessible component primitives |
| Tailwind CSS | 4.x | Utility-first styling |
| Zod | — | Runtime schema validation |
| React Hook Form | — | Form state management |
| Recharts | — | Analytics charts |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/your-org/shsprep.git
cd shsprep
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only)

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API route handlers
│   │   ├── analytics/      # Performance analytics endpoints
│   │   ├── auth/           # Authentication (sign-up, sign-in, sign-out, callback, checkout)
│   │   ├── exams/          # Full mock exam management
│   │   ├── practice/       # Practice session lifecycle
│   │   ├── profile/        # User profile & onboarding
│   │   └── questions/      # Question bank access
│   ├── dashboard/          # Authenticated student dashboard
│   │   ├── exam-info/      # SHSAT exam information
│   │   ├── mock-exams/     # Mock exam interface
│   │   ├── partners/       # Partner schools
│   │   ├── performance/    # Performance analytics
│   │   ├── practice/       # Practice mode
│   │   ├── profile/        # Profile settings
│   │   └── resources/      # Study resources
│   ├── signup/             # Registration flow
│   │   ├── student/        # Student registration
│   │   ├── parent/         # Parent registration
│   │   ├── onboarding/     # Multi-step onboarding wizard
│   │   └── paywall/        # Subscription gate (future)
│   └── resources/          # Public resources pages
├── lib/
│   ├── actions/            # Server actions
│   ├── auth/               # Auth utilities
│   ├── hooks/              # Custom React hooks
│   ├── questions/          # Adaptive engine & question logic
│   ├── supabase/           # Supabase client configuration
│   ├── types/              # Shared TypeScript types
│   └── utils.ts            # General utilities
supabase/
└── migrations/             # Database migrations
    └── 001_initial_schema.sql
```

## Database Setup

1. Create a new [Supabase project](https://app.supabase.com)
2. Run the migration:
   ```bash
   # Using Supabase CLI
   supabase db push
   # Or manually execute supabase/migrations/001_initial_schema.sql in the SQL editor
   ```
3. Seed the question bank (502 questions) — import via the Supabase dashboard or a seed script

## Question Bank

The platform includes **502 SHSAT-style questions** across two sections:

- **ELA** — Revising/Editing and Reading Comprehension
- **Math** — Multiple choice and grid-in problems

Questions are tagged with:
- `section` — `ela` or `math`
- `category` — Skill category (e.g., `ela.revising.grammar`, `math.algebra`)
- `subcategory` — Fine-grained topic
- `difficulty` — 1 (easy), 2 (medium), 3 (hard)
- `type` — `multiple_choice` or `grid_in`
- `skills` / `tags` — Additional metadata

Each question includes a stem, answer options, correct answer, explanation, and common mistakes.

## API Reference

See [docs/API.md](docs/API.md) for the full API reference. Summary:

| Domain | Endpoints |
|---|---|
| **Auth** | Sign up, sign in, sign out, OAuth callback, checkout (stub) |
| **Profile** | Get/update profile, onboarding, change password |
| **Practice** | Start session, get session, submit answer, complete session |
| **Exams** | List exams, create mock exam, get exam, complete exam |
| **Questions** | List questions (filtered), get single question |
| **Analytics** | Summary, skill breakdown, trends, session history |

## Architecture Decisions

### Why Supabase?
- Built-in auth with email/password and OAuth
- PostgreSQL with Row Level Security for data isolation
- Real-time subscriptions for future collaborative features
- Generous free tier for MVP

### Adaptive Practice Engine
The practice engine tracks per-skill mastery levels and adjusts question selection. It uses:
- **Mastery tracking** — Updated after each answer based on correctness and question difficulty
- **Trend detection** — Identifies improving, declining, or stable skill areas
- **Skill stats** — Per-category accuracy, attempt counts, and recency

### Mock Exams
Full-length mock exams mirror the real SHSAT: 57 ELA + 57 Math questions with a 3-hour time limit. Scores are scaled to approximate the 200–800 range per section.

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Connect your GitHub repository
2. Add environment variables in Vercel project settings (or use `vercel.json` with linked secrets):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy — Vercel auto-detects Next.js

Region is configured to `iad1` (US East) in `vercel.json`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and ensure lint passes: `npm run lint`
4. Build successfully: `npm run build`
5. Commit with clear messages
6. Open a Pull Request against `main`

CI runs automatically on PRs (lint, build, test).

## License

MIT
