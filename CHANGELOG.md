# CHANGELOG — Internet Immune System

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-08-03 (Digital Vaccine Network Release)

### Added - Sprint 6 ("Vaccination & Global Vaccine Network") - Complete Sprint 6 Deliverables
- **Memory & Vaccine Engine (`@iis/agents` & `apps/api`)**:
  - `memory.agent.ts` (TASK-11.1.1): `MemoryAgent` managing Antibody Protection Levels (1–10), Trust Score calculation, and Digital Vaccine Immunization hash generation.
  - `POST /v1/vaccine/immunize` & `GET /v1/vaccine/antibodies` (TASK-11.1.2): API endpoints persisting digital vaccine signatures to Firestore `vaccines`.
  - `VaccinationPage` (`/vaccination`, TASK-11.1.3): Digital Vaccine Passport & 1-Click Immunization UI for instant threat protection updates.

## [1.0.0] - 2026-08-03 (AI Riser Vietnam Production Release)

### Added - Sprint 5 ("Dashboard & Demo Prep") - Complete Sprint 5 Deliverables
- **User Analytics & Settings API (`apps/api`)**:
  - `GET /v1/users/me` (TASK-09.1.1): User profile fetch with antibody level & trust score.
  - `PATCH /v1/users/me/settings` (TASK-09.1.1): User settings update (auto-block, AI sensitivity level).
  - `GET /v1/users/me/history` (TASK-09.1.1): Complete scan history query from Firestore.
- **Web App User Pages (`apps/web`)**:
  - `DashboardPage` (`/dashboard`, TASK-09.1.2): User Analytics Dashboard with live `AIOrb` shield, trust score ring, statistics cards, and recent scan logs.
  - `HistoryPage` (`/history`, TASK-09.1.3): History Timeline page with classification filters (All, Threat, Safe).
  - `ProfilePage` (`/profile`, TASK-09.1.4): Profile & Settings management with AI auto-block toggle & sensitivity controls.
- **Project Certification (TASK-10.1.1 & 10.1.2)**: 100% verified production build across all 8 workspace projects. Ready for AI Riser Vietnam competition demo day!

### Added - Sprint 4 ("Extension Protect & Training Mode") - Complete Sprint 4 Deliverables
- **Training Engine (`@iis/agents` & `apps/api`)**:
  - `training.agent.ts` (TASK-07.1.1): `TrainingAgent` using Gemini 2.5 Pro generating adaptive 3-question anti-fraud drills with randomized Vietnam scam scenarios.
  - `POST /v1/training/sessions` & `POST /v1/training/sessions/:id/submit` (TASK-07.1.2 & 07.1.3): API endpoints calculating quiz scores & updating user Trust Score in Firestore `training_sessions`.
  - `TrainPage` (`/train`, TASK-07.1.4): Interactive quiz interface rendering scenario cards, option selections, and antibody point rewards.
- **Community Threat Reporting & Blacklist (`@iis/agents`, `apps/api`, `apps/web`)**:
  - `community.agent.ts` (TASK-08.1.1): `CommunityAgent` using Gemini 2.5 Flash for spam filtering, confidence scoring, & domain extraction from fraud reports.
  - `POST /v1/reports` & `GET /v1/reports` (TASK-08.1.2): API endpoints persisting user-submitted fraud reports to Firestore `fraud_reports`.
  - `CommunityPage` (`/community`, TASK-08.1.3): Live community feed page displaying user-submitted fraud reports & AI summaries.

### Added - Sprint 3 ("Simulation & Extension MVP") - Complete Sprint 3 Deliverables
- **Consequence Simulation Engine (`@iis/agents` & `apps/api`)**:
  - `simulation.agent.ts` (TASK-05.1.1): `SimulationAgent` using Gemini 2.5 Pro generating 3-step visceral consequence timelines (`T+0:00`, `T+seconds`, `T+minutes`) with financial loss estimates in VNĐ.
  - `POST /v1/scans/:scanId/simulate` (TASK-05.1.2): API endpoint with idempotency check, updating `scan_results` Firestore collection with simulation ID.
  - `TheaterModeModal` (`TheaterModeModal.tsx`, TASK-05.1.3): Dramatic visual component rendering the 3-step timeline and financial impact callout.
- **Chrome Browser Extension MVP (`apps/extension`)**:
  - `manifest.json` (TASK-06.1.1): Manifest V3 extension configuration with strict CSP rules.
  - `service-worker.ts` (TASK-06.1.2): Background service worker performing active tab URL checks against `/v1/scans/analyze`.
  - `dom-shield.ts` (TASK-06.1.3): Content script injecting Red Alert threat overlay into dangerous web pages using Shadow DOM isolation.
  - `popup.tsx` (TASK-06.1.4): Extension popup UI displaying live AI Orb status and real-time shield toggle.

