# 📋 PRODUCT BACKLOG — Internet Immune System
### Version: 1.0.0 | Last Updated: 2026-08-02 | Status: ACTIVE

> Nguồn: [DesignFreeze.md](../DesignFreeze.md) | [FeatureList.md](../01_Product/FeatureList.md) | [MVP.md](../01_Product/MVP.md)
> Repository: [KimDung1/Internet-Immune-System](https://github.com/KimDung1/Internet-Immune-System)

---

## 🗺️ Epic Map

| Epic ID | Tên Epic | Feature | Priority | Stories | Tasks |
|---|---|---|---|---|---|
| [EPIC-01](#epic-01) | Foundation & Infrastructure | Infra | P0 | 4 | 18 |
| [EPIC-02](#epic-02) | Design System & UI Foundation | F-UI | P0 | 4 | 16 |
| [EPIC-03](#epic-03) | Authentication & User | F-Auth | P0 | 3 | 10 |
| [EPIC-04](#epic-04) | AI Detect & Explain Engine | F-01, F-03 | P0 | 5 | 22 |
| [EPIC-05](#epic-05) | Consequence Simulation | F-02 | P0 | 4 | 18 |
| [EPIC-06](#epic-06) | Chrome Extension & Protect | F-04 | P1 | 4 | 16 |
| [EPIC-07](#epic-07) | Training Mode & Dashboard | F-05, F-06 | P1 | 4 | 16 |
| **TOTAL** | | | | **28** | **116** |

---

## Ký hiệu Priority

| Symbol | Nghĩa |
|---|---|
| 🔴 P0 | Critical — Block release nếu thiếu |
| 🟡 P1 | High — Cần cho MVP quality |
| 🟢 P2 | Medium — Nice to have |
| ⚪ P3 | Low — Post-MVP |

---

## Definition of Done (Global)

Mọi Task được coi là **DONE** khi:
- [ ] Code đã được review và approved bởi ≥1 reviewer
- [ ] Unit tests đã viết và pass (coverage ≥ 70%)
- [ ] Không có lint errors (`pnpm lint` pass)
- [ ] TypeScript compiles without errors
- [ ] Branch merged vào `develop` qua PR
- [ ] Acceptance Criteria trong task đã được verify
- [ ] Không có console.error hay unhandled promise rejections

---

## EPIC-01: Foundation & Infrastructure Setup

> **Goal**: Khởi tạo monorepo, CI/CD, Firebase project, và toàn bộ hạ tầng cơ bản.
> **Priority**: 🔴 P0 | **Dependency**: None — bắt đầu đầu tiên

---

### STORY-01.1: Monorepo Initialization

**As a** developer, **I want** a working Turborepo monorepo **so that** I can develop all apps in one place with shared configs.

**Priority**: 🔴 P0 | **Estimate**: 6h total

---

#### TASK-01.1.1: Bootstrap Turborepo + pnpm workspace

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | None |

**Steps**:
1. `pnpm init` tại root
2. Tạo `pnpm-workspace.yaml` với `apps/*` và `packages/*`
3. Cài Turborepo: `pnpm add -D turbo`
4. Tạo `turbo.json` với pipeline: `build`, `dev`, `lint`, `test`
5. Tạo folder structure: `apps/web`, `apps/api`, `apps/extension`, `packages/ui`, `packages/core`, `packages/config`

**Acceptance Criteria**:
- [ ] `pnpm dev` chạy được từ root (turbo dev)
- [ ] Tất cả apps có thể import từ `packages/core`
- [ ] `turbo.json` có đầy đủ pipeline

**Definition of Done**: `pnpm build` pass toàn bộ workspace. Folder structure khớp `FolderStructure.md`.

---

#### TASK-01.1.2: Setup shared TypeScript config

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-01.1.1 |

**Steps**:
1. Tạo `packages/config/tsconfig.base.json`
2. Tạo `packages/config/tsconfig.nextjs.json` (extend base)
3. Tạo `packages/config/tsconfig.node.json` (extend base)
4. Mỗi app extend từ config phù hợp

**Acceptance Criteria**:
- [ ] `tsc --noEmit` pass ở mọi app
- [ ] Path aliases `@/` hoạt động trong Next.js
- [ ] Strict mode bật (`strict: true`)

**Definition of Done**: TypeScript compile không lỗi toàn workspace.

---

#### TASK-01.1.3: Setup shared ESLint + Prettier

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-01.1.2 |

**Steps**:
1. Tạo `packages/config/.eslintrc.js` (base rules)
2. Tạo `packages/config/prettier.config.js`
3. Cài `eslint-config-prettier`, `@typescript-eslint/eslint-plugin`
4. Mỗi app extend config chung

**Acceptance Criteria**:
- [ ] `pnpm lint` pass toàn workspace
- [ ] Prettier format nhất quán (single quotes, 2 spaces)
- [ ] Pre-commit hook chạy lint

**Definition of Done**: `pnpm lint` 0 errors từ root.

---

#### TASK-01.1.4: Setup shared Zod schemas (packages/core)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.1.2 |

**Steps**:
1. Tạo `packages/core/src/schemas/scan.schema.ts` — ScanRequest, ScanResponse
2. Tạo `packages/core/src/schemas/simulation.schema.ts`
3. Tạo `packages/core/src/schemas/user.schema.ts`
4. Tạo `packages/core/src/types/index.ts` (export all)
5. Export `packages/core/index.ts`

**Acceptance Criteria**:
- [ ] ScanResponse Zod schema khớp 100% với API Freeze
- [ ] Apps/api và apps/web có thể import `@repo/core`
- [ ] Zod validation viết unit test (10 cases)

**Definition of Done**: `packages/core` build thành công. Schemas match DesignFreeze Section 3.4.

---

### STORY-01.2: Firebase Project Setup

**As a** developer, **I want** Firebase fully configured **so that** auth, database, and security rules are ready.

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-01.2.1: Tạo Firebase project & enable services

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-01.1.1 |

**Steps**:
1. Tạo Firebase project `internet-immune-system-prod`
2. Enable: Authentication (Google provider), Firestore, Storage
3. Tạo Firebase apps: Web app config
4. Tạo `.env.local.example` với tất cả FIREBASE_ vars

**Acceptance Criteria**:
- [ ] Firebase Console: Auth, Firestore, Storage đều ENABLED
- [ ] Google Sign-in provider được bật
- [ ] `.env.local.example` có đủ 8 Firebase env vars

**Definition of Done**: Firebase project active, không có billing alert.

---

#### TASK-01.2.2: Deploy Firestore Security Rules

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.2.1 |

**Steps**:
1. Tạo `firestore.rules` từ DesignFreeze Section 4.4 (chính xác từng dòng)
2. Tạo `firestore.indexes.json` từ DesignFreeze Section 4.3 (6 composite indexes)
3. `firebase deploy --only firestore:rules,firestore:indexes`
4. Test rules bằng Firebase Emulator

**Acceptance Criteria**:
- [ ] Security rules deploy thành công
- [ ] Test case: user chỉ đọc được scan_results của chính mình
- [ ] Test case: threat_intelligence đọc công khai, ghi bị từ chối
- [ ] 6 composite indexes đã tạo

**Definition of Done**: `firebase deploy` exit 0. Emulator tests 100% pass.

---

#### TASK-01.2.3: Setup Firebase Admin SDK cho backend

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-01.2.1 |

**Steps**:
1. Tạo Service Account (Firebase Admin) trên GCP Console
2. Download JSON key → store as `FIREBASE_SERVICE_ACCOUNT` env var
3. Tạo `apps/api/src/lib/firebase-admin.ts` (singleton)
4. Test: verify một Firebase ID token từ Admin SDK

**Acceptance Criteria**:
- [ ] `firebase-admin` khởi tạo không lỗi
- [ ] Token verification hoạt động
- [ ] Service Account key KHÔNG commit vào git (`.gitignore`)

**Definition of Done**: Admin SDK verify token thành công trong unit test.

---

#### TASK-01.2.4: Setup Firebase client SDK cho web app

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-01.2.1 |

**Steps**:
1. Cài `firebase` package trong `apps/web`
2. Tạo `apps/web/src/lib/firebase.ts` (client SDK singleton)
3. Export: `auth`, `db` (Firestore), `app`
4. Test connection với Firestore Emulator

**Acceptance Criteria**:
- [ ] Firebase client init không throw
- [ ] Firestore read/write từ browser hoạt động
- [ ] Auth state listener hoạt động

**Definition of Done**: `firebase.ts` import được, no console errors.

---

### STORY-01.3: Google Cloud Run & API Setup

**As a** developer, **I want** the API deployed to Cloud Run **so that** all services can communicate securely.

**Priority**: 🔴 P0 | **Estimate**: 6h total

---

#### TASK-01.3.1: Initialize Hono.js API app

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.1.1 |

**Steps**:
1. `cd apps/api && pnpm add hono @hono/node-server`
2. Tạo `apps/api/src/index.ts` — Hono app setup
3. Tạo route structure: `/auth`, `/scans`, `/training`, `/users`, `/metrics`, `/reports`
4. Tạo middleware: auth verification, cors, error handler, request ID
5. Health check endpoint: `GET /health → { status: "ok" }`

**Acceptance Criteria**:
- [ ] `GET /health` trả về 200 trong < 100ms
- [ ] CORS chỉ cho phép origins từ DesignFreeze Section 3.1
- [ ] All routes trả về response envelope chuẩn (status, data, error, meta)
- [ ] Request ID được inject vào mọi response header

**Definition of Done**: API chạy local port 8080, health check pass.

---

#### TASK-01.3.2: Tạo Dockerfile cho API

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.3.1 |

**Steps**:
1. Tạo `apps/api/Dockerfile` (multi-stage: builder + runner)
2. Base image: `node:20-alpine`
3. Tạo `.dockerignore`
4. Test: `docker build` và `docker run -p 8080:8080`
5. Tạo `apps/api/cloudbuild.yaml` cho Cloud Build

**Acceptance Criteria**:
- [ ] Docker image build thành công
- [ ] Image size < 200MB
- [ ] Container khởi động trong < 3s
- [ ] `/health` respond từ container

**Definition of Done**: `docker run` → `/health` → 200 OK.

---

#### TASK-01.3.3: Deploy lên Cloud Run (staging)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.3.2 |

**Steps**:
1. Enable Cloud Run API trên GCP
2. Deploy: `gcloud run deploy immune-api-staging --region=asia-southeast1`
3. Cấu hình: min-instances=0, max-instances=10, memory=512Mi
4. Set env vars (Firebase, Gemini keys) qua Secret Manager
5. Test: curl deployed URL `/health`

**Acceptance Criteria**:
- [ ] Service deployed thành công (`gcloud run services list`)
- [ ] URL https trả về 200 cho `/health`
- [ ] Logs xuất hiện trong Cloud Logging
- [ ] Secrets không exposed trong env output

**Definition of Done**: Cloud Run URL accessible, logs visible.

---

### STORY-01.4: CI/CD Pipeline

**As a** developer, **I want** automated CI/CD **so that** every PR is tested and every merge to main deploys automatically.

**Priority**: 🟡 P1 | **Estimate**: 6h total

---

#### TASK-01.4.1: Setup GitHub Actions — CI pipeline

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.1.3 |

**Steps**:
1. Tạo `.github/workflows/ci.yml`
2. Trigger: pull_request → develop, main
3. Jobs: `lint` → `typecheck` → `test` → `build`
4. Cache: pnpm store, turbo cache
5. Run trên: `ubuntu-latest`, Node 20

**Acceptance Criteria**:
- [ ] CI chạy tự động khi tạo PR
- [ ] Fail nếu lint errors hoặc test failures
- [ ] Build time < 3 phút (với cache)
- [ ] PR không merge được khi CI fail

**Definition of Done**: PR CI badge hiển thị ✅ trên GitHub.

---

#### TASK-01.4.2: Setup GitHub Actions — CD pipeline (Cloud Run)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.4.1, TASK-01.3.3 |

**Steps**:
1. Tạo `.github/workflows/deploy-api.yml`
2. Trigger: push → main branch
3. Steps: build Docker → push to Artifact Registry → deploy Cloud Run
4. Store GCP credentials trong GitHub Secrets
5. Notify deployment status (Slack/email)

**Acceptance Criteria**:
- [ ] Merge to main tự động deploy API
- [ ] Deploy hoàn tất trong < 5 phút
- [ ] Rollback: có thể revert bằng previous revision
- [ ] Deployment logs được ghi lại

**Definition of Done**: Push to main → Cloud Run updates trong < 5 phút.

---

#### TASK-01.4.3: Setup branch protection rules

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 30m |
| **Dependency** | TASK-01.4.1 |

**Steps**:
1. GitHub Settings → Branches → Add rule cho `main` và `develop`
2. Require: PR reviews (1), status checks (CI), no force push
3. Tạo `CODEOWNERS` file

**Acceptance Criteria**:
- [ ] Direct push to main bị block
- [ ] PR phải pass CI trước khi merge
- [ ] CODEOWNERS assign đúng reviewers

**Definition of Done**: Branch protection rules active trên GitHub.

---

#### TASK-01.4.4: Setup Sentry error tracking

| Field | Value |
|---|---|
| **Priority** | 🟢 P2 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-01.3.3 |

**Steps**:
1. Tạo Sentry project (Node.js + Next.js)
2. Cài `@sentry/nextjs` và `@sentry/node`
3. Setup `sentry.server.config.ts`, `sentry.client.config.ts`
4. Test: throw một error → verify xuất hiện trong Sentry dashboard

**Acceptance Criteria**:
- [ ] Errors từ API xuất hiện trong Sentry
- [ ] Source maps uploaded (stack trace readable)
- [ ] Alert khi error rate > 5/min

**Definition of Done**: Test error captured trong Sentry với correct stack trace.

---

## EPIC-02: Design System & UI Foundation

> **Goal**: Xây dựng toàn bộ design system từ DesignFreeze, tất cả components, và layouts.
> **Priority**: 🔴 P0 | **Dependency**: TASK-01.1.1 (monorepo)

---

### STORY-02.1: Design Tokens & Global Styles

**As a** frontend developer, **I want** all design tokens implemented **so that** every component uses consistent styles.

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-02.1.1: Setup Tailwind CSS + Shadcn UI

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-01.1.1 |

**Steps**:
1. Cài Tailwind CSS trong `apps/web` và `packages/ui`
2. Tạo `tailwind.config.ts` extend với design tokens từ DesignFreeze
3. Init Shadcn UI: `npx shadcn@latest init`
4. Chọn theme: dark, CSS variables mode

**Acceptance Criteria**:
- [ ] Tailwind classes hoạt động
- [ ] Shadcn UI components import được
- [ ] CSS variables định nghĩa đúng (--background, --primary, etc.)

**Definition of Done**: Demo page render với Tailwind + Shadcn không lỗi.

---

#### TASK-02.1.2: Implement Color Tokens (DesignFreeze 1.1)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-02.1.1 |

**Steps**:
1. Tạo `apps/web/src/styles/tokens.css`
2. Implement đầy đủ 11 color tokens từ DesignFreeze:
   - `--color-bg-base: #0B1120`
   - `--color-primary-base: #06B6D4`
   - Danger, Warning, Success, Glow tokens
3. Extend `tailwind.config.ts` với custom colors
4. Extend với glow box-shadow utilities

**Acceptance Criteria**:
- [ ] `bg-brand-primary` → render màu `#06B6D4`
- [ ] `text-danger` → render màu `#EF4444`
- [ ] Dark mode mặc định (không có light mode toggle)
- [ ] Contrast ratio test: primary text trên bg ≥ 4.5:1

**Definition of Done**: Color tokens từ DesignFreeze 1.1 khớp 100%.

---

#### TASK-02.1.3: Implement Typography System (DesignFreeze 1.2)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-02.1.1 |

**Steps**:
1. Load Google Fonts: `Inter` + `Space Grotesk` qua `next/font`
2. Apply font variables trong `layout.tsx`
3. Tạo typography Tailwind utilities: `text-display`, `text-h1`, `text-body`
4. Test tiếng Việt: kiểm tra diacritics render đúng

**Acceptance Criteria**:
- [ ] Inter font load thành công (network waterfall)
- [ ] Space Grotesk dùng cho scores/AI data
- [ ] Vietnamese characters render đúng (không bị vỡ)
- [ ] `text-display`: 48px Bold

**Definition of Done**: Typography scale từ DesignFreeze 1.2 render đúng.

---

#### TASK-02.1.4: Implement Animation System (DesignFreeze 1.8)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. Thêm custom animations vào `tailwind.config.ts`:
   - `animate-scan-radar`: 2s linear infinite
   - `animate-immune-response`: 0.3s ease-out
   - `animate-hud-pulse`: 3s ease-in-out infinite
   - `animate-particle-dissolve`: 600ms ease-out
   - `animate-badge-burst`: 400ms spring
2. Tạo global CSS keyframes
3. Implement `prefers-reduced-motion` override

**Acceptance Criteria**:
- [ ] Tất cả 7 animations từ DesignFreeze 1.8 hoạt động
- [ ] `@media (prefers-reduced-motion: reduce)` disable animations
- [ ] Animations không cause layout shift (CLS = 0)

**Definition of Done**: Demo page show tất cả animations, reduced-motion test pass.

---

### STORY-02.2: Core UI Components

**As a** developer, **I want** reusable components **so that** I can build pages quickly and consistently.

**Priority**: 🔴 P0 | **Estimate**: 7h total

---

#### TASK-02.2.1: Build Button component (3 variants)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. Tạo `packages/ui/src/components/Button.tsx`
2. Variants: `primary`, `danger`, `ghost` (DesignFreeze 1.6)
3. 5 states: default, hover, focus, active, disabled
4. Props: `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`
5. Viết Storybook story hoặc visual test

**Acceptance Criteria**:
- [ ] Primary: `#06B6D4` bg, glow on hover
- [ ] Danger: `#EF4444` bg, pulse animation khi threat
- [ ] Ghost: transparent, 1px border
- [ ] Disabled: 30% opacity, no events
- [ ] Focus: visible 2px outline (a11y)
- [ ] Loading: spinner replaces label

**Definition of Done**: Button render đúng 3 variants × 5 states. Unit tests pass.

---

#### TASK-02.2.2: Build Card component

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. Tạo `packages/ui/src/components/Card.tsx`
2. Props: `header`, `children`, `footer`, `variant` (default/elevated/glass)
3. Specs: `#111827` bg, 1px border rgba(255,255,255,0.08), 16px radius

**Acceptance Criteria**:
- [ ] Card render đúng specs từ DesignFreeze 1.6
- [ ] Hover: `#1F2937` bg transition 200ms
- [ ] Glass variant: backdrop-filter blur

**Definition of Done**: Card component unit test pass, renders in Storybook.

---

#### TASK-02.2.3: Build RiskBadge component

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. Tạo `packages/ui/src/components/RiskBadge.tsx`
2. Variants: `safe` (green), `suspicious` (amber), `phishing` (red), `malware` (red), `scam` (red)
3. Animated glow matching risk level
4. Input: `classification: string`, `riskScore: number`

**Acceptance Criteria**:
- [ ] `safe` → `#10B981` + green glow
- [ ] `suspicious` → `#F59E0B` + amber glow
- [ ] `phishing|malware|scam` → `#EF4444` + red glow + pulse animation
- [ ] Risk score number displayed correctly

**Definition of Done**: RiskBadge renders all 5 classifications correctly.

---

#### TASK-02.2.4: Build ImmunityRing component (SVG)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.1.4 |

**Steps**:
1. Tạo `packages/ui/src/components/ImmunityRing.tsx`
2. SVG circle, stroke-width: 8px
3. Gradient: `#10B981` → `#06B6D4`
4. Center: score number (Space Grotesk Bold 48px)
5. Animation: progress reveal on mount, 1s ease-out
6. Props: `score: number (0-100)`, `size?: number`

**Acceptance Criteria**:
- [ ] Score 0 → no fill, Score 100 → full ring
- [ ] Animation triggers on mount (1s)
- [ ] Gradient renders correctly
- [ ] prefers-reduced-motion: no animation, instant render

**Definition of Done**: ImmunityRing unit test covers 0, 50, 100 scores.

---

#### TASK-02.2.5: Build ScanInput component

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. Tạo `packages/ui/src/components/ScanInput.tsx`
2. Textarea + Scan icon button (right-aligned)
3. Focus: 2px `#06B6D4` border
4. Placeholder: "Dán link, tin nhắn, hoặc email nghi ngờ vào đây..."
5. Character counter (max 4000 chars)
6. Paste event handler

**Acceptance Criteria**:
- [ ] Input accepts URL, text, email
- [ ] Character limit: 4000 (show counter when > 3800)
- [ ] Paste → auto-submit option
- [ ] Invalid input shows error state

**Definition of Done**: ScanInput renders and handles paste/submit events.

---

### STORY-02.3: Page Layouts & Navigation

**As a** user, **I want** consistent navigation **so that** I can move between sections easily.

**Priority**: 🔴 P0 | **Estimate**: 4h total

---

#### TASK-02.3.1: Build Root Layout + Dark mode body

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-02.1.2 |

**Steps**:
1. `apps/web/src/app/layout.tsx` — root layout
2. Set `<html lang="vi" className="dark">`
3. Apply font variables, background `#0B1120`
4. Global meta tags (SEO): title, description, viewport

**Acceptance Criteria**:
- [ ] Body background: `#0B1120` trên mọi trang
- [ ] `lang="vi"` set đúng
- [ ] Fonts load không gây FOUC (Flash of Unstyled Content)

**Definition of Done**: Layout renders, Lighthouse accessibility > 90.

---

#### TASK-02.3.2: Build HUD Overlay component (Protect Mode indicator)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-02.1.4 |

**Steps**:
1. Tạo `packages/ui/src/components/HUDOverlay.tsx`
2. Fixed position, top-right corner
3. Default state: subtle green pulse dot (3s infinite)
4. Threat state: flash red, expand, show popup
5. Z-index: 50 (Toast layer)

**Acceptance Criteria**:
- [ ] Visible in all pages (fixed overlay)
- [ ] Default: green dot, 3s pulse
- [ ] Threat: red flash + popup appears in 0.3s
- [ ] Dismiss button on popup

**Definition of Done**: HUDOverlay renders, both states work visually.

---

#### TASK-02.3.3: Build Navigation Sidebar (Dashboard)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-02.3.1 |

**Steps**:
1. Tạo `apps/web/src/components/layout/Sidebar.tsx`
2. Links: Dashboard, Scan, Training, History, Settings
3. Active state: highlight with cyan
4. Mobile: bottom tab bar (< 640px)
5. Icons: Lucide React

**Acceptance Criteria**:
- [ ] Active link highlighted `#06B6D4`
- [ ] Mobile: bottom navigation visible, sidebar hidden
- [ ] All links accessible by keyboard

**Definition of Done**: Sidebar renders, routing works, mobile responsive.

---

### STORY-02.4: Landing Page

**As a** visitor, **I want** an impressive landing page **so that** I understand what Internet Immune System does.

**Priority**: 🔴 P0 | **Estimate**: 4h total

---

#### TASK-02.4.1: Build Hero Section

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.1.4 |

**Steps**:
1. `apps/web/src/app/page.tsx` — Landing page
2. Hero: "Your AI Immune System for the Internet" (H1, 48px)
3. Subtext + CTA buttons: "Thử ngay miễn phí" + "Xem demo"
4. Background: particle/mesh animation (CSS only, no heavy libs)
5. Logo/brand mark animation

**Acceptance Criteria**:
- [ ] H1 visible above fold
- [ ] Page load: Lighthouse performance > 85
- [ ] CTA → navigate to scan page or login
- [ ] Responsive: mobile layout correct

**Definition of Done**: Landing page deployed, LCP < 2.5s.

---

#### TASK-02.4.2: Build Feature Showcase Section (5 Modes)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.4.1 |

**Steps**:
1. Cards cho 5 AI modes: Detect, Simulate, Explain, Train, Protect
2. Each card: icon + title + 1-line description + mode color
3. Subtle hover animation (scale 1.02, glow)
4. Scroll-triggered reveal animation

**Acceptance Criteria**:
- [ ] 5 mode cards visible
- [ ] Hover: scale + glow effect
- [ ] Scroll reveal: smooth entrance
- [ ] Mobile: cards stack vertically

**Definition of Done**: All 5 cards render correctly on desktop + mobile.

---

## EPIC-03: Authentication & User Management

> **Goal**: Firebase Auth hoàn chỉnh, user profile, session management.
> **Priority**: 🔴 P0 | **Dependency**: EPIC-01

---

### STORY-03.1: Firebase Authentication Flow

**As a** user, **I want** to sign in with Google **so that** my data is saved.

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-03.1.1: Build Auth Context + Provider

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.2.4 |

**Steps**:
1. Tạo `apps/web/src/contexts/AuthContext.tsx`
2. Expose: `user`, `loading`, `signInWithGoogle()`, `signOut()`
3. Wrap app trong `layout.tsx`
4. Persist auth state (Firebase handles this)
5. Redirect to `/dashboard` after login, `/` after logout

**Acceptance Criteria**:
- [ ] Google Sign-in popup works
- [ ] Auth state persists on page refresh
- [ ] Loading state during auth check
- [ ] `signOut` clears state, redirects to `/`

**Definition of Done**: Login/logout flow works end-to-end.

---

#### TASK-03.1.2: Build Login Page UI

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-03.1.1 |

**Steps**:
1. `apps/web/src/app/(auth)/login/page.tsx`
2. Logo + tagline + "Sign in with Google" button
3. Google button: white bg, Google icon, "Tiếp tục với Google"
4. Background: same dark theme với particle effect (subtle)

**Acceptance Criteria**:
- [ ] Google button renders with logo
- [ ] Loading spinner during auth
- [ ] Error message if auth fails
- [ ] Redirect if already authenticated

**Definition of Done**: Login page accessible, auth flow works.

---

#### TASK-03.1.3: Build Protected Route middleware

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-03.1.1 |

**Steps**:
1. Tạo `apps/web/src/middleware.ts`
2. Protect routes: `/dashboard/*`, `/training/*`, `/history/*`
3. Unauthenticated → redirect `/login`
4. Firebase token validation on protected API routes

**Acceptance Criteria**:
- [ ] `/dashboard` redirect to `/login` if not authed
- [ ] `/login` redirect to `/dashboard` if already authed
- [ ] Token included in all API calls (Authorization header)

**Definition of Done**: Route protection works. Unauthorized access blocked.

---

#### TASK-03.1.4: POST /auth/verify API endpoint

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-01.2.3, TASK-01.3.1 |

**Steps**:
1. `apps/api/src/routes/auth.route.ts`
2. `POST /v1/auth/verify`: verify Firebase ID token
3. Upsert user document in Firestore `users` collection
4. Return user data (DesignFreeze 3.4 schema)
5. Default trust_score: 50

**Acceptance Criteria**:
- [ ] Valid token → 200, user created/updated in Firestore
- [ ] Invalid token → 401 UNAUTHORIZED
- [ ] User doc has all fields from DesignFreeze 4.2
- [ ] `last_active` updated on each verify

**Definition of Done**: `/auth/verify` integration test pass (valid + invalid token).

---

### STORY-03.2: User Profile & Settings

**Priority**: 🟡 P1 | **Estimate**: 4h total

---

#### TASK-03.2.1: GET /users/me endpoint

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1h |
| **Dependency** | TASK-03.1.4 |

**Steps**:
1. `apps/api/src/routes/users.route.ts`
2. `GET /v1/users/me`: read user from Firestore by auth UID
3. Return schema từ DesignFreeze 3.4

**Acceptance Criteria**:
- [ ] Returns trustScore, badges, settings
- [ ] 401 nếu unauthenticated
- [ ] 404 nếu user doc không tồn tại

**Definition of Done**: GET /users/me unit test pass.

---

#### TASK-03.2.2: PATCH /users/me/settings endpoint

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1h |
| **Dependency** | TASK-03.2.1 |

**Steps**:
1. `PATCH /v1/users/me/settings`
2. Allowed fields: `alertsEnabled`, `autoBlock`, `language`
3. Validate với Zod schema
4. Update Firestore `users/{uid}.settings`

**Acceptance Criteria**:
- [ ] Partial update (không cần gửi toàn bộ settings)
- [ ] Invalid fields rejected (400)
- [ ] autoBlock update reflected in extension behavior

**Definition of Done**: PATCH /settings integration test pass.

---

#### TASK-03.2.3: Build Settings Page UI

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-03.2.2 |

**Steps**:
1. `apps/web/src/app/settings/page.tsx`
2. Toggle: Alerts enabled/disabled
3. Toggle: Auto-block enabled/disabled
4. Language selector: Vietnamese / English
5. Sign out button

**Acceptance Criteria**:
- [ ] Toggles update immediately (optimistic UI)
- [ ] State persists after page refresh
- [ ] Language change reflects in UI text

**Definition of Done**: Settings page renders, toggles work, API calls succeed.

---

## EPIC-04: AI Detect & Explain Engine

> **Goal**: Core fraud detection — POST /scans/analyze, POST /scans/:id/explain, Gemini integration.
> **Priority**: 🔴 P0 | **Dependency**: EPIC-01, EPIC-03 | **Feature**: F-01, F-03

---

### STORY-04.1: Gemini AI Service

**As a** backend developer, **I want** a reliable Gemini service **so that** all agents can call it consistently.

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-04.1.1: Initialize Gemini SDK + Vertex AI

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-01.3.1 |

**Steps**:
1. Cài `@google/generative-ai` hoặc `@google-cloud/vertexai`
2. Tạo `apps/api/src/lib/gemini.ts` (singleton client)
3. Khởi tạo models: `gemini-2.5-flash` và `gemini-2.5-pro`
4. Set safety settings từ DesignFreeze 5.6 (BLOCK_MEDIUM_AND_ABOVE)
5. Set max output tokens per model per use case

**Acceptance Criteria**:
- [ ] Gemini client khởi tạo không lỗi
- [ ] Simple test prompt returns response
- [ ] API key stored in Secret Manager (not env file)
- [ ] Safety settings applied correctly

**Definition of Done**: `gemini.ts` singleton call returns valid response.

---

#### TASK-04.1.2: Build GeminiService with retry + fallback

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.1.1 |

**Steps**:
1. Tạo `apps/api/src/services/gemini.service.ts`
2. Method: `generateJSON(prompt, model, schema)` → typed response
3. Retry logic: 3 attempts, exponential backoff (1s, 2s, 4s)
4. Fallback on error: return `{ risk_score: 50, classification: "suspicious", action_recommendation: "WARN" }`
5. Log token usage mỗi request
6. Timeout: 10s (Orchestrator timeout)

**Acceptance Criteria**:
- [ ] JSON parse errors retry automatically
- [ ] After 3 failures → fallback response returned (no throw)
- [ ] Response schema validated bằng Zod
- [ ] Token usage logged (input + output tokens)
- [ ] Timeout 10s enforced

**Definition of Done**: GeminiService unit test covers success, retry, timeout, fallback cases.

---

#### TASK-04.1.3: Implement Threat Intelligence lookup (Firestore)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-01.2.3 |

**Steps**:
1. Tạo `apps/api/src/services/threat-intel.service.ts`
2. Method: `lookup(entityValue: string, entityType: string) → ThreatInfo | null`
3. Hash input bằng SHA-256 để query doc ID
4. Cache trong memory (TTL: 5 phút) để giảm Firestore reads
5. Nếu found + HIGH risk → trả về ngay, skip AI call

**Acceptance Criteria**:
- [ ] Known threat URL detected trong < 100ms (from cache)
- [ ] Cache invalidation sau 5 phút
- [ ] Unknown entity → return null
- [ ] Logs: "Threat found in intelligence DB: {value}"

**Definition of Done**: Lookup unit test: known threat, unknown, cache hit cases.

---

### STORY-04.2: Detect API Endpoint

**As a** user, **I want** to submit content for analysis **so that** I know if it's safe.

**Priority**: 🔴 P0 | **Estimate**: 6h total

---

#### TASK-04.2.1: Build Detect Agent (Detector Agent)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 3h |
| **Dependency** | TASK-04.1.2, TASK-04.1.3 |

**Steps**:
1. Tạo `apps/api/src/agents/detector.agent.ts`
2. Input: `{ url, title, contentData, context }`
3. Step 1: Threat Intel lookup (hash + Firestore check)
4. Step 2 (nếu không có trong TI): Call Gemini Flash với Detect Prompt từ DesignFreeze 5.5
5. Strip HTML tags từ contentData trước khi gửi
6. Truncate content tới 4000 chars
7. Validate response với Zod schema
8. Return DetectorOutput schema từ DesignFreeze 5.4

**Acceptance Criteria**:
- [ ] Known threat URL → P95 response < 200ms (TI hit)
- [ ] Unknown URL → P95 response < 2000ms (Gemini Flash)
- [ ] Confidence < 0.5 → classification KHÔNG phải "safe"
- [ ] HTML stripped, content capped at 4000 chars
- [ ] Output Zod validation 100% pass

**Definition of Done**: Detector agent unit test covers: safe, suspicious, phishing, TI-hit cases.

---

#### TASK-04.2.2: POST /scans/analyze endpoint

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.2.1 |

**Steps**:
1. `apps/api/src/routes/scans.route.ts`
2. `POST /v1/scans/analyze`
3. Validate request body (Zod) — DesignFreeze 3.4
4. Call DetectorAgent
5. Save result to Firestore `scan_results` collection
6. Return response schema từ DesignFreeze 3.4
7. Rate limit: 30 req/min/user

**Acceptance Criteria**:
- [ ] Valid request → 200 với scanId
- [ ] scanId stored in Firestore
- [ ] Invalid contentType → 400 INVALID_INPUT
- [ ] Rate limit exceeded → 429 RATE_LIMITED
- [ ] Response trong < 3s (P95)
- [ ] Request body validation reject malformed JSON

**Definition of Done**: Integration test: submit URL → get scanId → verify in Firestore.

---

#### TASK-04.2.3: GET /scans + GET /scans/:scanId endpoints

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1h |
| **Dependency** | TASK-04.2.2 |

**Steps**:
1. `GET /v1/scans`: query user's scan_results, paginated (page, limit)
2. `GET /v1/scans/:scanId`: fetch single scan_result by ID
3. Verify ownership (uid matches)
4. Sort by timestamp DESC

**Acceptance Criteria**:
- [ ] Pagination: default limit=20, max=50
- [ ] Cannot access other user's scans (403)
- [ ] Empty list → 200 with `data: []`

**Definition of Done**: GET /scans returns paginated list correctly.

---

### STORY-04.3: Explain API Endpoint

**Priority**: 🔴 P0 | **Estimate**: 4h total

---

#### TASK-04.3.1: Build Explain Agent

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.1.2 |

**Steps**:
1. Tạo `apps/api/src/agents/explainer.agent.ts`
2. Input: `{ classification, red_flags, url, scan_result }`
3. Call Gemini Pro với Explain Prompt từ DesignFreeze 5.5
4. Validate output schema: `{ explanation, red_flag_details[], educational_tip }`
5. Language: Vietnamese

**Acceptance Criteria**:
- [ ] Explanation: 150-300 chars
- [ ] Red flag details: ≥1 item per red flag
- [ ] Educational tip: max 120 chars
- [ ] Language: Vietnamese (test với mock)
- [ ] P95 response < 3s

**Definition of Done**: Explain Agent unit test with 3 classification types.

---

#### TASK-04.3.2: POST /scans/:scanId/explain endpoint

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.3.1, TASK-04.2.2 |

**Steps**:
1. `POST /v1/scans/:scanId/explain`
2. Load scan_result từ Firestore
3. Verify ownership
4. Call ExplainerAgent
5. Return explanation schema

**Acceptance Criteria**:
- [ ] Valid scanId → 200 với explanation
- [ ] scanId not found → 404
- [ ] Other user's scanId → 403
- [ ] Safe classification → still returns (but minimal explanation)

**Definition of Done**: Integration test: scan → explain → verify explanation content.

---

### STORY-04.4: Detect UI — Scan Page

**As a** user, **I want** a beautiful scan interface **so that** I can paste content and get AI analysis.

**Priority**: 🔴 P0 | **Estimate**: 6h total

---

#### TASK-04.4.1: Build Scan Page layout + ScanInput

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.2.5 |

**Steps**:
1. `apps/web/src/app/scan/page.tsx`
2. Layout: large ScanInput centered, "Scan Now" CTA
3. Input types tabs: URL / Text / Email
4. Character counter
5. Quick paste from clipboard button

**Acceptance Criteria**:
- [ ] Input accepts paste (Ctrl+V)
- [ ] Tab switches between input modes
- [ ] Character limit enforced (4000)
- [ ] Submit disabled when empty

**Definition of Done**: Scan page renders, paste works, submit triggers.

---

#### TASK-04.4.2: Build Scanning State UI (Radar animation)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.1.4, TASK-04.4.1 |

**Steps**:
1. Scanning state component: full-width overlay
2. Radar SVG animation (cyan rings expanding)
3. Status text: "Đang phân tích..." → "Đang gọi AI..." → "Hoàn tất"
4. WebSocket connection to get progress updates
5. Max display time: 3s (then show result or timeout error)

**Acceptance Criteria**:
- [ ] Radar animation renders correctly
- [ ] Status text updates during scan
- [ ] Timeout handling: if > 5s show error
- [ ] prefers-reduced-motion: static indicator instead of animation

**Definition of Done**: Scanning state displays during API call, transitions to result.

---

#### TASK-04.4.3: Build Scan Result UI — Safe state

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-02.2.3, TASK-04.4.2 |

**Steps**:
1. Safe result card: green tick, "Liên kết an toàn" title
2. RiskBadge: `safe`, score display
3. Brief explanation text
4. CTA: "Quét nội dung khác"

**Acceptance Criteria**:
- [ ] Green tick + calming animation
- [ ] Risk score shown (e.g., 12/100)
- [ ] No red elements visible

**Definition of Done**: Safe result renders with correct styling.

---

#### TASK-04.4.4: Build Scan Result UI — Threat state (Immune Response)

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.2.3, TASK-04.4.2 |

**Steps**:
1. Threat result: red alert header "⚡ Mối đe dọa phát hiện!"
2. Screen vibration effect (0.3s, CSS `@keyframes shake`)
3. RiskBadge: danger state + glow
4. Red flags list (tags from AI)
5. CTA Row: `[🚫 Block]` `[🎭 Simulate]` `[📖 Explain]` buttons

**Acceptance Criteria**:
- [ ] Immune Response animation triggers (0.3s shake)
- [ ] Risk score red, pulsing
- [ ] Red flags list visible
- [ ] 3 CTA buttons functional
- [ ] Danger glow on card

**Definition of Done**: Threat result renders. All 3 CTAs navigate correctly.

---

### STORY-04.5: Explain UI

**Priority**: 🔴 P0 | **Estimate**: 3h total

---

#### TASK-04.5.1: Build Red Flags explanation panel

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-04.3.2 |

**Steps**:
1. Slide-in panel (right side or bottom sheet on mobile)
2. "Tại sao đây là lừa đảo?" header
3. Each red flag: icon + flag name + why dangerous
4. Educational tip section (bottom)
5. "Đóng" button

**Acceptance Criteria**:
- [ ] Panel slides in from right (desktop), bottom (mobile)
- [ ] Each red flag expandable for detail
- [ ] Educational tip distinguished visually

**Definition of Done**: Explain panel renders with API data.

---

#### TASK-04.5.2: Red flag highlight animation

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-04.5.1 |

**Steps**:
1. In raw content preview, highlight text matching red flags
2. Yellow/red highlight with fade-in animation
3. Tooltip on hover: "Red Flag: [reason]"
4. Count badge showing number of flags

**Acceptance Criteria**:
- [ ] Highlighted text stands out visually
- [ ] Hover tooltip shows explanation
- [ ] Animation: fade-in 200ms

**Definition of Done**: Highlights render on top of content preview.

---

## EPIC-05: Consequence Simulation Engine

> **Goal**: The "Wow Moment 2" of the demo — Theater Mode, AI narrative, 3-step consequence.
> **Priority**: 🔴 P0 | **Dependency**: EPIC-04 | **Feature**: F-02

---

### STORY-05.1: Simulation API

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-05.1.1: Build Simulator Agent

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2.5h |
| **Dependency** | TASK-04.1.2 |

**Steps**:
1. Tạo `apps/api/src/agents/simulator.agent.ts`
2. Input: `{ scan_result, user_profile }`
3. Call Gemini Pro với Simulate Prompt từ DesignFreeze 5.5
4. Validate output: `{ steps[3], potential_loss, closing_message }`
5. Each step: title + description (max 150 chars)
6. Ensure no real individual names in output

**Acceptance Criteria**:
- [ ] Output exactly 3 steps (no more, no less)
- [ ] Each description max 150 chars
- [ ] potential_loss in Vietnamese với VNĐ format
- [ ] No real person names (test với regex check)
- [ ] P95 response < 5s

**Definition of Done**: Simulator Agent unit test with phishing, scam, malware inputs.

---

#### TASK-05.1.2: POST /scans/:scanId/simulate endpoint

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-05.1.1, TASK-04.2.2 |

**Steps**:
1. `POST /v1/scans/:scanId/simulate`
2. Load scan_result (verify ownership)
3. Call SimulatorAgent
4. Save simulation to Firestore `simulations` collection
5. Update `scan_results/{scanId}.simulation_id`
6. Return simulation schema

**Acceptance Criteria**:
- [ ] simulationId returned and saved
- [ ] Calling twice on same scanId returns same simulationId (idempotent)
- [ ] Safe scan → 422 with message "Cannot simulate safe content"
- [ ] P95 < 6s

**Definition of Done**: Integration test: scan (threat) → simulate → verify Firestore record.

---

#### TASK-05.1.3: GET /scans/:scanId/simulation endpoint

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1h |
| **Dependency** | TASK-05.1.2 |

**Steps**:
1. `GET /v1/scans/:scanId/simulation`
2. Load simulation from Firestore
3. Return cached result (no re-generate)

**Acceptance Criteria**:
- [ ] Returns existing simulation (no new AI call)
- [ ] Not found → 404

**Definition of Done**: GET returns cached simulation data.

---

### STORY-05.2: Simulation Theater UI

**As a** user, **I want** to see a dramatic simulation **so that** I emotionally understand the consequences.

**Priority**: 🔴 P0 | **Estimate**: 7h total

---

#### TASK-05.2.1: Build Theater Mode overlay

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-02.1.4 |

**Steps**:
1. Tạo `apps/web/src/components/simulation/TheaterMode.tsx`
2. Full-screen overlay: `position: fixed`, `z-index: 40`
3. Fade-in: 800ms ease-in (black overlay từ 0 → 80% opacity)
4. "Theater Mode" label top-center
5. Escape key hoặc close button để exit

**Acceptance Criteria**:
- [ ] 800ms fade-in animation
- [ ] Background content dimmed (80% black overlay)
- [ ] Escape key closes theater
- [ ] prefers-reduced-motion: instant show, no animation

**Definition of Done**: TheaterMode mounts/unmounts correctly with animation.

---

#### TASK-05.2.2: Build Consequence Timeline component

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 3h |
| **Dependency** | TASK-05.2.1 |

**Steps**:
1. Tạo `ConsequenceTimeline.tsx`
2. 3 steps reveal sequentially:
   - Step 1: 0ms delay
   - Step 2: 1.5s delay
   - Step 3: 3s delay
3. Each step: step number (red circle) + title + description
4. Progress bar across top
5. "Potential Loss" banner: large red text, blur animation
6. Closing message: green pulse "Rất may, hệ miễn dịch đã chặn..."

**Acceptance Criteria**:
- [ ] Steps reveal with 1.5s intervals
- [ ] Progress bar updates with each step
- [ ] Potential loss text appears at step 3
- [ ] Closing message triggers after all steps
- [ ] Entire sequence completable in < 8s

**Definition of Done**: Timeline demo runs without intervention, all steps show.

---

#### TASK-05.2.3: Build Simulation loading state

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 1h |
| **Dependency** | TASK-05.2.1 |

**Steps**:
1. Loading state inside Theater Mode
2. Animated brain/AI processing visual (CSS spinner variant)
3. Text: "AI đang tính toán hậu quả..."
4. Show loading until API responds

**Acceptance Criteria**:
- [ ] Loading state appears immediately on button click
- [ ] Replaced by timeline when data arrives
- [ ] Error state if API fails

**Definition of Done**: Loading → timeline transition smooth.

---

#### TASK-05.2.4: Particle dissolve effect (threat neutralized)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-05.2.2 |

**Steps**:
1. CSS particle animation triggered after closing message
2. 20-30 small particles spread and fade (600ms)
3. Color: mixture of red (threat) → green (safe)
4. Canvas-based or pure CSS

**Acceptance Criteria**:
- [ ] Particles appear at closing message
- [ ] 600ms animation duration
- [ ] prefers-reduced-motion: no particles
- [ ] No performance impact (< 1% CPU)

**Definition of Done**: Particle effect plays on closing message reveal.

---

### STORY-05.3: Simulation Trigger Flow

**Priority**: 🔴 P0 | **Estimate**: 2h total

---

#### TASK-05.3.1: Wire "Simulate" CTA to Theater Mode

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.4.4, TASK-05.2.1 |

**Steps**:
1. "Simulate" button on threat result → trigger `POST /scans/:id/simulate`
2. On API response → mount TheaterMode with data
3. Zustand store: `useSimulationStore` — loading, data, isOpen
4. Error handling: toast notification on API fail

**Acceptance Criteria**:
- [ ] Click "Simulate" → Theater opens in < 500ms (loading state)
- [ ] Data arrives → timeline starts
- [ ] Close → return to scan result
- [ ] Error → toast with retry option

**Definition of Done**: End-to-end flow: scan → threat → simulate → theater → close.

---

## EPIC-06: Chrome Extension & Real-time Protect

> **Goal**: MVP Chrome Extension — URL scanning, popup warning, auto-block.
> **Priority**: 🟡 P1 | **Dependency**: EPIC-04 | **Feature**: F-04

---

### STORY-06.1: Extension Foundation

**Priority**: 🟡 P1 | **Estimate**: 5h total

---

#### TASK-06.1.1: Initialize Chrome Extension với CRXJS + Vite

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-01.1.1 |

**Steps**:
1. `cd apps/extension && pnpm add -D vite @crxjs/vite-plugin`
2. Tạo `manifest.json` (Manifest V3)
3. Permissions: `activeTab`, `scripting`, `storage`, `tabs`
4. Entry points: `background.ts`, `content.ts`, `popup.tsx`
5. Build: `pnpm build` → `dist/` folder

**Acceptance Criteria**:
- [ ] `pnpm build` tạo `dist/` với manifest.json
- [ ] Extension loads in Chrome DevTools without errors
- [ ] All 3 entry points bundle correctly

**Definition of Done**: Extension loads in Chrome `chrome://extensions` in dev mode.

---

#### TASK-06.1.2: Implement Background Service Worker

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-06.1.1 |

**Steps**:
1. `apps/extension/src/background/index.ts`
2. Listen for tab updates: `chrome.tabs.onUpdated`
3. Extract URL from each navigation
4. Send URL to content script for DOM check
5. Listen for messages from content script
6. Store auth token from `chrome.storage.local`

**Acceptance Criteria**:
- [ ] Tab URL captured on navigation
- [ ] Message passing: background ↔ content ↔ popup
- [ ] Auth token persisted across sessions

**Definition of Done**: Background worker runs, captures tab updates.

---

#### TASK-06.1.3: Implement Content Script (DOM monitor)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-06.1.2 |

**Steps**:
1. `apps/extension/src/content/index.ts`
2. On page load: extract URL + page title
3. Send to background worker for analysis
4. Listen for threat response → show HUD indicator
5. Inject HUD overlay into DOM (green/red indicator)

**Acceptance Criteria**:
- [ ] Content script injects without breaking page layout
- [ ] Extracts URL + title correctly
- [ ] HUD indicator visible top-right corner

**Definition of Done**: Content script injects, HUD indicator visible on any page.

---

### STORY-06.2: Extension Scan & Warning

**Priority**: 🟡 P1 | **Estimate**: 5h total

---

#### TASK-06.2.1: Connect Extension to API for URL scanning

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-06.1.2, TASK-04.2.2 |

**Steps**:
1. Background worker calls `POST /v1/scans/analyze` with current URL
2. Include Firebase auth token from `chrome.storage.local`
3. Handle unauthenticated: open login popup
4. Debounce: don't scan same URL within 60s
5. Cache results: `chrome.storage.session`

**Acceptance Criteria**:
- [ ] Navigating to suspicious URL triggers API call
- [ ] Same URL: cached for 60s (no redundant calls)
- [ ] Auth token included in request
- [ ] Network errors handled gracefully

**Definition of Done**: Extension sends API request on navigation, result cached.

---

#### TASK-06.2.2: Build Extension Popup UI

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-06.2.1 |

**Steps**:
1. `apps/extension/src/popup/App.tsx`
2. Width: 380px, design matching main app
3. States: Loading / Safe / Threat / Unauthenticated
4. Safe state: green status, "Trang này an toàn"
5. Threat state: red header, risk score, red flags, [Block] button
6. "Xem chi tiết" → open web app with scanId

**Acceptance Criteria**:
- [ ] Popup opens in < 200ms
- [ ] Matches design system (colors, fonts, tokens)
- [ ] All states render correctly
- [ ] "Block" button sends block message to content script

**Definition of Done**: Popup shows correct state for safe and threat URLs.

---

#### TASK-06.2.3: Implement URL blocking (content script)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-06.2.2 |

**Steps**:
1. On threat detected with auto-block ON:
   - Content script replaces body with block page
2. Block page: red background, "Mối đe dọa bị chặn" message
3. Block page: [View Details] + [I understand, proceed anyway] buttons
4. Log blocked URL to Firestore

**Acceptance Criteria**:
- [ ] Page replaced within 300ms of threat detection
- [ ] Block page uses design system (dark theme)
- [ ] "Proceed anyway" logs override action
- [ ] auto-block=false: no automatic blocking (warning popup only)

**Definition of Done**: Auto-block replaces page content. Bypass option functional.

---

### STORY-06.3: Extension Auth Integration

**Priority**: 🟡 P1 | **Estimate**: 3h total

---

#### TASK-06.3.1: Firebase Auth trong Extension

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-03.1.1 |

**Steps**:
1. Firebase Auth không hoạt động trực tiếp trong Extension Service Worker
2. Strategy: dùng `chrome.identity.launchWebAuthFlow` hoặc open web app
3. Store token trong `chrome.storage.local`
4. Refresh token khi expired

**Acceptance Criteria**:
- [ ] Extension shows "Sign In" khi unauthenticated
- [ ] Login flow: opens web app → auth → token stored in extension
- [ ] Token refresh works automatically

**Definition of Done**: Extension auth flow works end-to-end.

---

#### TASK-06.3.2: Build Extension Onboarding popup

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1h |
| **Dependency** | TASK-06.3.1 |

**Steps**:
1. First install: open onboarding page in new tab
2. 3-step mini tour: "Extension installed" → "Sign in" → "You're protected"
3. After login: auto-close tab, extension active

**Acceptance Criteria**:
- [ ] Onboarding opens on first install (chrome.runtime.onInstalled)
- [ ] Sign-in button opens auth flow
- [ ] Protection status updates after login

**Definition of Done**: Onboarding tab opens on install, closes after auth.

---

## EPIC-07: Training Mode & Dashboard

> **Goal**: Training drills (F-05) và Immunity Dashboard (F-06).
> **Priority**: 🟡 P1 | **Dependency**: EPIC-03, EPIC-04

---

### STORY-07.1: Training API

**Priority**: 🟡 P1 | **Estimate**: 5h total

---

#### TASK-07.1.1: Build Trainer Agent

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2.5h |
| **Dependency** | TASK-04.1.2 |

**Steps**:
1. Tạo `apps/api/src/agents/trainer.agent.ts`
2. Input: `{ user_trust_score, preferred_scenario_type }`
3. Difficulty: trust_score < 40 → easy; 40-70 → medium; > 70 → hard
4. Call Gemini Pro với Train Prompt từ DesignFreeze 5.5
5. Validate output: `{ scenario_type, scenario_content, questions[3] }`
6. Brand name check: reject if contains real brand names

**Acceptance Criteria**:
- [ ] Each question has 4 options and 1 correct_index
- [ ] Difficulty adjusts based on trust_score
- [ ] P95 generation < 8s
- [ ] No real brand names in scenario_content

**Definition of Done**: Trainer Agent unit test: easy/medium/hard difficulty cases.

---

#### TASK-07.1.2: POST /training/sessions endpoint

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-07.1.1 |

**Steps**:
1. `POST /v1/training/sessions`
2. Fetch user trust_score from Firestore
3. Call TrainerAgent
4. Save session to Firestore `training_sessions`
5. Rate limit: 10 sessions/day/user

**Acceptance Criteria**:
- [ ] sessionId returned
- [ ] Session saved in Firestore với status pending
- [ ] Rate limit: 11th session → 429
- [ ] Questions returned WITHOUT correct_index (hidden until submit)

**Definition of Done**: POST /training/sessions returns session with questions.

---

#### TASK-07.1.3: POST /training/sessions/:id/submit endpoint

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-07.1.2 |

**Steps**:
1. `POST /v1/training/sessions/:id/submit`
2. Accept: `{ answers: [0, 2, 1] }` (indices)
3. Compare with correct_index → calculate score
4. Update `training_sessions` với score, completed_at, user_answers
5. Update user trust_score: `trust_score = (old + score) / 2`
6. Award badges based on score thresholds

**Acceptance Criteria**:
- [ ] Score: 100 if all correct, proportional otherwise
- [ ] Cannot submit twice (400 if already completed)
- [ ] trust_score updated in Firestore
- [ ] Badge awarded: score 80+ → "Antibody Level 1"
- [ ] Response includes correct answers + explanations

**Definition of Done**: Submit endpoint calculates score, updates user, returns result.

---

### STORY-07.2: Training UI

**Priority**: 🟡 P1 | **Estimate**: 6h total

---

#### TASK-07.2.1: Build Training Center page

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 1.5h |
| **Dependency** | TASK-07.1.2 |

**Steps**:
1. `apps/web/src/app/training/page.tsx`
2. "Start Drill" button (prominent)
3. Stats: sessions completed, current trust score
4. Badge gallery (earned badges)
5. Recent sessions list

**Acceptance Criteria**:
- [ ] Start Drill → calls POST /training/sessions
- [ ] Loading state during generation
- [ ] Empty state if no sessions

**Definition of Done**: Training center page renders with stats.

---

#### TASK-07.2.2: Build Drill Session UI (quiz interface)

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2.5h |
| **Dependency** | TASK-07.2.1 |

**Steps**:
1. Scenario display: styled as email/SMS/website mock
2. Question cards: 4 options, radio-select style
3. Progress: "Question 2/3" progress bar
4. Submit: disabled until all 3 questions answered
5. Timer: optional (30s per question on hard mode)

**Acceptance Criteria**:
- [ ] Scenario displayed in appropriate style (email = email template)
- [ ] Cannot proceed without answering
- [ ] Submit → calls POST /training/sessions/:id/submit

**Definition of Done**: Full quiz flow: render → answer → submit → result.

---

#### TASK-07.2.3: Build Result + Badge Award animation

| Field | Value |
|---|---|
| **Priority** | 🟡 P1 |
| **Estimate** | 2h |
| **Dependency** | TASK-07.2.2 |

**Steps**:
1. Score display: large number animation (count up)
2. Correct/wrong answer reveal (green/red per question)
3. Badge award: if earned → particle burst + badge reveal
4. Immunity Score update animation: ring animates to new value
5. CTA: "Next Drill" or "Back to Dashboard"

**Acceptance Criteria**:
- [ ] Score counts up from 0 to final value (1s animation)
- [ ] Badge appears with particle effect if earned
- [ ] Correct answers highlighted green
- [ ] Wrong answers show correct answer in blue

**Definition of Done**: Result screen renders, badge animation plays if earned.

---

### STORY-07.3: Immunity Dashboard

**Priority**: 🔴 P0 | **Estimate**: 5h total

---

#### TASK-07.3.1: GET /metrics/summary endpoint

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.2.2 |

**Steps**:
1. `GET /v1/metrics/summary`
2. Query scan_results last 30 days for this user
3. Aggregate: total_scans, threats_blocked, safe_scans, top_threat_type
4. Return summary object

**Acceptance Criteria**:
- [ ] Returns correct counts from last 30 days
- [ ] Empty data: all counts = 0 (not error)
- [ ] Response < 500ms (from Firestore with index)

**Definition of Done**: GET /metrics/summary returns correct aggregated data.

---

#### TASK-07.3.2: Build Dashboard main page

| Field | Value |
|---|---|
| **Priority** | 🔴 P0 |
| **Estimate** | 3h |
| **Dependency** | TASK-07.3.1, TASK-02.2.4 |

**Steps**:
1. `apps/web/src/app/dashboard/page.tsx`
2. Top section: ImmunityRing (trust_score), user greeting
3. Stats row: 4 metric cards (Scanned, Blocked, Safe, Training sessions)
4. Quick scan input (ScanInput component)
5. Recent threats list (last 5 scan_results with threat)
6. Mode cards: 5 AI modes as quick-action buttons

**Acceptance Criteria**:
- [ ] ImmunityRing shows current trust_score
- [ ] Metrics fetched from GET /metrics/summary
- [ ] Recent threats clickable → navigate to scan detail
- [ ] Quick scan input functional
- [ ] HUD overlay visible (green pulse)

**Definition of Done**: Dashboard loads with real data, all elements interactive.

---

### STORY-07.4: Scan History

**Priority**: 🟢 P2 | **Estimate**: 3h total

---

#### TASK-07.4.1: Build History page

| Field | Value |
|---|---|
| **Priority** | 🟢 P2 |
| **Estimate** | 2h |
| **Dependency** | TASK-04.2.3 |

**Steps**:
1. `apps/web/src/app/history/page.tsx`
2. Paginated list (20 per page)
3. Each row: timestamp, truncated content, classification badge, risk score
4. Filter: All / Threats / Safe
5. Click row → navigate to scan detail page

**Acceptance Criteria**:
- [ ] Pagination works (previous/next)
- [ ] Filter switches correctly
- [ ] Empty state shows "Chưa có lịch sử quét"

**Definition of Done**: History page shows paginated scan history.

---

#### TASK-07.4.2: Build Scan Detail page

| Field | Value |
|---|---|
| **Priority** | 🟢 P2 |
| **Estimate** | 1h |
| **Dependency** | TASK-04.2.3 |

**Steps**:
1. `apps/web/src/app/scan/[scanId]/page.tsx`
2. Full details: risk score, classification, red flags, timestamp
3. CTA buttons: Simulate, Explain (if threat)
4. Share button: copy shareable link

**Acceptance Criteria**:
- [ ] All scan data visible
- [ ] Simulate/Explain CTAs functional
- [ ] 404 for invalid scanId

**Definition of Done**: Scan detail page renders full scan data.

---

## 📊 Summary Statistics

| Metric | Count |
|---|---|
| Total Epics | 7 |
| Total Stories | 28 |
| Total Tasks | 116 |
| P0 Tasks | 71 |
| P1 Tasks | 35 |
| P2 Tasks | 10 |
| Total Estimated Hours | ~196h |
| MVP Scope (P0 only) | ~126h |

---

## 🗓️ Suggested Sprint Plan (2-week sprints)

| Sprint | Epics | Focus | Deliverable |
|---|---|---|---|
| **Sprint 1** | EPIC-01, EPIC-02 | Foundation + Design System | Monorepo running, all components built |
| **Sprint 2** | EPIC-03, EPIC-04.1-04.3 | Auth + AI Engine | Login works, Detect API live |
| **Sprint 3** | EPIC-04.4-04.5, EPIC-05 | Scan UI + Simulation | Full detect + simulate flow works |
| **Sprint 4** | EPIC-06 | Chrome Extension | Extension detects threats |
| **Sprint 5** | EPIC-07 | Training + Dashboard | Full product demo-ready |
| **Sprint 6** | All | Polish + QA + Demo prep | Competition-ready build |

---

## 🔗 Tài liệu liên quan

- [DesignFreeze.md](../DesignFreeze.md)
- [FeatureList.md](../01_Product/FeatureList.md)
- [MVP.md](../01_Product/MVP.md)
- [APIReference.md](../14_API/APIReference.md)
- [DatabaseSchema.md](../11_Database/DatabaseSchema.md)
- [AgentArchitecture.md](../10_Agent/AgentArchitecture.md)
