# SHSprep Codebase Analysis

> Generated: 2026-02-17

## 1. Directory Structure

```
shsprep/
├── public/                          # Static assets (default Next.js SVGs only)
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (html/body, Orchids scripts, error reporter)
│   │   ├── page.tsx                 # Landing page (marketing homepage)
│   │   ├── globals.css              # Tailwind config + custom theme colors
│   │   ├── global-error.tsx         # Error boundary (delegates to ErrorReporter)
│   │   ├── favicon.ico
│   │   ├── sign-in/
│   │   │   └── page.tsx             # Sign-in page
│   │   ├── signup/
│   │   │   ├── page.tsx             # Role selection (parent vs student)
│   │   │   ├── student/page.tsx     # Student registration form
│   │   │   ├── parent/page.tsx      # Parent registration form
│   │   │   ├── paywall/page.tsx     # Pricing / plan selection
│   │   │   ├── success/page.tsx     # Post-payment confirmation
│   │   │   └── onboarding/
│   │   │       ├── layout.tsx       # Shared onboarding wrapper (dark bg)
│   │   │       ├── page.tsx         # Parent/guardian info collection
│   │   │       ├── ready/           # "Let's get started" motivational
│   │   │       ├── feeling/         # How are you feeling about the SHSAT?
│   │   │       ├── confidence/      # What subjects are you confident in?
│   │   │       ├── score/           # Enter current/practice score
│   │   │       ├── no-score/        # No score yet path
│   │   │       ├── goal-score/      # Set target score
│   │   │       ├── worries/         # What worries you most?
│   │   │       ├── help/            # Reassurance screen
│   │   │       ├── partnership/     # What SHSprep will do for you
│   │   │       ├── personalizing/   # "Building your plan" loading
│   │   │       ├── summary/         # Personalized plan summary
│   │   │       └── final-ready/     # Final CTA before paywall
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Main dashboard (score cards, sidebar)
│   │   │   ├── practice/page.tsx    # Topic-based practice drill-down
│   │   │   ├── performance/page.tsx # Analytics & progress tracking
│   │   │   ├── mock-exams/page.tsx  # Mock exam list & status
│   │   │   ├── resources/page.tsx   # School info & study resources
│   │   │   ├── profile/page.tsx     # User settings & billing
│   │   │   ├── partners/page.tsx    # Tutoring centers directory
│   │   │   └── exam-info/page.tsx   # SHSAT exam info & FAQ
│   │   └── resources/
│   │       ├── page.tsx             # Public blog/resources listing
│   │       └── [slug]/page.tsx      # Individual article page
│   ├── components/
│   │   ├── ui/                      # ~50 shadcn/ui components (Radix-based)
│   │   ├── sections/                # Landing page sections
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── trusted-by.tsx
│   │   │   ├── digital-transition.tsx
│   │   │   ├── any-open-models.tsx
│   │   │   ├── tailored-optimization.tsx
│   │   │   ├── path-to-production.tsx
│   │   │   ├── enterprise.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── blog-preview.tsx
│   │   │   ├── cta-bottom.tsx
│   │   │   └── footer.tsx
│   │   └── ErrorReporter.tsx
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   │   └── hooks/use-mobile.tsx
│   └── visual-edits/               # Orchids visual editor integration
│       ├── VisualEditsMessenger.tsx
│       └── component-tagger-loader.js
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json                  # shadcn/ui config
├── bun.lock / package-lock.json
└── .orchids/orchids.json           # Orchids platform config
```

## 2. Pages & Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Marketing landing page with 12 sections | **Built** - fully designed |
| `/sign-in` | Sign-in with Google/Apple/Email | **UI only** - no auth wired |
| `/signup` | Parent vs Student role selector | **Built** - UI complete |
| `/signup/student` | Student registration form | **UI only** - form doesn't submit |
| `/signup/parent` | Parent registration form (nearly identical to student) | **UI only** - form doesn't submit |
| `/signup/onboarding` | Parent/guardian info collection | **UI only** |
| `/signup/onboarding/ready` | Motivational "let's go" screen | **Built** |
| `/signup/onboarding/feeling` | Feeling selection (Confident/Nervous/etc) | **Built** - saves to localStorage |
| `/signup/onboarding/confidence` | Subject confidence selection | **Built** |
| `/signup/onboarding/score` | Enter current score | **Built** - saves to localStorage |
| `/signup/onboarding/no-score` | No score yet path | **Built** |
| `/signup/onboarding/goal-score` | Set target score | **Built** - reads from query params |
| `/signup/onboarding/worries` | Biggest concerns selection | **Built** |
| `/signup/onboarding/help` | Reassurance messaging | **Built** |
| `/signup/onboarding/partnership` | Value proposition | **Built** |
| `/signup/onboarding/personalizing` | Fake "building your plan" loading | **Built** |
| `/signup/onboarding/summary` | Shows personalized plan from localStorage | **Built** |
| `/signup/onboarding/final-ready` | Final CTA before paywall | **Built** |
| `/signup/paywall` | Plan selection (annual $599/monthly $99) | **UI only** - no Stripe integration |
| `/signup/success` | Post-payment confirmation with plan details | **UI only** - reads plan from query param |
| `/dashboard` | Main dashboard with score cards, sidebar nav | **Built** - hardcoded data + localStorage name |
| `/dashboard/practice` | Topic drill-down tree (sections → categories → subcategories) | **UI only** - hardcoded practice data |
| `/dashboard/performance` | Analytics with charts, strengths/weaknesses | **UI only** - all hardcoded data |
| `/dashboard/mock-exams` | Mock exam list with status badges | **UI only** - hardcoded exam list |
| `/dashboard/resources` | School info cards + study materials | **UI only** - hardcoded school data |
| `/dashboard/profile` | Settings (profile/billing/notifications/security tabs) | **UI only** - no backend |
| `/dashboard/partners` | Tutoring center directory with ratings | **UI only** - hardcoded partner data |
| `/dashboard/exam-info` | SHSAT FAQ and exam details | **Built** - static content, good info |
| `/resources` | Public blog listing page | **UI only** - hardcoded blog posts |
| `/resources/[slug]` | Individual article with HTML content | **UI only** - hardcoded articles |