### Added - Sprint 2 ("The AI Brain Awakens") - Complete Sprint 2 Deliverables
- **AI Agent Engine (`@iis/agents`)**:
  - `gemini.config.ts` (TASK-04.1.1): `@google/genai` SDK configuration & global system instruction.
  - `gemini.service.ts` (TASK-04.1.2): `GeminiService` with structured JSON `responseSchema` enforcement, exponential backoff retry (3 attempts), and fallback handlers.
  - `threat-detection.agent.ts` (TASK-04.2.1): `ThreatDetectionAgent` using Gemini 2.5 Flash with PII redaction (CCCD, phone, email) & confidence guardrails.
  - `reasoning.agent.ts` (TASK-04.3.1): `ReasoningAgent` using Gemini 2.5 Pro generating plain Vietnamese explanations, red flag details, and immunity points.
- **Backend AI API Routes (`apps/api`)**:
  - `POST /v1/scans/analyze` (TASK-04.2.2): Core scan endpoint analyzing URLs/Text/DOM and saving results to `scan_results` Firestore collection.
  - `GET /v1/scans/:scanId` (TASK-04.2.3): Fetch scan result by ID.
  - `POST /v1/scans/:scanId/explain` (TASK-04.3.2): Generate deep AI explanation for a scan result.
- **Scan & Explain UI (`apps/web`)**:
  - `ScanPage` (`/scan`, TASK-04.4.1): Interactive scan interface with real-time `AIOrb` state changes, risk badges, and scan result breakdown.
  - `ExplainModal` (`ExplainModal.tsx`, TASK-04.5.1): Cybernetic drawer/modal displaying AI narrative, red flag details, and recommended action steps.

### Added - Sprint 1 (Tasks 02.3.1 → 03.1.2) - Complete Sprint 1 Deliverables
- **Auth Context & Provider (TASK-03.1.1)**: Client-side `AuthContext` with Google Sign-in trigger and auto Firebase token verification with backend `/v1/auth/verify`.
- **Navigation & Layout (TASK-02.3.1 & 02.3.3)**: Sticky cybernetic `Navbar` with live Antibody Trust Score status, logo, and sign-in/out CTAs.
- **Landing Page Hero (TASK-02.4.1)**: Interactive Landing Page with `AIOrb` shield visual, `ScanInput` trigger, and live protection counters.
- **5 AI Modes Showcase (TASK-02.4.2)**: `FeatureShowcase` component displaying Cards for Detect, Simulate, Explain, Train, and Protect modes.
- **Login Page UI (TASK-03.1.2)**: Cybernetic Login Page at `/login` with Google Sign-in popup integration.

### Added - Sprint 1 (Tasks 01.2.3 → 02.2.5)
- **Firebase Infrastructure**:
  - `apps/api/src/services/firebase-admin.service.ts`: Firebase Admin SDK initialization for Cloud Run.
  - `apps/web/src/lib/firebase-client.ts`: Firebase Client SDK & Auth provider for Next.js web app.
  - `apps/api/src/routes/auth.route.ts`: `POST /v1/auth/verify` endpoint for Firebase JWT token verification and user profile upsert.
- **Shared UI Component Library (`@iis/ui`)**:
  - `Button` (TASK-02.2.1): Primary, Cyber, Danger, and Outline variants with loading state.
  - `Card` (TASK-02.2.2): Cybernetic Glassmorphism card component with backdrop-blur.
  - `RiskBadge` (TASK-02.2.3): Safe, Suspicious, Phishing, Malware, and Scam indicator badge.
  - `AIOrb` (TASK-02.2.4): SVG animated cybernetic shield orb supporting 4 states (`idle`, `scanning`, `threat`, `protected`).
  - `ScanInput` (TASK-02.2.5): URL/Text scan input form with glow focus ring and trigger button.

### Added - Sprint 1 (Tasks 01.1.2 → 01.4.1)
- **Monorepo Foundation (TASK-01.1.1)**: Initialized pnpm workspace & Turborepo 2.x pipeline.
- **Shared TS Presets (TASK-01.1.2)**: `tsconfig.base.json`, `tsconfig.node.json`, `tsconfig.react.json` in `@iis/config`.
- **Prettier & Code Style (TASK-01.1.3)**: Root `.prettierrc` and `.prettierignore`.
- **Core Domain Schemas (TASK-01.1.4)**: `zod` schemas and TypeScript inference types for `Scan`, `User`, `Simulation`, and `Training` in `@iis/core`.
- **Firestore Infrastructure (TASK-01.2.2)**: Production `firestore.rules` (anti-cheat score & owner security) and `firestore.indexes.json` (12 composite indexes).
- **Backend Service Infrastructure (TASK-01.3.1 & 01.3.2)**: Hono.js API middleware (`requestIdMiddleware`, `errorHandlerMiddleware`, CORS), `/v1/health` endpoint, and multi-stage `Dockerfile` for Cloud Run.
- **CI/CD Pipeline (TASK-01.4.1)**: GitHub Actions workflow (`.github/workflows/ci.yml`) for automated monorepo typecheck & build on PR.
