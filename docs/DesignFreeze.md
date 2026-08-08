# 🔒 DESIGN FREEZE — Internet Immune System
### Version: FREEZE-1.0.0 | Date: 2026-08-02 | Status: **LOCKED**

> **⚠️ IMMUTABLE BASELINE**
> Tài liệu này là bản chốt thiết kế chính thức (Design Freeze) của dự án **Internet Immune System**.
> Sau khi ký duyệt, **KHÔNG** được thay đổi bất kỳ quyết định kiến trúc nào trong tài liệu này
> mà không có **Architecture Decision Record (ADR)** được approve bởi Tech Lead.
>
> Repository: [KimDung1/Internet-Immune-System](https://github.com/KimDung1/Internet-Immune-System)

---

## 📋 Table of Contents
1. [UI Freeze](#1-ui-freeze)
2. [UX Freeze](#2-ux-freeze)
3. [API Freeze](#3-api-freeze)
4. [Database Freeze](#4-database-freeze)
5. [AI Workflow Freeze](#5-ai-workflow-freeze)
6. [Tech Stack Freeze](#6-tech-stack-freeze)
7. [Freeze Changelog](#7-freeze-changelog)
8. [Sign-off](#8-sign-off)

---

## 1. UI Freeze
> **Status: 🔒 LOCKED**

### 1.1 Visual Identity — FROZEN

| Token | Value | Usage |
|---|---|---|
| Brand Primary | `#06B6D4` (Cyan) | Digital Pulse, CTA buttons, active states |
| Brand Alt | `#00E5FF` (Cyber Blue) | Secondary accents, icons |
| Background Base | `#0B1120` (Deep Space Navy) | Page background |
| Surface 100 | `#111827` | Cards, panels |
| Surface 200 | `#1F2937` | Hover states, elevated cards |
| Surface 300 | `#374151` | Borders, dividers |
| Danger | `#EF4444` | Threat alerts, Immune Response |
| Warning | `#F59E0B` | Suspicious content |
| Success | `#10B981` | Safe/clean status |
| Danger Glow | `rgba(239,68,68,0.4)` | Threat pulse shadow |
| Primary Glow | `rgba(6,182,212,0.4)` | Active state shadow |

> **Color Conflict Resolution**: UISpecs.md proposed `#00E5FF`, DesignTokens.md proposed `#06B6D4`.
> **DECISION**: Primary brand = `#06B6D4` (Cyan-500). `#00E5FF` is secondary accent only.
> Reference: `docs/25_Decision_Record/ADR-UI-001-brand-color.md`

### 1.2 Typography System — FROZEN

| Scale | Size (rem) | px | Weight | Use Case |
|---|---|---|---|---|
| Display / H1 | 3rem | 48px | Bold 700 | Hero scores, Immunity Score ring |
| H2 | 1.5rem | 24px | SemiBold 600 | Section titles |
| H3 | 1.25rem | 20px | SemiBold 600 | Card titles |
| Body | 1rem | 16px | Regular 400 | AI explanations, content |
| Small | 0.875rem | 14px | Regular 400 | Labels, helpers |
| Caption | 0.75rem | 12px | Medium 500 | Metadata, timestamps |

- **Primary Font**: `Inter` (Google Fonts) — readability
- **Display / Code Font**: `Space Grotesk` — scores, AI data, technical output
- **Line Height**: 150% (body), 120% (headings)
- **Letter Spacing**: -0.02em (headings), 0 (body)
- **Vietnamese Diacritics**: Confirmed supported by both fonts

### 1.3 Spacing — 8pt Grid System — FROZEN

`4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px`

CSS Variables:
```
--space-1: 0.25rem  (4px)
--space-2: 0.5rem   (8px)
--space-3: 0.75rem  (12px)
--space-4: 1rem     (16px)
--space-6: 1.5rem   (24px)
--space-8: 2rem     (32px)
--space-12: 3rem    (48px)
--space-16: 4rem    (64px)
```

### 1.4 Border Radius — FROZEN

```
--radius-sm:   4px    → Checkbox, small tags
--radius-md:   8px    → Buttons, inputs
--radius-lg:   16px   → Cards, modals
--radius-full: 9999px → Avatars, badges
```

### 1.5 Z-Index Scale — FROZEN

| Layer | Value | Components |
|---|---|---|
| Hide | -1 | — |
| Base | 0 | Page content |
| Elevated | 10 | Dropdowns, tooltips |
| Sticky | 20 | Headers, nav bars |
| Overlay | 30 | Modal backdrops |
| Modal | 40 | Modals, dialogs |
| Toast | 50 | Notifications, threat alerts |

### 1.6 Core Component Specifications — FROZEN

#### Buttons

| Type | Background | Text | Border-radius | Hover Effect |
|---|---|---|---|---|
| Primary | `#06B6D4` | `#000000` | 8px | `box-shadow: 0 0 12px rgba(6,182,212,0.4)` |
| Danger / Block | `#EF4444` | `#FFFFFF` | 8px | Pulse animation on threat state |
| Ghost | transparent | `#06B6D4` | 8px | `border: 1px solid rgba(255,255,255,0.2)` |

All buttons: 5 states (default, hover, focus, active, disabled at 30% opacity)

#### Cards

```
background: #111827
border: 1px solid rgba(255, 255, 255, 0.08)
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5)
border-radius: 16px
```

#### Input Fields

```
background: #0B1120
border: 1px solid rgba(255, 255, 255, 0.12)
border-radius: 8px
focus → border: 2px solid #06B6D4
icon: Scan icon, right-aligned
```

#### Immunity Ring (Custom SVG Component)

```
shape: SVG circle, stroke-width: 8px
gradient: #10B981 (Safe Green) → #06B6D4 (Cyber Blue)
animation: progress reveal on load, 1s ease-out
center: Immunity Score number, Space Grotesk Bold, 48px
```

### 1.7 Glow & Shadow Tokens — FROZEN

```
--glow-primary:  0 0 12px rgba(6, 182, 212, 0.4)
--glow-danger:   0 0 12px rgba(239, 68, 68, 0.4)
--glow-success:  0 0 12px rgba(16, 185, 129, 0.4)
--shadow-surface: 0 4px 6px -1px rgba(0, 0, 0, 0.5)
```

### 1.8 Motion & Animation — FROZEN

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Scan Radar | 2s, infinite | `linear` | Detect mode active |
| Immune Response alert | 0.3s | `ease-out` | Threat detected |
| Page transitions | 200ms | `ease-in-out` | Route change |
| Particle dissolve | 600ms | `ease-out` | Threat neutralized pop-up |
| HUD background pulse | 3s, infinite | `ease-in-out` | Protect mode running |
| Theater Mode fade-in | 800ms | `ease-in` | Simulate mode enter |
| Badge earned burst | 400ms | `spring` | Score awarded |

**Accessibility mandate**: ALL animations MUST be disabled when `prefers-reduced-motion: reduce`.

### 1.9 Responsive Breakpoints — FROZEN

| Name | Min Width | Max Width |
|---|---|---|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | 1279px |
| Wide | 1280px | — |

**Strategy**: Mobile-first CSS.
**Extension popup**: Fixed 380px width, max 600px height. No responsive needed.

---

## 2. UX Freeze
> **Status: 🔒 LOCKED**

### 2.1 Product Experience Principles — FROZEN

1. **Proactive**: System acts before user asks — not a tool, an immune system
2. **Dramatic**: Create emotional awareness of risk, not just alert boxes
3. **Immersive**: Holistic protection environment, not isolated features
4. **Educational**: Every alert teaches, not just warns
5. **Trustworthy**: Clear data sourcing, no false urgency

> **LOCKED STATEMENT**: "This is an AI Experience, NOT a chatbot."

### 2.2 Five AI Modes — UX States FROZEN

| Mode | UX State Name | Visual Signature | Entry Trigger |
|---|---|---|---|
| **Detect** | Scanning State | Cyan radar ring, pulsing animation | URL navigation / paste / manual input |
| **Simulate** | Theater Mode | Full screen darkens (80% overlay), consequence timeline | User taps "Simulate" button |
| **Explain** | Reading Mode | AI narrator panel, red-flag inline highlights | User taps "Explain why" |
| **Train** | Drill Mode | Quiz cards, progress bar, gamified scoring UI | Notification or user initiates |
| **Protect** | HUD Mode | Subtle green pulse top-right corner | Always-on (permission granted) |

### 2.3 User Flows — FROZEN

#### FLOW 1: Onboarding
```
[Screen 1] Welcome — Tagline + Logo animation
     ↓
[Screen 2] Initial Immunity Scan — "Checking your digital health..."
     ↓
[Screen 3] Quick Tour — 5 AI modes via 1 sample fraud scenario (interactive)
     ↓
[Screen 4] Permission Grant — "Activate Protect Mode" (browser extension permission)
     ↓
[Screen 5] Dashboard — Immunity Score + first scan prompt
```

#### FLOW 2: Fraud Scan (Detect Mode)
```
[Input] URL paste / browser auto-capture
     ↓
[State] Scanning (radar animation, max 3 seconds)
     ↓
[Branch A] SAFE:
     → Green tick + soft pulse animation
     → "Link is safe. No threats detected."
     
[Branch B] THREAT:
     → Immune Response (red alert, 0.3s screen vibration)
     → Threat summary card: Risk Score, Classification
     → CTA Row: [🚫 Block Link] [🎭 Simulate] [📖 Explain]
```

#### FLOW 3: Consequence Simulation (Simulate Mode)
```
[Entry] Threat detected → User taps "Simulate"
     ↓
[Transition] Theater Mode fade-in (800ms, screen dims)
     ↓
[Content] AI narrates 3-step consequence timeline
     → Step 1: Immediate action by attacker
     → Step 2: Data exfiltration / money transfer
     → Step 3: Long-term damage
     ↓
[Closing] "Rất may, hệ miễn dịch của bạn đã chặn điều này" + green pulse
     ↓
[CTA] [📖 View Technical Explanation] | [← Back to Dashboard]
```

#### FLOW 4: Training (Train Mode)
```
[Entry] Push notification "Có 1 đợt diễn tập mới" / Manual entry
     ↓
[Content] AI-generated phishing scenario displayed
     → Email / SMS / website scenario (varies by session)
     ↓
[Interaction] User identifies 3 red flags (tap to select)
     ↓
[Result] Score card + Badge award animation
     → "Antibody Level 2 Unlocked" particle burst
     → Immunity Score +X points
     ↓
[CTA] [Next Drill] | [← Dashboard]
```

#### FLOW 5: Real-time Protection (Protect Mode)
```
[Background] HUD running — subtle green indicator
     ↓
[Normal browsing] Slow cyan pulse, no interruption
     ↓
[Threat intercepted]
     → HUD flashes red
     → Page load blocked instantly
     → Popup: "⚡ Mối đe dọa bị tiêu diệt bởi Kháng thể AI"
     → Particle dissolution visual (600ms)
     ↓
[Dismiss] Popup closes, threat logged to history
```

### 2.4 Emotional Design Moments — FROZEN

| Moment | Target Emotion | Design Implementation |
|---|---|---|
| First scan complete (safe) | Relief, confidence | Slow green pulse, calming animation |
| Threat detected | Urgency (not panic) | Red alert + immediate clear CTA |
| Simulation ends | Gratitude, awareness | "Lucky" message + hopeful tone |
| Badge earned | Achievement, pride | Particle burst + score increment |
| Dashboard in safe state | Security, calm | Slow background cyan HUD pulse |
| Auto-block fires | Empowerment | "I stopped it" messaging |

### 2.5 Screen Hierarchy — FROZEN

```
App Root
├── Onboarding (5 screens)
├── Dashboard (main hub)
│   ├── Immunity Score Ring
│   ├── Recent Threats (list)
│   ├── Quick Scan Input
│   └── Mode Cards (5 modes)
├── Scan Result (detail)
│   ├── Risk Score + Classification
│   ├── Red Flags list
│   ├── [Block] [Simulate] [Explain] CTAs
│   └── Simulation Theater (overlay)
├── Training Center
│   ├── Drill Session
│   ├── Quiz Interface
│   └── Badge Gallery
├── History (paginated)
└── Settings
    ├── Protection preferences
    ├── Notification settings
    └── Account
```

### 2.6 Accessibility Requirements — FROZEN (WCAG 2.1 AA)

| Requirement | Standard |
|---|---|
| Color contrast (text) | ≥ 4.5:1 |
| Color contrast (large text) | ≥ 3:1 |
| Keyboard navigation | All interactive elements reachable |
| Focus indicators | Always visible, min 2px outline |
| Screen reader labels | `aria-label` on all icon buttons |
| Motion control | `prefers-reduced-motion` respected |
| Language | `lang="vi"` for Vietnamese pages |
| Touch targets | Min 44×44px on mobile |

---

## 3. API Freeze
> **Status: 🔒 LOCKED**

### 3.1 Base Configuration — FROZEN

```
Base URL:    https://api.immune-system.vn/v1
Protocol:    HTTPS only (HTTP redirects to HTTPS)
Auth:        Firebase JWT — Bearer token in Authorization header
Content:     application/json
Versioning:  URI-based (/v1/, /v2/)
CORS:        Allowed origins: extension://* + *.immune-system.vn
```

### 3.2 Standard Response Envelope — FROZEN

**Every API response MUST use this exact structure:**

```json
{
  "status": "success | error",
  "data": {},
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable message in Vietnamese/English"
  },
  "meta": {
    "requestId": "uuid-v4",
    "timestamp": "2026-08-02T09:00:00.000Z"
  }
}
```

- `data` present on success, null on error
- `error` present on failure, null on success
- `meta` always present

### 3.3 Endpoint Catalogue — FROZEN

#### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/verify` | Firebase Token | Verify token, create/update user record |
| DELETE | `/auth/session` | Required | Sign out, revoke token |

#### Scans — Threat Analysis

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/scans/analyze` | Required | Analyze URL / text / DOM via Gemini |
| GET | `/scans` | Required | User scan history (paginated) |
| GET | `/scans/:scanId` | Required | Single scan result detail |
| POST | `/scans/:scanId/simulate` | Required | Generate consequence simulation |
| GET | `/scans/:scanId/simulation` | Required | Get simulation result |
| POST | `/scans/:scanId/explain` | Required | Get detailed AI explanation |

#### Training

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/training/sessions` | Required | Start new training drill (Gemini generates) |
| POST | `/training/sessions/:id/submit` | Required | Submit user's answers, get score |
| GET | `/training/sessions` | Required | User training history |
| GET | `/training/badges` | Required | All earned badges |

#### User & Metrics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | Required | Current user profile + Trust Score |
| PATCH | `/users/me/settings` | Required | Update user settings |
| GET | `/metrics/summary` | Required | 30-day personal security summary |

#### Community Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/reports` | Required | Submit fraud report |
| GET | `/reports/threats` | Required | Community threat feed |

### 3.4 Request / Response Schemas — FROZEN

#### POST `/scans/analyze`

**Request:**
```json
{
  "targetUrl": "string | null",
  "contentType": "url | email | text | dom",
  "contentData": "string | null",
  "context": "string | null"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "scanId": "string",
    "riskScore": 0,
    "classification": "safe | suspicious | phishing | malware | scam",
    "confidence": 0.0,
    "geminiExplanation": "string",
    "redFlags": ["string"],
    "actionRecommendation": "ALLOW | BLOCK | WARN"
  },
  "error": null,
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601" }
}
```

#### POST `/scans/:scanId/simulate`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "simulationId": "string",
    "steps": [
      { "step": 1, "title": "string", "description": "string" },
      { "step": 2, "title": "string", "description": "string" },
      { "step": 3, "title": "string", "description": "string" }
    ],
    "potentialLoss": "string",
    "closingMessage": "string"
  },
  "error": null,
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601" }
}
```

#### POST `/training/sessions`

**Request:**
```json
{
  "preferredType": "phishing_email | fake_sms | fake_site | auto"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "sessionId": "string",
    "scenarioType": "phishing_email | fake_sms | fake_site",
    "scenarioContent": "string",
    "questions": [
      {
        "questionId": "string",
        "question": "string",
        "options": ["string", "string", "string", "string"]
      }
    ]
  }
}
```

#### GET `/users/me`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "uid": "string",
    "email": "string",
    "displayName": "string",
    "trustScore": 0,
    "badges": ["string"],
    "settings": {
      "alertsEnabled": true,
      "autoBlock": false,
      "language": "vi | en"
    }
  }
}
```

### 3.5 Error Codes — FROZEN

| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing / invalid / expired auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_INPUT` | 400 | Invalid request body or params |
| `INVALID_URL` | 400 | URL malformed or unparseable |
| `GEMINI_TIMEOUT` | 504 | Gemini API did not respond in time |
| `GEMINI_SAFETY_BLOCK` | 422 | Gemini blocked content for safety |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `CONTENT_TOO_LONG` | 413 | Input exceeds 4000 char limit |

### 3.6 Rate Limits — FROZEN

| Endpoint | Limit |
|---|---|
| `POST /scans/analyze` | 30 req / min / user |
| `POST /training/sessions` | 10 sessions / day / user |
| `POST /reports` | 5 reports / hour / user |
| All other endpoints | 100 req / min / user |

### 3.7 Required HTTP Headers — FROZEN

```
Authorization: Bearer <Firebase_ID_Token>   (required — all authenticated endpoints)
Content-Type: application/json
X-Request-ID: <uuid-v4>                     (optional — for distributed tracing)
```

---

## 4. Database Freeze
> **Status: 🔒 LOCKED**

### 4.1 Platform — FROZEN

- **Platform**: Google Cloud Firestore (Native Mode)
- **Region**: `asia-southeast1` (Singapore)
- **Structure**: Flat collections — max 1 level of subcollection
- **NoSQL principle**: Denormalized data for read performance

### 4.2 Collections — FROZEN

#### `users` Collection

| Field | Type | Rules |
|---|---|---|
| `uid` | string (Doc ID) | = Firebase Auth UID |
| `email` | string | required |
| `display_name` | string | required |
| `trust_score` | number 0–100 | default: 50 |
| `badges` | array\<string\> | default: [] |
| `created_at` | timestamp | server timestamp on create |
| `last_active` | timestamp | updated on each login |
| `settings` | map | `{ alerts_enabled: bool, auto_block: bool, language: "vi\|en" }` |

#### `scan_results` Collection

| Field | Type | Rules |
|---|---|---|
| `scanId` | string (Doc ID) | auto UUID |
| `uid` | string | ref → users.uid |
| `input_type` | string | `url \| email \| text \| dom` |
| `input_value` | string | max 4000 chars |
| `risk_score` | number 0–100 | from Gemini |
| `classification` | string | `safe \| suspicious \| phishing \| malware \| scam` |
| `confidence` | number 0.0–1.0 | from Gemini |
| `gemini_explanation` | string | max 500 chars |
| `red_flags` | array\<string\> | from Gemini |
| `action_recommendation` | string | `ALLOW \| BLOCK \| WARN` |
| `timestamp` | timestamp | server timestamp |
| `simulation_id` | string \| null | ref → simulations.simulationId |

#### `simulations` Collection

| Field | Type | Rules |
|---|---|---|
| `simulationId` | string (Doc ID) | auto UUID |
| `scan_id` | string | ref → scan_results.scanId |
| `uid` | string | ref → users.uid |
| `steps` | array\<map\> | `[{ step: int, title: string, description: string }]` |
| `potential_loss` | string | from Gemini |
| `closing_message` | string | from Gemini |
| `created_at` | timestamp | server timestamp |

#### `training_sessions` Collection

| Field | Type | Rules |
|---|---|---|
| `sessionId` | string (Doc ID) | auto UUID |
| `uid` | string | ref → users.uid |
| `scenario_type` | string | `phishing_email \| fake_sms \| fake_site` |
| `scenario_content` | string | Gemini-generated |
| `questions` | array\<map\> | `[{ question, options[], correct_index, explanation }]` |
| `user_answers` | array\<number\> | null until submitted |
| `score` | number 0–100 | null until submitted |
| `badges_earned` | array\<string\> | badges awarded this session |
| `created_at` | timestamp | session start |
| `completed_at` | timestamp \| null | submission time |

#### `threat_intelligence` Collection

| Field | Type | Rules |
|---|---|---|
| `docId` | string (Doc ID) | SHA-256 hash of entity_value |
| `entity_type` | string | `URL \| PHONE \| BANK_ACCOUNT \| EMAIL` |
| `entity_value` | string | the entity |
| `risk_level` | string | `HIGH \| MEDIUM \| LOW` |
| `source` | string | `SYSTEM \| COMMUNITY \| NCSC_VN` |
| `report_count` | number | community report tally |
| `last_updated` | timestamp | last modification |

#### `fraud_reports` Collection

| Field | Type | Rules |
|---|---|---|
| `reportId` | string (Doc ID) | auto UUID |
| `uid` | string | reporting user |
| `entity_type` | string | `URL \| PHONE \| BANK_ACCOUNT` |
| `entity_value` | string | reported entity |
| `description` | string | user description, max 500 chars |
| `status` | string | `pending \| verified \| rejected` |
| `created_at` | timestamp | submission time |

### 4.3 Composite Indexes — FROZEN

| Collection | Fields | Order | Purpose |
|---|---|---|---|
| `scan_results` | `uid` + `timestamp` | ASC + DESC | User history pagination |
| `scan_results` | `uid` + `risk_score` | ASC + DESC | Filter by threat level |
| `training_sessions` | `uid` + `created_at` | ASC + DESC | Training history |
| `threat_intelligence` | `entity_type` + `entity_value` | ASC + ASC | Fast lookup |
| `threat_intelligence` | `risk_level` + `last_updated` | ASC + DESC | Threat feed |
| `fraud_reports` | `status` + `created_at` | ASC + DESC | Admin moderation queue |

### 4.4 Firestore Security Rules — FROZEN

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: own data only
    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    // Scan results: owner can read; backend creates only (immutable)
    match /scan_results/{docId} {
      allow read: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }

    // Simulations: owner read; backend creates (immutable)
    match /simulations/{docId} {
      allow read: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }

    // Training sessions: owner read/create/update (for submitting answers)
    match /training_sessions/{docId} {
      allow read: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create, update: if request.auth != null;
      allow delete: if false;
    }

    // Threat Intelligence: public read; no client writes (admin SDK only)
    match /threat_intelligence/{docId} {
      allow read: if true;
      allow write: if false;
    }

    // Fraud Reports: authenticated create; no client read/modify (admin only)
    match /fraud_reports/{docId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false;
    }
  }
}
```

### 4.5 Data Retention — FROZEN

| Collection | Retention Period | Action |
|---|---|---|
| `scan_results` | 90 days | Auto-delete via Cloud Scheduler |
| `simulations` | 90 days | Auto-delete via Cloud Scheduler |
| `training_sessions` | 1 year | Archive to Cold Storage after 1 year |
| `threat_intelligence` | Indefinite | Manual review for cleanup |
| `fraud_reports` | 2 years | Legal compliance — Vietnam Cybersecurity Law 2018 |
| `users` | Until account deleted | GDPR-style right-to-erasure |

---

## 5. AI Workflow Freeze
> **Status: 🔒 LOCKED**

### 5.1 Model Selection — FROZEN

| Use Case | Model | Reason |
|---|---|---|
| Detect (real-time) | `gemini-2.5-flash` | Low latency (<2s), cost-efficient |
| Simulate | `gemini-2.5-pro` | Complex narrative generation quality |
| Explain | `gemini-2.5-pro` | Deep contextual reasoning |
| Train | `gemini-2.5-pro` | Creative realistic scenario generation |
| Protect (background) | `gemini-2.5-flash` | Real-time, lightweight |

### 5.2 Global System Instruction — FROZEN

```
You are the core intelligence of the 'Internet Immune System'.
Your objective is to protect Vietnamese internet users from web-based fraud,
phishing, and social engineering attacks.

Rules:
1. Analyze provided context clinically and objectively.
2. Always respond in the user's language (Vietnamese or English).
3. Output MUST perfectly match the requested JSON schema — no text outside JSON.
4. Never fabricate URLs, phone numbers, or financial institution names.
5. If confidence < 0.5, classify as 'suspicious' — never 'safe'.
6. Never use real individual names in simulations — use archetypes only.
```

### 5.3 Five-Agent Architecture — FROZEN

```
Browser Extension / Web App
         │ HTTP / WebSocket
         ▼
  ┌──────────────────────┐
  │   Cloud Run API      │
  │   (Hono.js Backend)  │
  └──────────┬───────────┘
             │ Invokes
             ▼
  ┌──────────────────────┐
  │  Orchestrator Agent  │ ← Parses request, routes to sub-agents
  └──────┬───────────────┘
         │
  ┌──────┴──────────────────────────────────┐
  │      │           │          │           │
  ▼      ▼           ▼          ▼           ▼
Detector Simulator  Trainer  Protector  (future agents)
Agent    Agent      Agent    Agent
  │      │           │          │
  └──────┴───────────┴──────────┘
                    │ Aggregated JSON
                    ▼
             User Response
```

### 5.4 Agent Input/Output Schemas — FROZEN

#### Orchestrator
- **Input**: Raw HTTP request body
- **Output**: Routes to agent, returns aggregated response
- **Timeout**: 10s hard limit

#### Detector Agent
- **Model**: `gemini-2.5-flash`
- **Input**: `{ url, title, contentData, context }`
- **Grounding**: Check `threat_intelligence` collection FIRST (before AI call)
- **Output**:
```json
{
  "risk_score": 0,
  "classification": "safe|suspicious|phishing|malware|scam",
  "confidence": 0.0,
  "red_flags": [],
  "action_recommendation": "ALLOW|BLOCK|WARN",
  "gemini_explanation": ""
}
```
- **Auto-trigger**: risk_score ≥ 70 → Orchestrator triggers Simulator

#### Simulator Agent
- **Model**: `gemini-2.5-pro`
- **Input**: `{ scan_result, user_profile }`
- **Output**:
```json
{
  "steps": [
    { "step": 1, "title": "", "description": "" },
    { "step": 2, "title": "", "description": "" },
    { "step": 3, "title": "", "description": "" }
  ],
  "potential_loss": "",
  "closing_message": ""
}
```

#### Trainer Agent
- **Model**: `gemini-2.5-pro`
- **Input**: `{ user_trust_score, preferred_scenario_type }`
- **Difficulty**: trust_score < 40 → Easy; 40–70 → Medium; > 70 → Hard
- **Output**:
```json
{
  "scenario_type": "",
  "scenario_content": "",
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correct_index": 0,
      "explanation": ""
    }
  ]
}
```

#### Protector Agent
- **Model**: `gemini-2.5-flash`
- **Trigger**: DOM mutation observer (browser extension background service worker)
- **Auto-block condition**: risk_score ≥ 85 AND user.settings.auto_block === true
- **Output**: `{ action: "BLOCK|WARN|LOG", reason: "" }`

### 5.5 Prompt Templates — FROZEN

#### Detect Prompt (v1.0 — FROZEN)
```
{{global_system_instruction}}

Analyze the following webpage content to determine if it is malicious.

URL: {{url}}
Page Title: {{title}}
Extracted Content (first 4000 chars): {{content}}

Look for: urgency cues, fake login forms, domain spoofing, unrealistic promises, manipulation.

Respond ONLY with valid JSON:
{
  "risk_score": <0-100>,
  "classification": "<safe|suspicious|phishing|malware|scam>",
  "confidence": <0.0-1.0>,
  "red_flags": ["<string>"],
  "action_recommendation": "<ALLOW|BLOCK|WARN>",
  "gemini_explanation": "<Vietnamese, max 200 chars>"
}
```

#### Simulate Prompt (v1.0 — FROZEN)
```
{{global_system_instruction}}

URL classified as: {{classification}} | Risk: {{risk_score}}/100
URL: {{url}}

Simulate what attackers intend to do if the user interacts with this page.
Write a realistic 3-step consequence timeline in Vietnamese.
Be visceral but factual. Never use real individual names.

Respond ONLY with valid JSON:
{
  "steps": [
    { "step": 1, "title": "<string>", "description": "<max 150 chars>" },
    { "step": 2, "title": "<string>", "description": "<max 150 chars>" },
    { "step": 3, "title": "<string>", "description": "<max 150 chars>" }
  ],
  "potential_loss": "<string>",
  "closing_message": "<max 100 chars>"
}
```

#### Explain Prompt (v1.0 — FROZEN)
```
{{global_system_instruction}}

Classification: {{classification}}
Red Flags: {{red_flags}}
URL: {{url}}

Explain WHY this content is malicious. Use clear, non-technical Vietnamese
suitable for everyday users.

Respond ONLY with valid JSON:
{
  "explanation": "<150-300 chars>",
  "red_flag_details": [
    { "flag": "<string>", "why_dangerous": "<string>" }
  ],
  "educational_tip": "<max 120 chars>"
}
```

#### Train Prompt (v1.0 — FROZEN)
```
{{global_system_instruction}}

Generate a realistic but COMPLETELY FAKE phishing scenario for Vietnamese users.
Difficulty: {{difficulty}} (easy|medium|hard)
Type: {{scenario_type}} (phishing_email|fake_sms|fake_site)
Do NOT use real brand names — use fictitious similar names.

Provide 3 multiple-choice questions testing red-flag identification.

Respond ONLY with valid JSON:
{
  "scenario_type": "<string>",
  "scenario_content": "<the fake message/email/page content>",
  "questions": [
    {
      "question": "<string>",
      "options": ["<string>", "<string>", "<string>", "<string>"],
      "correct_index": <0-3>,
      "explanation": "<string>"
    }
  ]
}
```

### 5.6 Safety & Guardrails — FROZEN

| Measure | Setting |
|---|---|
| Gemini Safety Setting | `BLOCK_MEDIUM_AND_ABOVE` for DANGEROUS_CONTENT |
| Max output tokens — Detect | 512 |
| Max output tokens — Simulate | 1024 |
| Max output tokens — Explain | 1024 |
| Max output tokens — Train | 2048 |
| Input sanitization | Strip all HTML tags before sending to Gemini |
| Content length cap | 4000 characters maximum per request |
| PII protection | Strip all PII (email, phone, ID) before AI call |
| Fallback on error | `risk_score: 50, classification: "suspicious", recommendation: "WARN"` |
| Confidence floor | Never classify as "safe" if confidence < 0.5 |

### 5.7 AI Performance SLOs — FROZEN

| Metric | Target |
|---|---|
| Detect response time (P50) | < 1.5 seconds |
| Detect response time (P95) | < 2.0 seconds |
| Simulate response time (P95) | < 5.0 seconds |
| Train session generation (P95) | < 8.0 seconds |
| AI service uptime | ≥ 99.5% |
| False positive rate | < 5% |
| False negative rate | < 2% |
| JSON schema compliance | 100% (strict — reject malformed) |

---

## 6. Tech Stack Freeze
> **Status: 🔒 LOCKED**

### 6.1 Complete Tech Stack — FROZEN

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Web Frontend | Next.js (React) | 14.x LTS | SSR/SSG, SEO, App Router |
| Browser Extension | React + Vite + CRXJS | Latest stable | Manifest V3, HMR dev experience |
| Styling | Tailwind CSS + Shadcn UI | CSS 3.x | Rapid, consistent components |
| Backend Runtime | Node.js | 20 LTS | Full-stack TypeScript, stable |
| Backend Framework | Hono.js | Latest | Lightweight, Cloud Run optimized |
| Language | TypeScript | 5.x | End-to-end type safety |
| Monorepo | Turborepo + pnpm | Latest | Shared types, incremental builds |
| Cloud Hosting | Google Cloud Run | — | Scale-to-zero, GCP native |
| Database | Firebase Firestore | Native Mode | Flexible schema, real-time |
| Authentication | Firebase Auth | — | Google login, JWT, Firestore rules integration |
| AI Platform | Gemini API via Vertex AI | gemini-2.5-flash / gemini-2.5-pro | Competition requirement |
| AI Agent SDK | Google ADK (Agent Dev Kit) | Latest | Multi-agent orchestration |
| CI/CD | GitHub Actions | — | Open source, repository native |
| Monitoring | Google Cloud Monitoring | — | GCP native, no additional cost |
| Error Tracking | Sentry | — | Exception capture, performance monitoring |

### 6.2 Out-of-Scope for MVP — FROZEN (WILL NOT BUILD)

- ❌ Mobile native app (iOS / Android)
- ❌ Standalone desktop application
- ❌ Self-hosted / on-premise deployment
- ❌ Alternative AI providers (OpenAI, Anthropic, etc.)
- ❌ Custom ML model training or fine-tuning
- ❌ Paid tier / billing system
- ❌ Enterprise SSO / SAML

---

## 7. Freeze Changelog

| Version | Date | Author | Summary |
|---|---|---|---|
| FREEZE-1.0.0 | 2026-08-02 | Tech Lead | Initial Design Freeze — pre-code baseline, all 5 domains locked |
| FREEZE-1.2.0 | 2026-08-03 | Senior Principal UX/UI Designer & Staff Software Engineer | Refactored UI to Cybersecurity SOC Console Standard (High density, monospaced typography, DEFCON ticker, clean border-driven layout) |

**Change Policy**: Any modification to this document requires:
1. A new ADR in `docs/25_Decision_Record/ADR-XXX-title.md`
2. Tech Lead approval
3. Version bump in Freeze Changelog
4. Notification to all engineering leads

---

## 8. Sign-off

> **Tài liệu này được coi là LOCKED kể từ ngày ký duyệt.**
> Mọi thay đổi sau ngày này PHẢI có ADR (Architecture Decision Record)
> được approve bởi Tech Lead TRƯỚC KHI implement.

| Role | Name | Sign | Date |
|---|---|---|---|
| Tech Lead | | | |
| Product Manager | | | |
| UX Lead | | | |
| AI Lead | | | |
| Security Lead | | | |

---

> **Related Source Documents (read-only after Freeze):**
> - `docs/08_System_Architecture/Architecture.md`
> - `docs/08_System_Architecture/TechStack.md`
> - `docs/09_AI/PromptEngineering.md`
> - `docs/09_AI/GeminiIntegration.md`
> - `docs/10_Agent/AgentArchitecture.md`
> - `docs/11_Database/DatabaseSchema.md`
> - `docs/14_API/APIReference.md`
> - `docs/06_Design_System/DesignTokens.md`
> - `docs/05_UI/UISpecs.md`
> - `docs/04_UX/UserFlows.md`
> - `docs/25_Decision_Record/`