## 3. Components Inventory

### Landing Page Sections (all built, production-quality UI)
- **Navbar** - Sticky header with scroll effect, mobile hamburger, announcement banner
- **Hero** - Main CTA with animations (framer-motion)
- **TrustedBy** - Marquee of specialized school names
- **DigitalTransition** - Feature grid (Mirror Real Test, Real-Time Feedback, etc.)
- **AnyOpenModels** - Subject tags + feature cards
- **TailoredOptimization** - Score chart (Recharts) + topic performance bars
- **PathToProduction** - 3-step journey illustration
- **Enterprise** - Parent features section
- **Testimonials** - Student/parent quotes with avatars
- **BlogPreview** - 3 blog post cards
- **CTABottom** - Final conversion CTA
- **Footer** - Full footer with link columns

### UI Library (~50 shadcn/ui components)
Full shadcn/ui "new-york" style installation including: button, card, dialog, sheet, tabs, accordion, form, input, select, checkbox, radio-group, slider, progress, badge, avatar, tooltip, popover, dropdown-menu, sidebar, table, carousel, calendar, and many more.

### Dashboard Components
Each dashboard page re-implements its own sidebar inline (not extracted). The sidebar pattern is duplicated across every dashboard page via a local `SidebarItem` component.

## 4. Data Models & API Routes

### API Routes: **NONE**
No `src/app/api/` directory exists. Zero server-side endpoints.

### Data Storage: **localStorage only**
- `shs_student_name` - Student's first name
- `shs_onboarding_score` - Current score entered during onboarding
- `shs_onboarding_worry` - Selected worry topic
- Various onboarding selections stored temporarily

### Database Dependencies (installed but unused)
- **drizzle-orm** + **drizzle-kit** - ORM installed, no schema files exist
- **@libsql/client** - SQLite/Turso client installed, not configured
- **better-auth** (v1.3.10) - Auth library installed, not configured
- **bcrypt** - Password hashing installed, not used
- **stripe** - Payment SDK installed, not integrated

## 5. Dependencies Analysis

### Core Framework
- **Next.js 15.3.6** (App Router, Turbopack)
- **React 19.0.0**
- **TypeScript 5.x**
- **Tailwind CSS v4** with `tw-animate-css`

### UI Libraries
- **shadcn/ui** (new-york style) - ~50 Radix-based components
- **framer-motion** / **motion** - Heavy animation usage throughout
- **lucide-react** + **@tabler/icons-react** + **react-icons** - 3 icon libraries (redundant)
- **recharts** - Used in tailored-optimization section and performance page

### Heavy/Unused Dependencies (bloat)
- **@react-three/fiber** + **@react-three/drei** + **three** + **three-globe** - 3D libraries (no 3D content visible)
- **cobe** - Globe animation library (unused)
- **@tsparticles/\*** - Particle effects (unused)
- **dotted-map** - Map visualization (unused)
- **simplex-noise** - Noise generation (unused)
- **swiper** - Carousel (using embla-carousel instead)
- **react-fast-marquee** - Marquee (custom CSS marquee used instead)
- **react-responsive-masonry** - Masonry layout (unused)
- **react-syntax-highlighter** - Code highlighting (unused)
- **react-wrap-balancer** - Text balancing (unused)
- **react-dropzone** - File upload (unused)

### Orchids Platform
- **atmn** + **autumn-js** - Orchids platform integration
- Visual editor scripts loaded in layout
- Component tagger loader in webpack/turbopack config

### Legitimately Used
- framer-motion, recharts, embla-carousel-react, lucide-react, date-fns, sonner, next-themes, zod, react-hook-form, @hookform/resolvers, class-variance-authority, clsx, tailwind-merge, vaul, cmdk, input-otp, react-intersection-observer, react-day-picker, react-resizable-panels

## 6. What Works vs Scaffolding

