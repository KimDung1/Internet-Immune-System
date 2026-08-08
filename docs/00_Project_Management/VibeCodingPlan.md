# ⚡ VIBE CODING PLAN — Internet Immune System
### Version: 1.0.0 | Target AI Tools: Claude Code, Gemini CLI, Cursor AI
### Project: Internet Immune System | Repository: [KimDung1/Internet-Immune-System](https://github.com/KimDung1/Internet-Immune-System)
### Compliance: DesignFreeze.md • Rule Engine • Multi-Agent Architecture

> **Vibe Coding Philosophy**: 
> "Cung cấp prompt siêu chính xác, có ngữ cảnh hoàn chỉnh từ Project Bible & Rules, ép AI tạo code production-ready ngay từ lần thử đầu tiên — 0 guess, 0 placeholder, 100% testable."

---

## 🎯 Vibe Coding Matrix & AI Tool Assignment Strategy

| Tool | Strengths / Best For | Target Use Case in IIS |
|---|---|---|
| 🤖 **Claude Code** | Deep terminal agent execution, multi-file refactoring, strict typecheck loops | Monorepo setup, Multi-Agent Orchestrator, Complex backend services |
| ♊ **Gemini CLI** | Fast single-file generation, AI prompt engineering, API schema alignment | Gemini SDK service, Schema Zod definitions, OpenAPI converters |
| ⚡ **Cursor AI** | Inline IDE editing, visual UI components, Framer Motion animations | React components, Tailwind styling, Page Layouts, Chrome Extension UI |

---

---

## 🏗️ CORE TASK 1: TASK-01.1.1 — Bootstrap Turborepo Monorepo Architecture

- **Track**: Infrastructure & Monorepo Setup
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: None

### 🤖 Prompt cho Claude Code (Terminal Execution Agent)