### Fully Working
- ✅ Landing page - Complete, polished marketing site
- ✅ Signup flow navigation - Full multi-step onboarding journey
- ✅ Onboarding data collection via localStorage
- ✅ Dashboard UI layouts and navigation
- ✅ Responsive design (mobile hamburger menu, responsive grids)
- ✅ Animations (framer-motion throughout)
- ✅ Blog/resources pages with article content

### Scaffolding / Placeholder
- ❌ **Authentication** - No auth configured despite better-auth being installed
- ❌ **Database** - No schema, no migrations, no queries despite Drizzle being installed
- ❌ **API routes** - None exist
- ❌ **Payments** - Stripe installed but not integrated; paywall is UI-only
- ❌ **Practice questions** - No actual question content or quiz engine
- ❌ **Mock exams** - UI only, no exam-taking functionality
- ❌ **Performance tracking** - All data is hardcoded, nothing real
- ❌ **User profiles** - No persistence beyond localStorage
- ❌ **Form submissions** - All forms use `onSubmit={(e) => e.preventDefault()}`
- ❌ **Search** - Resources search bar is decorative
- ❌ **Partner directory** - Hardcoded fake data
- ❌ **Blog CMS** - Articles are hardcoded in component files

## 7. Tech Decisions Already Made

| Decision | Choice |
|----------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom theme tokens |
| Component library | shadcn/ui (new-york variant) |
| Animation | framer-motion |
| Charts | Recharts |
| Icons | lucide-react (primary), react-icons, @tabler/icons-react |
| Forms | react-hook-form + zod (installed, barely used) |
| ORM | Drizzle (installed, not configured) |
| Database | @libsql/client / Turso (installed, not configured) |
| Auth | better-auth (installed, not configured) |
| Payments | Stripe (installed, not configured) |
| Carousel | embla-carousel-react |
| Toasts | sonner |
| Package manager | npm + bun (both lockfiles present) |
| Deployment | Likely Vercel (Next.js default, Orchids integration) |
| Dev server | Turbopack |

### Design System / Brand
- **Primary color**: `deep-forest` (#152822) - dark green/teal
- **Accent**: `mint` (#C8F27B) - lime green
- **Secondary**: `sage` (#D0E6D6) - soft green
- **Fonts**: Plus Jakarta Sans (body) + Space Grotesk (display)
- **Border radius**: Very rounded (32px cards, 2xl inputs)
- **Style**: Modern, clean, premium feel with generous whitespace

## 8. What Can Be Reused vs Needs Rebuilding

### ✅ Reuse As-Is
- **Landing page** - All 12 sections are polished and ready
- **Navbar & Footer** - Complete, responsive
- **Design system** - Color tokens, fonts, spacing conventions in globals.css
- **shadcn/ui components** - Full library installed and configured
- **Onboarding flow UI** - 12-step onboarding is well-designed, just needs backend
- **Signup forms UI** - Look great, need auth integration
- **globals.css theme** - Well-organized custom color system

### 🔧 Reuse with Modifications
- **Dashboard layout** - Good sidebar + content pattern, but sidebar is duplicated in every page. Extract into shared layout component
- **Dashboard pages** - UI patterns are solid, replace hardcoded data with real data
- **Paywall page** - Needs Stripe Checkout integration
- **Success page** - Needs to read from actual payment session
- **Blog/resources** - Good UI, needs CMS or MDX backend
- **Practice page** - Great topic tree UI, needs actual question engine
- **Mock exams page** - Good list UI, needs exam-taking experience

### 🔨 Needs Rebuilding
- **Authentication system** - Configure better-auth, add middleware, protect routes
- **Database layer** - Create Drizzle schema, migrations, seed data
- **API routes** - Build all CRUD endpoints (users, scores, practice sessions, etc.)
- **Question engine** - Core product feature doesn't exist at all
- **Real-time scoring/analytics** - Currently all fake data
- **Payment flow** - Stripe integration end-to-end
- **Dashboard sidebar** - Extract from page duplication into shared layout
- **Search functionality** - Needs actual implementation
- **Parent portal** - Referenced but not built

### 🗑️ Should Remove
- Three.js / react-three-fiber / three-globe / cobe (unused 3D)
- @tsparticles (unused particles)
- dotted-map, simplex-noise (unused)
- swiper (using embla instead)
- react-fast-marquee (using CSS)
- react-responsive-masonry, react-syntax-highlighter, react-wrap-balancer (unused)
- Duplicate icon libraries (pick one: lucide-react)
- Orchids/visual-editor scripts (unless actively using Orchids platform)

---

## Summary

**SHSprep is a well-designed frontend prototype** for an SHSAT test prep platform. The landing page and onboarding flow are production-quality. The dashboard pages have solid UI patterns with realistic-looking hardcoded data. However, **there is zero backend functionality** — no auth, no database, no API routes, no actual question content, no payment processing. The codebase has significant dependency bloat (~15 unused packages). The core product (practice questions, mock exams, adaptive learning, performance tracking) exists only as UI mockups and needs to be built from scratch on the backend.