#### 1. Input
- Structure Spec: [`docs/08_System_Architecture/FolderStructure.md`](file:///e:/PJ/docs/08_System_Architecture/FolderStructure.md)
- Rules: [`rules/coding.rules`](file:///e:/PJ/rules/coding.rules), [`rules/frontend.rules`](file:///e:/PJ/rules/frontend.rules)
- Root Workspace Path: `e:/PJ`

#### 2. Output
- `package.json` (Root pnpm workspace)
- `pnpm-workspace.yaml` (packages: `apps/*`, `packages/*`)
- `turbo.json` (Pipeline config: build, dev, test, lint, typecheck)
- Scaffold folders: `apps/web` (Next.js 14), `apps/api` (Hono.js), `apps/extension` (Vite CRX), `packages/ui`, `packages/core`

#### 3. Validation
- `pnpm install` succeeds without lockfile conflicts
- `pnpm turbo run check-types` runs across all packages without errors
- `pnpm lint` verifies workspace package boundaries

#### 4. Test
```bash
pnpm run build
pnpm run check-types
# Assertion: Exit code 0, 5 packages/apps recognized in Turborepo DAG
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Root path: `e:/PJ`
- Node version: `20.x LTS`
- Package Manager: `pnpm@9.x`

#### 2. Output
- Generated `turbo.json` containing pipeline configurations for dev, build, lint, and test.

#### 3. Validation
- JSON syntax validation against Turborepo 2.x JSON schema.

#### 4. Test
```bash
npx turbo validate
```

---

### ⚡ Prompt cho Cursor (IDE Composer Prompt)

#### 1. Input
- File focus: `package.json`, `pnpm-workspace.yaml`
- Rule context: `@rules/coding.rules`

#### 2. Output
- Root monorepo configuration files with scripts for `pnpm dev`, `pnpm build`, `pnpm test`.

#### 3. Validation
- Workspace reference resolution (`workspace:*`).

#### 4. Test
- Run `pnpm dev` in Cursor terminal and ensure web, api, and extension start concurrently.

---

---

## 🔐 CORE TASK 2: TASK-01.2.2 — Deploy Firestore Security Rules & Indexes

- **Track**: Firebase Database Infrastructure
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-01.2.1

### 🤖 Prompt cho Claude Code

#### 1. Input
- Specification: [`docs/11_Database/FirestoreDesign.md`](file:///e:/PJ/docs/11_Database/FirestoreDesign.md)
- Security Rules: [`rules/firebase.rules`](file:///e:/PJ/rules/firebase.rules)
- Index Spec: 12 Composite Indexes from `firestore.indexes.json`

#### 2. Output
- Root `firestore.rules` containing helper functions (`isOwner`, `inRange`, `immutableField`) and 7 collection rules
- Root `firestore.indexes.json` containing composite index definitions for `scan_results`, `training_sessions`, `threat_intelligence`, `fraud_reports`, `notifications`

#### 3. Validation
- Firebase CLI syntax check: `firebase deploy --only firestore:rules --dry-run`
- Validate default-deny rule at bottom of matcher block

#### 4. Test
```bash
# Run Firebase Emulator Security Rules Test
pnpm --filter @iis/api test:rules
# Assertion: User A cannot read User B scan_results (403 forbidden)
# Assertion: Public unauthenticated read on threat_intelligence succeeds (200 OK)
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Rule source: `rules/firebase.rules`
- Target: `firestore.indexes.json`

#### 2. Output
- Complete, syntactically valid `firestore.indexes.json` file for Google Cloud Firestore.

#### 3. Validation
- Validate JSON structure against Firebase CLI index schema.

#### 4. Test
```bash
npx firebase-tools deploy --only firestore:indexes --dry-run
```

---

### ⚡ Prompt cho Cursor

#### 1. Input
- Open file: `firestore.rules`
- Context: `@rules/firebase.rules`, `@docs/11_Database/FirestoreDesign.md`

#### 2. Output
- Fully typed Firestore Security Rules with anti-cheat trust score increment caps.

#### 3. Validation
- Ensure no wildcard `allow write: if true;` exists anywhere in the rule set.

#### 4. Test
- Inspect rule diff in Cursor Git tab before committing.

---

---

## ⚙️ CORE TASK 3: TASK-01.3.1 — Cloud Run Hono.js API Infrastructure Initialization

- **Track**: Backend Core Services
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-01.1.1

### 🤖 Prompt cho Claude Code

#### 1. Input
- API Architecture: [`docs/12_Backend/BackendArchitecture.md`](file:///e:/PJ/docs/12_Backend/BackendArchitecture.md)
- API Reference: [`docs/14_API/APIReference.md`](file:///e:/PJ/docs/14_API/APIReference.md)
- Rules: [`rules/backend.rules`](file:///e:/PJ/rules/backend.rules), [`rules/api.rules`](file:///e:/PJ/rules/api.rules)
- Working Directory: `apps/api`

#### 2. Output
- `apps/api/src/index.ts` (Hono app instance)
- `apps/api/src/middleware/cors.ts` (CORS whitelist: extension://* + *.immune-system.vn)
- `apps/api/src/middleware/request-id.ts` (X-Request-ID generator)
- `apps/api/src/middleware/response-envelope.ts` (Standard response wrapper)
- `apps/api/src/middleware/error-handler.ts` (Global AppError to standard envelope mapper)
- `apps/api/src/routes/health.ts` (GET /v1/health endpoint)

#### 3. Validation
- `pnpm --filter @iis/api build` compiles clean TypeScript without `any` types
- `GET /v1/health` returns `200 OK` with envelope structure `{ status: "success", data: { status: "healthy", timestamp: "..." }, meta: { requestId, ... } }`

#### 4. Test
```bash
curl -i http://localhost:8080/v1/health
# Assertion: Response status 200, header X-Request-ID present, JSON matching Standard Envelope
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- API Spec: `docs/14_API/APIReference.md` §3.2 (Standard Response Envelope)

#### 2. Output
- Hono.js middleware `responseEnvelopeMiddleware` enforcing standard `{ status, data, error, meta }` wrapper on all responses.

#### 3. Validation
- Ensure TypeScript types match `@iis/core` response types.

#### 4. Test
```bash
pnpm --filter @iis/api test:unit --grep "response-envelope"
```

---

### ⚡ Prompt cho Cursor

#### 1. Input
- File: `apps/api/src/index.ts`
- Context: `@rules/backend.rules`, `@rules/api.rules`

#### 2. Output
- Express/Hono router bootstrap with CORS, Request ID, and Global Error Handling middleware attached.

#### 3. Validation
- Zero `console.log` statements in production middleware (must use Cloud Logger).

#### 4. Test
- Trigger test request in Cursor REST client or Postman.

---

---

## 🎨 CORE TASK 4: TASK-02.1.2 — Implement Design System Tokens & Global Styles

- **Track**: Design System & Styling
- **Estimate**: 1.5h | **Priority**: 🔴 P0
- **Dependencies**: TASK-02.1.1

### 🤖 Prompt cho Claude Code

#### 1. Input
- Design Tokens Spec: [`docs/06_Design_System/DesignTokens.md`](file:///e:/PJ/docs/06_Design_System/DesignTokens.md)
- Component Library Spec: [`docs/06_Design_System/ComponentLibrary.md`](file:///e:/PJ/docs/06_Design_System/ComponentLibrary.md)
- Rules: [`rules/design.rules`](file:///e:/PJ/rules/design.rules), [`rules/frontend.rules`](file:///e:/PJ/rules/frontend.rules)
- Target: `packages/ui` and `apps/web/src/app/globals.css`

#### 2. Output
- `packages/ui/tailwind.config.ts` (Custom color tokens: `immune-teal`, `cyan-pulse`, `slate-dark`, `crimson-threat`, glassmorphism utility classes)
- `apps/web/src/app/globals.css` (CSS variables `--iis-*`, dark mode base defaults, scrollbar styling, glow utilities)

#### 3. Validation
- Tailwind CSS build compiles cleanly with custom tokens available as utility classes (`bg-immune-teal`, `border-cyan-pulse/20`, `glass-card`)

#### 4. Test
```bash
pnpm --filter web build
# Assertion: No CSS syntax errors, Tailwind utility classes resolved correctly
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Tokens: `docs/06_Design_System/DesignTokens.md`

#### 2. Output
- Complete Tailwind CSS `theme.extend` configuration mapping hex colors to token names.

#### 3. Validation
- Ensure color names exactly match Design Tokens spec.

#### 4. Test
- Run Tailwind CLI parser test.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- Open: `apps/web/src/app/globals.css`
- Context: `@rules/design.rules`

#### 2. Output
- Glassmorphism backdrop filter classes, cybernetic glow Keyframes, and custom dark mode body styles.

#### 3. Validation
- Verify contrast ratios for dark theme text exceed 4.5:1.

#### 4. Test
- Inspect visual render in browser devtools.

---

---

## 🔮 CORE TASK 5: TASK-02.2.4 — Build AI Orb Component (Cybernetic Shield Visual)

- **Track**: Design System / Animated Components
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-02.1.4

### 🤖 Prompt cho Claude Code

#### 1. Input
- Component Spec: [`docs/06_Design_System/ComponentLibrary.md`](file:///e:/PJ/docs/06_Design_System/ComponentLibrary.md) (Component 01: AI Orb)
- Rules: [`rules/animation.rules`](file:///e:/PJ/rules/animation.rules), [`rules/design.rules`](file:///e:/PJ/rules/design.rules)
- Target: `packages/ui/src/components/AIOrb.tsx`

#### 2. Output
- `AIOrb.tsx` component supporting 4 states (`idle`, `scanning`, `threat`, `protected`)
- SVG animated ring pulsing immunity score
- Framer Motion `useReducedMotion` hook for WCAG 2.1 AA accessibility

#### 3. Validation
- Component renders in all 4 states without DOM warnings or missing prop errors
- Only GPU-accelerated properties (`transform`, `opacity`) are animated

#### 4. Test
```bash
pnpm --filter @iis/ui test AIOrb
# Assertion: Component mounts, state changes update ring color, reduced-motion disables rotation
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Spec: Component 01 AI Orb from `docs/06_Design_System/ComponentLibrary.md`

#### 2. Output
- TypeScript Interface `AIOrbProps` with strict typed states: `'idle' | 'scanning' | 'threat' | 'protected'`.

#### 3. Validation
- Props match TS strict mode rules (`no-explicit-any`).

#### 4. Test
- Run `tsc --noEmit` on component.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- Target: `packages/ui/src/components/AIOrb.tsx`
- Context: `@rules/animation.rules`, `@rules/design.rules`

#### 2. Output
- Framer Motion continuous pulse variant with SVG stroke-dashoffset animation.

#### 3. Validation
- Animation respects `prefers-reduced-motion` media query.

#### 4. Test
- Hover over AI Orb in Storybook/dev preview to verify smooth 60fps interaction.

---

---

## 🔐 CORE TASK 6: TASK-03.1.4 — Implement Authentication Verification API Endpoint

- **Track**: Auth & Backend Gateway
- **Estimate**: 1.5h | **Priority**: 🔴 P0
- **Dependencies**: TASK-01.2.3, TASK-01.3.1

### 🤖 Prompt cho Claude Code

#### 1. Input
- API Spec: `docs/14_API/APIReference.md` (`POST /auth/verify`)
- Database Spec: `docs/11_Database/FirestoreDesign.md` (`users` collection)
- Rules: [`rules/security.rules`](file:///e:/PJ/rules/security.rules), [`rules/backend.rules`](file:///e:/PJ/rules/backend.rules)
- Target: `apps/api/src/routes/auth.ts`

#### 2. Output
- `POST /v1/auth/verify` endpoint
- Firebase Admin SDK JWT token verification middleware (`authMiddleware`)
- User upsert logic in Firestore `users/{uid}` collection
- Returns `UserProfile` payload wrapped in `StandardEnvelope`

#### 3. Validation
- Requests missing Bearer token return `401 UNAUTHORIZED`
- Valid token creates/updates `users/{uid}` document with default `trust_score: 50`

#### 4. Test
```bash
curl -X POST http://localhost:8080/v1/auth/verify \
  -H "Authorization: Bearer <MOCK_FIREBASE_TOKEN>" \
  -H "Content-Type: application/json"
# Assertion: Response 200 OK with UserProfile data or 401 for invalid token
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- API Spec: `POST /auth/verify` in `docs/14_API/APIReference.md`

#### 2. Output
- Zod schema definition for UserProfile response validation.

#### 3. Validation
- Ensure schema fields match Firestore `users` collection types.

#### 4. Test
- Run Zod parse test on sample UserProfile payload.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- File: `apps/api/src/routes/auth.ts`
- Context: `@rules/security.rules`, `@rules/api.rules`

#### 2. Output
- Auth route handler with Firebase `verifyIdToken()` call and error boundary mapping.

#### 3. Validation
- Token extraction handles both `Bearer <token>` and missing headers safely.

#### 4. Test
- Send request from Cursor REST client with valid and invalid tokens.

---

---

## 🤖 CORE TASK 7: TASK-04.1.2 — Gemini AI Service Integration with Multi-Agent Orchestrator

- **Track**: AI Engine & Multi-Agent Architecture
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-04.1.1

### 🤖 Prompt cho Claude Code

#### 1. Input
- Multi-Agent Spec: [`docs/10_Agent/AgentArchitecture.md`](file:///e:/PJ/docs/10_Agent/AgentArchitecture.md)
- Prompt Specs: [`docs/09_AI/prompts/detect.md`](file:///e:/PJ/docs/09_AI/prompts/detect.md)
- Rules: [`rules/prompt.rules`](file:///e:/PJ/rules/prompt.rules), [`rules/agent.rules`](file:///e:/PJ/rules/agent.rules)
- Target: `packages/agents/src/services/gemini.service.ts`

#### 2. Output
- `GeminiService` class using official `@google/genai` SDK
- Model routing logic: `gemini-2.5-flash` for detect/protect, `gemini-2.5-pro` for simulate/explain/train
- Structured JSON output enforcement using `responseSchema`
- Exponential backoff retry policy (3 attempts for Flash, 2 for Pro)
- Safety settings: `BLOCK_MEDIUM_AND_ABOVE`

#### 3. Validation
- All Gemini API calls use `responseMimeType: "application/json"`
- Fallback object returned on timeout or safety block without throwing unhandled exceptions

#### 4. Test
```bash
pnpm --filter @iis/agents test gemini.service
# Assertion: Mocked Gemini API call returns parsed JSON matching responseSchema
# Assertion: Simulated timeout triggers retry and returns fallback object
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Spec: `docs/09_AI/prompts/detect.md`

#### 2. Output
- Gemini SDK configuration object with `responseSchema` for Threat Detection Agent.

#### 3. Validation
- Schema matches `detectResponseSchema` parameters strictly.

#### 4. Test
- Execute test prompt script against Gemini Flash model.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- File: `packages/agents/src/services/gemini.service.ts`
- Context: `@rules/prompt.rules`, `@rules/agent.rules`

#### 2. Output
- Helper methods `generateContentWithRetry()` and `applySafetyGuardrails()`.

#### 3. Validation
- System prompt prepended to all model calls.

#### 4. Test
- Run unit test suite in Cursor terminal.

---

---

## 🎯 CORE TASK 8: TASK-04.2.2 — Core Threat Scan Endpoint (`POST /scans/analyze`)

- **Track**: AI Threat Analysis Engine
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-04.2.1, TASK-04.1.2

### 🤖 Prompt cho Claude Code

#### 1. Input
- API Spec: `docs/14_API/APIReference.md` (`POST /scans/analyze`)
- Agent Spec: `docs/10_Agent/AgentArchitecture.md` (ThreatDetectionAgent + Coordinator)
- Prompt Spec: `docs/09_AI/prompts/detect.md`
- Rules: [`rules/api.rules`](file:///e:/PJ/rules/api.rules), [`rules/agent.rules`](file:///e:/PJ/rules/agent.rules), [`rules/security.rules`](file:///e:/PJ/rules/security.rules)
- Target: `apps/api/src/routes/scans.ts`

#### 2. Output
- `POST /v1/scans/analyze` endpoint
- 3-tier lookup execution: (1) In-memory hash cache → (2) Threat Intelligence Firestore blacklist lookup → (3) ThreatDetectionAgent (Gemini 2.5 Flash)
- PII scrubbing on input content before AI call
- Automatic simulation trigger if `risk_score >= 70`
- Result saved to `scan_results` Firestore collection

#### 3. Validation
- Latency P50 < 1.5s (TI hit < 50ms)
- Input length > 4000 chars returns `413 CONTENT_TOO_LONG`
- Rate limit 30 req/min/user enforced

#### 4. Test
```bash
curl -X POST http://localhost:8080/v1/scans/analyze \
  -H "Authorization: Bearer <VALID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"contentType": "url", "contentData": "http://vietcombank-secure-login.ph/login"}'
# Assertion: Status 200 OK, riskScore >= 70, classification == "phishing", actionRecommendation == "BLOCK"
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- API Spec: `POST /scans/analyze` in `docs/14_API/APIReference.md`

#### 2. Output
- Zod validation schema for `ScansAnalyzeRequestBody` (contentType, contentData, context).

#### 3. Validation
- Schema rejects invalid contentType or empty contentData.

#### 4. Test
- Run Zod validation test against sample request bodies.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- File: `apps/api/src/routes/scans.ts`
- Context: `@rules/api.rules`, `@rules/agent.rules`

#### 2. Output
- Route handler orchestrating Threat Intel cache check, PII sanitizer, Gemini call, and Firestore write.

#### 3. Validation
- Ensure Firestore write is wrapped in try/catch and non-blocking for response latency.

#### 4. Test
- Execute test scan request in Cursor REST client.

---

---

## 🎭 CORE TASK 9: TASK-05.1.1 — Consequence Simulation Engine (`POST /scans/:id/simulate`)

- **Track**: AI Theater Mode Engine
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-04.2.2

### 🤖 Prompt cho Claude Code

#### 1. Input
- API Spec: `docs/14_API/APIReference.md` (`POST /scans/:scanId/simulate`)
- Prompt Spec: [`docs/09_AI/prompts/simulate.md`](file:///e:/PJ/docs/09_AI/prompts/simulate.md)
- Rules: [`rules/prompt.rules`](file:///e:/PJ/rules/prompt.rules), [`rules/agent.rules`](file:///e:/PJ/rules/agent.rules)
- Target: `apps/api/src/routes/simulations.ts`

#### 2. Output
- `POST /v1/scans/:scanId/simulate` endpoint
- SimulationAgent invocation (Gemini 2.5 Pro)
- 3-step consequence timeline generation (`T+0:00`, `T+seconds`, `T+minutes`)
- Potential financial loss calculation in VNĐ format
- Idempotency check: if simulation already exists for `scanId`, return existing doc
- Write result to `simulations` Firestore collection and update `scan_results.simulation_id`

#### 3. Validation
- Returns `400 INVALID_INPUT` if called on a `safe` classification scan
- Output `steps` array contains exactly 3 items
- `potential_loss` includes "VND" suffix

#### 4. Test
```bash
curl -X POST http://localhost:8080/v1/scans/sr_9f3a2b1c/simulate \
  -H "Authorization: Bearer <VALID_TOKEN>"
# Assertion: Response 200 OK, steps.length == 3, potentialLoss matches VND format, closingMessage is hopeful
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Prompt Spec: `docs/09_AI/prompts/simulate.md` (Mode A)

#### 2. Output
- Gemini 2.5 Pro simulation prompt builder function injecting scan classification, risk score, and red flags.

#### 3. Validation
- Ensure prompt explicitly prohibits real personal names.

#### 4. Test
- Execute simulation prompt test via Gemini CLI.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- Target: `apps/api/src/routes/simulations.ts`
- Context: `@rules/prompt.rules`, `@rules/agent.rules`

#### 2. Output
- Route handler with idempotency lookup and Gemini Pro invocation.

#### 3. Validation
- Verify simulation document ID is saved back to `scan_results` document.

#### 4. Test
- Test simulation endpoint call via Cursor REST client.

---

---

## 🛡️ CORE TASK 10: TASK-06.1.1 — Chrome Browser Extension Security Shield (Manifest V3)

- **Track**: Real-Time Extension Shield
- **Estimate**: 2h | **Priority**: 🔴 P0
- **Dependencies**: TASK-04.2.2

### 🤖 Prompt cho Claude Code

#### 1. Input
- Extension Spec: `docs/13_Frontend/BrowserExtension.md`
- Rules: [`rules/security.rules`](file:///e:/PJ/rules/security.rules), [`rules/frontend.rules`](file:///e:/PJ/rules/frontend.rules)
- Target: `apps/extension`

#### 2. Output
- `manifest.json` (Manifest V3, permissions: `storage`, `declarativeNetRequest`, `activeTab`)
- `src/background/service-worker.ts` (Listens to tab updates, sends URL to `POST /scans/analyze`)
- `src/content/dom-shield.ts` (Injects Threat Overlay Banner when `actionRecommendation === "BLOCK"`)
- `src/popup/App.tsx` (Extension popup UI showing AI Orb immunity score & toggle)

#### 3. Validation
- `pnpm --filter extension build` generates valid MV3 extension bundle in `dist/`
- Extension background service worker registers without CSP violations

#### 4. Test
```bash
pnpm --filter extension build
# Assertion: Manifest V3 validation passes, no inline scripts or unsafe eval in dist/
```

---

### ♊ Prompt cho Gemini CLI

#### 1. Input
- Spec: `apps/extension/manifest.json` (Manifest V3)

#### 2. Output
- Strict Manifest V3 JSON file with explicit Content Security Policy (`script-src 'self'; object-src 'none';`).

#### 3. Validation
- CSP compliant with Chrome Web Store submission policies.

#### 4. Test
- Validate manifest using Chrome extension CLI validator.

---

### ⚡ Prompt cho Cursor

#### 1. Input
- Open: `apps/extension/src/content/dom-shield.ts`
- Context: `@rules/security.rules`, `@rules/design.rules`

#### 2. Output
- DOM Shield injection script creating a Shadow DOM container (isolated styles) for the Red Alert threat overlay banner.

#### 3. Validation
- Shadow DOM prevents host page CSS from distorting the Immune System threat alert overlay.

#### 4. Test
- Test DOM injection on a mock phishing page in browser preview.

---

---

## 📊 Summary of Execution Workflow

```
               VIBE CODING EXECUTION PIPELINE
               
   Task Selected from Sprint Plan (P0 Priority)
                         │
                         ▼
        Read Task Prompt Specs from VibeCodingPlan.md
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   🤖 Claude Code    ♊ Gemini CLI   ⚡ Cursor AI
   (Infrastructure  (API Schemas,   (UI Components,
    & Orchestrator)  Prompt SDKs)    DOM Overlay)
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
             Run Automated Verification
        (pnpm check-types && pnpm test && curl)
                         │
                         ▼
               Task Done & Verified!
```

---

## 🔗 Related Documents

| Document | Link |
|---|---|
| Sprint Plan | [SprintPlan.md](file:///e:/PJ/docs/00_Project_Management/SprintPlan.md) |
| Product Backlog | [ProductBacklog.md](file:///e:/PJ/docs/00_Project_Management/ProductBacklog.md) |
| Design Freeze | [DesignFreeze.md](file:///e:/PJ/docs/DesignFreeze.md) |
| Rule Engine | [Rule Engine Folder](file:///e:/PJ/rules/) |
| Multi-Agent Design | [AgentArchitecture.md](file:///e:/PJ/docs/10_Agent/AgentArchitecture.md) |
| Prompt Library | [Prompt Library Folder](file:///e:/PJ/docs/09_AI/prompts/) |
