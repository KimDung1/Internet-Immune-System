# 🏃 SPRINT PLAN — Internet Immune System
### Version: 1.0.0 | Methodology: Agile Scrum | Duration: 10 Weeks (5 × 2-week Sprints)

> Repository: [KimDung1/Internet-Immune-System](https://github.com/KimDung1/Internet-Immune-System)
> Backlog: [ProductBacklog.md](./ProductBacklog.md) | Freeze: [DesignFreeze.md](../DesignFreeze.md)

---

## 📐 Agile Framework

| Item | Value |
|---|---|
| **Methodology** | Scrum |
| **Sprint Length** | 2 tuần (10 working days) |
| **Total Duration** | 10 tuần (5 Sprints) |
| **Team Velocity** | ~40 story points / sprint |
| **Story Point Scale** | Fibonacci: 1, 2, 3, 5, 8, 13 |
| **Daily Standup** | 09:00 – 09:15 (async-first nếu remote) |
| **Sprint Planning** | Ngày đầu sprint, tối đa 4 giờ |
| **Sprint Review** | Ngày cuối sprint, tối đa 2 giờ |
| **Sprint Retro** | Sau Review, tối đa 1.5 giờ |

---

## 🎯 Product Goal (North Star)

> **"Tạo một AI Experience hoàn chỉnh — phát hiện lừa đảo, mô phỏng hậu quả, bảo vệ thời gian thực — đủ ấn tượng để đạt Top 10 AI Riser Vietnam."**

---

## 📊 Sprint Timeline Overview

```
Tuần  1  2  3  4  5  6  7  8  9  10
      ├──────┤  ├──────┤  ├──────┤  ├──────┤  ├──────┤
      Sprint 1  Sprint 2  Sprint 3  Sprint 4  Sprint 5
      Infra &   AI Engine  Simulation  Extension  Dashboard
      Design    & Detect   & Theater   & Training  & Demo Prep
```

| Sprint | Tuần | Focus | Demo Milestone |
|---|---|---|---|
| Sprint 1 | W1–W2 | Foundation + Design System + Auth | Dev environment running |
| Sprint 2 | W3–W4 | AI Detect + Explain Engine | Scan a URL, see result |
| Sprint 3 | W5–W6 | Simulation + Extension MVP | Theater Mode demo-ready |
| Sprint 4 | W7–W8 | Extension Protect + Training | Full extension working |
| Sprint 5 | W9–W10 | Dashboard + QA + Demo Prep | Competition-ready build |

---

## 🟦 SPRINT 1: "Build the Foundation"
### Week 1–2 | 2026-08-03 → 2026-08-14

---

### 🎯 Sprint Goal

> **"Hoàn thiện toàn bộ hạ tầng kỹ thuật và design system để team có thể phát triển song song từ Sprint 2 mà không bị block."**

Kết thúc Sprint 1, team có thể:
- Chạy `pnpm dev` → 3 apps (web, api, extension) cùng lúc
- Đăng nhập bằng Google, thấy Dashboard trống
- Design system hoàn chỉnh với tất cả components từ DesignFreeze
- CI/CD pipeline tự động chạy test khi tạo PR

---

### 📖 User Stories in Sprint 1

| Story ID | User Story | Story Points | Priority |
|---|---|---|---|
| STORY-01.1 | Monorepo Initialization | 8 | 🔴 P0 |
| STORY-01.2 | Firebase Project Setup | 5 | 🔴 P0 |
| STORY-01.3 | Cloud Run API Setup | 8 | 🔴 P0 |
| STORY-01.4 | CI/CD Pipeline | 5 | 🟡 P1 |
| STORY-02.1 | Design Tokens & Global Styles | 5 | 🔴 P0 |
| STORY-02.2 | Core UI Components | 8 | 🔴 P0 |
| STORY-02.3 | Page Layouts & Navigation | 3 | 🔴 P0 |
| STORY-02.4 | Landing Page | 5 | 🔴 P0 |
| STORY-03.1 | Firebase Authentication Flow | 5 | 🔴 P0 |
| **Total** | | **52 SP** | |

---

### ✅ Task List — Sprint 1

#### 🏗️ Infrastructure Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-01.1.1 | Bootstrap Turborepo + pnpm workspace | Dev Lead | 2h | — | 🔴 P0 |
| TASK-01.1.2 | Setup shared TypeScript config | Dev Lead | 1h | 01.1.1 | 🔴 P0 |
| TASK-01.1.3 | Setup shared ESLint + Prettier | Dev Lead | 1h | 01.1.2 | 🔴 P0 |
| TASK-01.1.4 | Setup shared Zod schemas (packages/core) | Backend | 2h | 01.1.2 | 🔴 P0 |
| TASK-01.2.1 | Tạo Firebase project & enable services | Backend | 1h | 01.1.1 | 🔴 P0 |
| TASK-01.2.2 | Deploy Firestore Security Rules + Indexes | Backend | 2h | 01.2.1 | 🔴 P0 |
| TASK-01.2.3 | Setup Firebase Admin SDK cho backend | Backend | 1h | 01.2.1 | 🔴 P0 |
| TASK-01.2.4 | Setup Firebase client SDK cho web app | Frontend | 1h | 01.2.1 | 🔴 P0 |
| TASK-01.3.1 | Initialize Hono.js API app | Backend | 2h | 01.1.1 | 🔴 P0 |
| TASK-01.3.2 | Tạo Dockerfile cho API | Backend | 2h | 01.3.1 | 🔴 P0 |
| TASK-01.3.3 | Deploy lên Cloud Run (staging) | DevOps | 2h | 01.3.2 | 🔴 P0 |
| TASK-01.4.1 | Setup GitHub Actions — CI pipeline | DevOps | 2h | 01.1.3 | 🟡 P1 |
| TASK-01.4.2 | Setup GitHub Actions — CD pipeline | DevOps | 2h | 01.4.1 | 🟡 P1 |
| TASK-01.4.3 | Setup branch protection rules | DevOps | 0.5h | 01.4.1 | 🟡 P1 |
| TASK-01.4.4 | Setup Sentry error tracking | DevOps | 1.5h | 01.3.3 | 🟢 P2 |

#### 🎨 Design System Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-02.1.1 | Setup Tailwind CSS + Shadcn UI | Frontend | 1.5h | 01.1.1 | 🔴 P0 |
| TASK-02.1.2 | Implement Color Tokens (DesignFreeze 1.1) | Frontend | 1.5h | 02.1.1 | 🔴 P0 |
| TASK-02.1.3 | Implement Typography System (DesignFreeze 1.2) | Frontend | 1h | 02.1.1 | 🔴 P0 |
| TASK-02.1.4 | Implement Animation System (DesignFreeze 1.8) | Frontend | 1.5h | 02.1.2 | 🔴 P0 |
| TASK-02.2.1 | Build Button component (3 variants × 5 states) | Frontend | 2h | 02.1.2 | 🔴 P0 |
| TASK-02.2.2 | Build Card component | Frontend | 1h | 02.1.2 | 🔴 P0 |
| TASK-02.2.3 | Build RiskBadge component | Frontend | 1h | 02.1.2 | 🔴 P0 |
| TASK-02.2.4 | Build ImmunityRing SVG component | Frontend | 2h | 02.1.4 | 🔴 P0 |
| TASK-02.2.5 | Build ScanInput component | Frontend | 1.5h | 02.1.2 | 🔴 P0 |
| TASK-02.3.1 | Build Root Layout + Dark mode body | Frontend | 1h | 02.1.2 | 🔴 P0 |
| TASK-02.3.2 | Build HUD Overlay component | Frontend | 1.5h | 02.1.4 | 🟡 P1 |
| TASK-02.3.3 | Build Navigation Sidebar | Frontend | 1.5h | 02.3.1 | 🔴 P0 |
| TASK-02.4.1 | Build Hero Section (Landing Page) | Frontend | 2h | 02.1.4 | 🔴 P0 |
| TASK-02.4.2 | Build Feature Showcase (5 Modes cards) | Frontend | 2h | 02.4.1 | 🔴 P0 |

#### 🔐 Auth Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-03.1.1 | Build Auth Context + Provider | Frontend | 2h | 01.2.4 | 🔴 P0 |
| TASK-03.1.2 | Build Login Page UI | Frontend | 1.5h | 03.1.1 | 🔴 P0 |
| TASK-03.1.3 | Build Protected Route middleware | Frontend | 1h | 03.1.1 | 🔴 P0 |
| TASK-03.1.4 | POST /auth/verify API endpoint | Backend | 1.5h | 01.2.3, 01.3.1 | 🔴 P0 |

---

### 📦 Sprint 1 Deliverables

```
✅ Deliverable 1: Working Monorepo
   pnpm dev → web:3000, api:8080, extension:build
   All apps communicate via packages/core types

✅ Deliverable 2: Firebase + Cloud Run Live
   Firebase Auth + Firestore + Security Rules deployed
   API endpoint GET /health → 200 on Cloud Run

✅ Deliverable 3: Design System Complete
   All 14 components built and visually verified
   Landing page live at localhost:3000

✅ Deliverable 4: Auth Flow Working
   Google Sign-in → Dashboard redirect
   Protected routes block unauthenticated access

✅ Deliverable 5: CI/CD Pipeline Active
   Every PR triggers CI (lint + test + build)
   Merge to main → auto-deploy API to Cloud Run
```

---

### 📅 Sprint 1 Ceremonies

| Ceremony | Ngày | Thời gian | Output |
|---|---|---|---|
| **Sprint Planning** | W1 Day 1 (Mon 03/08) | 09:00–13:00 | Sprint backlog confirmed, tasks assigned |
| **Daily Standup** | Mỗi ngày | 09:00–09:15 | Blockers identified, progress shared |
| **Mid-Sprint Sync** | W1 Day 5 (Fri 07/08) | 15:00–15:30 | Velocity check, risk assessment |
| **Sprint Review** | W2 Day 10 (Fri 14/08) | 14:00–16:00 | Demo deliverables to stakeholders |
| **Sprint Retro** | W2 Day 10 (Fri 14/08) | 16:00–17:30 | What worked / what to improve |

---

### ⚠️ Sprint 1 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Firebase setup chậm hơn dự kiến | Medium | High | Dev Lead set up trước trong ngày đầu |
| Tailwind + Shadcn conflict themes | Low | Medium | Test với dummy page trước khi build components |
| Cloud Run cold start timeout | Low | High | Set min-instances=1 cho staging |
| Team unfamiliar với Turborepo | Medium | Medium | 2h walkthrough session đầu sprint |

---

### 📝 Sprint 1 Definition of Done

- [ ] `pnpm dev` chạy 3 apps không lỗi
- [ ] `pnpm test` pass 100% (toàn workspace)
- [ ] `pnpm lint` 0 errors
- [ ] Firebase Security Rules deployed + emulator test pass
- [ ] Cloud Run `/health` → 200
- [ ] CI pipeline: tất cả PRs trong sprint đều pass
- [ ] Landing page live, Google Login hoạt động
- [ ] Sprint Review: demo được cho stakeholder

---

---

## 🟩 SPRINT 2: "The AI Brain Awakens"
### Week 3–4 | 2026-08-17 → 2026-08-28

---

### 🎯 Sprint Goal

> **"Tích hợp Gemini AI hoàn chỉnh: người dùng có thể dán một URL lừa đảo vào web app, nhận về kết quả phân tích với điểm rủi ro, phân loại và giải thích chi tiết bằng tiếng Việt."**

Kết thúc Sprint 2, team có thể demo:
- Dán link lừa đảo → hệ thống scan → hiện Immune Response (🎯 Wow Moment 1)
- Bấm "Tại sao?" → AI Explain hiện red flags rõ ràng
- Toàn bộ AI response trong < 3 giây

---

### 📖 User Stories in Sprint 2

| Story ID | User Story | Story Points | Priority |
|---|---|---|---|
| STORY-03.2 | User Profile & Settings | 5 | 🟡 P1 |
| STORY-04.1 | Gemini AI Service | 8 | 🔴 P0 |
| STORY-04.2 | Detect API Endpoint | 13 | 🔴 P0 |
| STORY-04.3 | Explain API Endpoint | 8 | 🔴 P0 |
| STORY-04.4 | Detect UI — Scan Page | 13 | 🔴 P0 |
| STORY-04.5 | Explain UI | 5 | 🔴 P0 |
| **Total** | | **52 SP** | |

---

### ✅ Task List — Sprint 2

#### 🤖 AI Engine Track (Backend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-04.1.1 | Initialize Gemini SDK + Vertex AI | Backend | 1.5h | 01.3.1 | 🔴 P0 |
| TASK-04.1.2 | Build GeminiService với retry + fallback | Backend | 2h | 04.1.1 | 🔴 P0 |
| TASK-04.1.3 | Implement Threat Intelligence lookup (Firestore) | Backend | 1.5h | 01.2.3 | 🔴 P0 |
| TASK-04.2.1 | Build Detector Agent | Backend | 3h | 04.1.2, 04.1.3 | 🔴 P0 |
| TASK-04.2.2 | POST /scans/analyze endpoint | Backend | 2h | 04.2.1 | 🔴 P0 |
| TASK-04.2.3 | GET /scans + GET /scans/:scanId | Backend | 1h | 04.2.2 | 🟡 P1 |
| TASK-04.3.1 | Build Explain Agent | Backend | 2h | 04.1.2 | 🔴 P0 |
| TASK-04.3.2 | POST /scans/:scanId/explain endpoint | Backend | 2h | 04.3.1, 04.2.2 | 🔴 P0 |

#### 🎯 Scan UI Track (Frontend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-04.4.1 | Build Scan Page layout + ScanInput | Frontend | 2h | 02.2.5 | 🔴 P0 |
| TASK-04.4.2 | Build Scanning State UI (Radar animation) | Frontend | 2h | 02.1.4, 04.4.1 | 🔴 P0 |
| TASK-04.4.3 | Build Scan Result UI — Safe state | Frontend | 1h | 02.2.3, 04.4.2 | 🔴 P0 |
| TASK-04.4.4 | Build Scan Result UI — Threat/Immune Response | Frontend | 2h | 02.2.3, 04.4.2 | 🔴 P0 |
| TASK-04.5.1 | Build Red Flags explanation panel | Frontend | 1.5h | 04.3.2 | 🔴 P0 |
| TASK-04.5.2 | Red flag highlight animation | Frontend | 1.5h | 04.5.1 | 🟡 P1 |

#### 👤 User Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-03.2.1 | GET /users/me endpoint | Backend | 1h | 03.1.4 | 🟡 P1 |
| TASK-03.2.2 | PATCH /users/me/settings endpoint | Backend | 1h | 03.2.1 | 🟡 P1 |
| TASK-03.2.3 | Build Settings Page UI | Frontend | 2h | 03.2.2 | 🟡 P1 |

#### 🧪 Testing Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TEST-04.A | Unit tests: Detector Agent (safe/phishing/malware) | Backend | 2h | 04.2.1 | 🔴 P0 |
| TEST-04.B | Unit tests: Explain Agent | Backend | 1.5h | 04.3.1 | 🔴 P0 |
| TEST-04.C | Integration test: scan → Firestore → response | Backend | 2h | 04.2.2 | 🔴 P0 |
| TEST-04.D | E2E test: paste URL → scan → result visible | QA | 2h | 04.4.4 | 🔴 P0 |

---

### 📦 Sprint 2 Deliverables

```
✅ Deliverable 1: POST /scans/analyze LIVE
   POST request → Gemini processes → JSON response in < 3s
   Threat Intelligence lookup working

✅ Deliverable 2: Scan UI — Complete Flow
   Paste URL → Scanning animation → Threat/Safe result
   Immune Response animation on threat (🎯 Demo Moment 1)

✅ Deliverable 3: Explain Panel
   "Tại sao đây là lừa đảo?" → AI explanation + red flags
   Vietnamese language, clear non-technical language

✅ Deliverable 4: End-to-End Demo Path (Wow Moment 1)
   Demo script works:
   1. Paste fake tax authority SMS → Scan
   2. Immune Response fires (red alert, shake animation)
   3. Click "Explain" → 3 red flags highlighted
```

---

### 📅 Sprint 2 Ceremonies

| Ceremony | Ngày | Thời gian | Output |
|---|---|---|---|
| **Sprint Planning** | W3 Day 1 (Mon 17/08) | 09:00–13:00 | Sprint 2 backlog confirmed |
| **Daily Standup** | Mỗi ngày | 09:00–09:15 | Blockers, progress |
| **Gemini Prompt Tuning Session** | W3 Day 3 (Wed 19/08) | 14:00–16:00 | Optimized prompts for demo |
| **Mid-Sprint Sync** | W3 Day 5 (Fri 21/08) | 15:00–15:30 | AI quality check |
| **Sprint Review** | W4 Day 10 (Fri 28/08) | 14:00–16:00 | Demo: Scan → Immune Response |
| **Sprint Retro** | W4 Day 10 (Fri 28/08) | 16:00–17:30 | Retro + Sprint 3 prep |

---

### ⚠️ Sprint 2 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini response > 3s | Medium | High | Dùng gemini-2.5-flash cho Detect, tối ưu prompt ngắn gọn |
| JSON schema mismatch từ Gemini | High | High | Zod validation + retry logic + fallback response |
| False positive rate cao | Medium | High | Test với 20+ real fraud samples trước Sprint Review |
| Gemini API quota exceeded (demo) | Low | Critical | Set up separate API key cho demo environment |
| Vietnamese language quality thấp | Medium | Medium | Add "respond in Vietnamese" instruction rõ ràng trong prompt |

---

### 📝 Sprint 2 Definition of Done

- [ ] `POST /scans/analyze` trả về JSON đúng schema trong < 3s (P95)
- [ ] Detector Agent: unit test pass cho 5 classification types
- [ ] Explain Agent: Vietnamese output, 150-300 chars explanation
- [ ] Scan UI: safe state + threat state render đúng
- [ ] Immune Response animation hoạt động khi threat detected
- [ ] E2E test: paste real phishing URL → result correct
- [ ] False positive test: google.com → classification = "safe"
- [ ] Demo script works end-to-end (Wow Moment 1 reproducible)

---

---

## 🟨 SPRINT 3: "The Theater of Consequences"
### Week 5–6 | 2026-09-01 → 2026-09-12

---

### 🎯 Sprint Goal

> **"Hoàn thiện Consequence Simulation (Wow Moment 2) với Theater Mode đầy đủ hiệu ứng, đồng thời khởi động Chrome Extension để bảo vệ thời gian thực."**

Kết thúc Sprint 3, team có thể demo:
- Click "Nếu tôi tin thì sao?" → Theater Mode → AI mô phỏng 3 bước hậu quả → Particle dissolve
- Chrome Extension installed → detect threat URL → popup cảnh báo

---

### 📖 User Stories in Sprint 3

| Story ID | User Story | Story Points | Priority |
|---|---|---|---|
| STORY-05.1 | Simulation API | 13 | 🔴 P0 |
| STORY-05.2 | Simulation Theater UI | 13 | 🔴 P0 |
| STORY-05.3 | Simulation Trigger Flow | 5 | 🔴 P0 |
| STORY-06.1 | Extension Foundation | 8 | 🟡 P1 |
| STORY-06.2 | Extension Scan & Warning | 8 | 🟡 P1 |
| **Total** | | **47 SP** | |

> *Sprint 3 nhẹ hơn một chút để dành buffer cho Polish và Testing*

---

### ✅ Task List — Sprint 3

#### 🎭 Simulation API Track (Backend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-05.1.1 | Build Simulator Agent | Backend | 2.5h | 04.1.2 | 🔴 P0 |
| TASK-05.1.2 | POST /scans/:scanId/simulate endpoint | Backend | 1.5h | 05.1.1, 04.2.2 | 🔴 P0 |
| TASK-05.1.3 | GET /scans/:scanId/simulation endpoint | Backend | 1h | 05.1.2 | 🟡 P1 |
| TEST-05.A | Unit tests: Simulator Agent (phishing/scam/malware) | Backend | 2h | 05.1.1 | 🔴 P0 |
| TEST-05.B | Integration test: scan → simulate → Firestore | Backend | 1.5h | 05.1.2 | 🔴 P0 |

#### 🎬 Theater Mode UI Track (Frontend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-05.2.1 | Build Theater Mode overlay | Frontend | 2h | 02.1.4 | 🔴 P0 |
| TASK-05.2.2 | Build Consequence Timeline component | Frontend | 3h | 05.2.1 | 🔴 P0 |
| TASK-05.2.3 | Build Simulation loading state | Frontend | 1h | 05.2.1 | 🔴 P0 |
| TASK-05.2.4 | Particle dissolve effect | Frontend | 2h | 05.2.2 | 🟡 P1 |
| TASK-05.3.1 | Wire "Simulate" CTA → Theater Mode | Frontend | 2h | 04.4.4, 05.2.1 | 🔴 P0 |

#### 🔌 Chrome Extension Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-06.1.1 | Initialize Chrome Extension với CRXJS + Vite | Extension | 2h | 01.1.1 | 🟡 P1 |
| TASK-06.1.2 | Implement Background Service Worker | Extension | 2h | 06.1.1 | 🟡 P1 |
| TASK-06.1.3 | Implement Content Script (DOM monitor) | Extension | 1.5h | 06.1.2 | 🟡 P1 |
| TASK-06.2.1 | Connect Extension to API for URL scanning | Extension | 2h | 06.1.2, 04.2.2 | 🟡 P1 |
| TASK-06.2.2 | Build Extension Popup UI | Extension | 2h | 06.2.1 | 🟡 P1 |
| TASK-06.2.3 | Implement URL blocking (content script) | Extension | 1.5h | 06.2.2 | 🟡 P1 |

#### 🧪 QA Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TEST-05.C | E2E: threat scan → click Simulate → Theater plays | QA | 2h | 05.3.1 | 🔴 P0 |
| TEST-05.D | Visual test: Theater Mode animation timing correct | QA | 1h | 05.2.2 | 🔴 P0 |
| TEST-06.A | Manual test: Extension detects known phishing URL | QA | 1.5h | 06.2.2 | 🟡 P1 |

---

### 📦 Sprint 3 Deliverables

```
✅ Deliverable 1: POST /scans/:scanId/simulate LIVE
   API generates 3-step consequence in < 5s
   Vietnamese narrative, potential loss estimate

✅ Deliverable 2: Theater Mode — Complete
   Click "Simulate" → Theater Mode (800ms fade)
   3 steps reveal sequentially (1.5s intervals)
   Particle dissolve at closing message
   (🎯 Demo Moment 2 — complete and demo-ready)

✅ Deliverable 3: Full Demo Script Works
   Demo script từ MVP.md hoạt động đầu cuối:
   Hook → Explain (Wow 1) → Simulate (Wow 2)

✅ Deliverable 4: Chrome Extension MVP
   Extension installs in Chrome
   Navigating to known threat URL → popup warning
   URL blocking works (with auto-block permission)
```

---

### 📅 Sprint 3 Ceremonies

| Ceremony | Ngày | Thời gian | Output |
|---|---|---|---|
| **Sprint Planning** | W5 Day 1 (Mon 01/09) | 09:00–13:00 | Sprint 3 backlog confirmed |
| **Daily Standup** | Mỗi ngày | 09:00–09:15 | Blockers, progress |
| **Demo Dry Run #1** | W5 Day 5 (Fri 05/09) | 15:00–16:00 | Test demo script lần đầu |
| **Mid-Sprint Sync** | W5 Day 5 (Fri 05/09) | 14:00–15:00 | Velocity, risks |
| **Simulation QA Session** | W6 Day 8 (Tue 09/09) | 14:00–16:00 | Test 10 fraud scenarios |
| **Sprint Review** | W6 Day 10 (Fri 12/09) | 14:00–16:00 | Full demo: Scan + Simulate + Extension |
| **Sprint Retro** | W6 Day 10 (Fri 12/09) | 16:00–17:30 | Retro + Sprint 4 prep |

---

### ⚠️ Sprint 3 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Simulation timeline animation janky | Medium | High | Test trên multiple browsers (Chrome, Safari, Firefox) |
| Extension Service Worker killed by Chrome | Medium | Medium | Heartbeat ping every 20s |
| Particle effect causes performance drop | Low | Medium | Limit to 20 particles, use CSS transforms |
| Simulate API > 5s timeout | Medium | High | Stream response via SSE nếu cần |
| Extension CORS block | Medium | High | Configure Cloud Run CORS cho extension:// origin |

---

### 📝 Sprint 3 Definition of Done

- [ ] Theater Mode animation: 800ms fade → 3 steps sequential → closing message
- [ ] Particle dissolve triggers on closing message
- [ ] `prefers-reduced-motion`: Theater Mode instant, no animation
- [ ] Simulator Agent: no real names in output (regex test pass)
- [ ] P95 simulate response < 5s (measured with k6)
- [ ] Extension loads in Chrome without console errors
- [ ] Extension popup shows threat for known phishing URL
- [ ] Full demo script (Wow 1 + Wow 2) reproducible in < 2 minutes

---

---

## 🟧 SPRINT 4: "Protection & Training Activated"
### Week 7–8 | 2026-09-15 → 2026-09-26

---

### 🎯 Sprint Goal

> **"Hoàn thiện Chrome Extension với real-time protection đầy đủ, đồng thời xây dựng Training Mode để người dùng học cách nhận diện lừa đảo và tích điểm Immunity Score."**

Kết thúc Sprint 4, team có thể demo:
- Extension chặn link lừa đảo tức thì, HUD hiện đỏ, page replaced
- User chơi Training drill, nhận badge "Antibody Level 1"
- Immunity Score tăng sau mỗi drill

---

### 📖 User Stories in Sprint 4

| Story ID | User Story | Story Points | Priority |
|---|---|---|---|
| STORY-06.3 | Extension Auth Integration | 5 | 🟡 P1 |
| STORY-07.1 | Training API | 13 | 🟡 P1 |
| STORY-07.2 | Training UI | 13 | 🟡 P1 |
| STORY-07.3 | Immunity Dashboard (partial) | 8 | 🔴 P0 |
| **Total** | | **39 SP** | |

> *Sprint 4 có SP thấp hơn — buffer cho polish, edge cases và performance tuning*

---

### ✅ Task List — Sprint 4

#### 🔐 Extension Auth Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-06.3.1 | Firebase Auth trong Extension | Extension | 2h | 03.1.1 | 🟡 P1 |
| TASK-06.3.2 | Build Extension Onboarding popup | Extension | 1h | 06.3.1 | 🟡 P1 |

#### 🎓 Training API Track (Backend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-07.1.1 | Build Trainer Agent | Backend | 2.5h | 04.1.2 | 🟡 P1 |
| TASK-07.1.2 | POST /training/sessions endpoint | Backend | 1.5h | 07.1.1 | 🟡 P1 |
| TASK-07.1.3 | POST /training/sessions/:id/submit endpoint | Backend | 1.5h | 07.1.2 | 🟡 P1 |
| TEST-07.A | Unit tests: Trainer Agent (easy/medium/hard) | Backend | 2h | 07.1.1 | 🟡 P1 |
| TEST-07.B | Integration test: start session → submit → score | Backend | 1.5h | 07.1.3 | 🟡 P1 |

#### 🧑‍🏫 Training UI Track (Frontend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-07.2.1 | Build Training Center page | Frontend | 1.5h | 07.1.2 | 🟡 P1 |
| TASK-07.2.2 | Build Drill Session UI (quiz interface) | Frontend | 2.5h | 07.2.1 | 🟡 P1 |
| TASK-07.2.3 | Build Result + Badge Award animation | Frontend | 2h | 07.2.2 | 🟡 P1 |

#### 📊 Dashboard Track (Frontend + Backend)

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-07.3.1 | GET /metrics/summary endpoint | Backend | 2h | 04.2.2 | 🔴 P0 |
| TASK-07.3.2 | Build Dashboard main page | Frontend | 3h | 07.3.1, 02.2.4 | 🔴 P0 |

#### 🛡️ Extension Polish Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| EXT-POLISH-1 | Debounce extension scans (60s cache) | Extension | 1h | 06.2.1 | 🟡 P1 |
| EXT-POLISH-2 | Handle unauthenticated state gracefully | Extension | 1h | 06.3.1 | 🟡 P1 |
| EXT-POLISH-3 | HUD overlay polish — transitions smooth | Extension | 1h | 02.3.2 | 🟡 P1 |

#### 🧪 QA Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TEST-07.C | E2E: Training drill full flow | QA | 2h | 07.2.3 | 🟡 P1 |
| TEST-07.D | Performance test: Dashboard load < 2s | QA | 1h | 07.3.2 | 🔴 P0 |
| TEST-EXT.A | Manual test: Auto-block on 5 real phishing URLs | QA | 1.5h | 06.2.3 | 🟡 P1 |

---

### 📦 Sprint 4 Deliverables

```
✅ Deliverable 1: Chrome Extension — Full Protect Mode
   Threat URL → HUD flashes red → page blocked
   Auto-block works (with permission)
   Extension auth flow complete

✅ Deliverable 2: Training Mode — Complete
   Start drill → AI generates scenario → Quiz
   Submit answers → Score + Badge animation
   Immunity Score updates on Dashboard

✅ Deliverable 3: Dashboard Live
   ImmunityRing shows real trust_score
   30-day metrics visible (scans, threats, safe)
   HUD overlay active (green pulse)

✅ Deliverable 4: Demo Segment 3 Ready
   Extension blocks link mid-browsing (Demo closing)
   Training badge "Antibody Level 1" earnable
```

---

### 📅 Sprint 4 Ceremonies

| Ceremony | Ngày | Thời gian | Output |
|---|---|---|---|
| **Sprint Planning** | W7 Day 1 (Mon 15/09) | 09:00–13:00 | Sprint 4 backlog confirmed |
| **Daily Standup** | Mỗi ngày | 09:00–09:15 | Blockers, progress |
| **Demo Dry Run #2** | W7 Day 5 (Fri 19/09) | 15:00–16:30 | Full 3-part demo rehearsal |
| **Mid-Sprint Sync** | W7 Day 5 (Fri 19/09) | 14:00–15:00 | Velocity check |
| **Badge Design Review** | W8 Day 6 (Mon 22/09) | 14:00–15:00 | Badge visuals approved |
| **Sprint Review** | W8 Day 10 (Fri 26/09) | 14:00–16:00 | Demo: Full product flow |
| **Sprint Retro** | W8 Day 10 (Fri 26/09) | 16:00–17:30 | Final retro before Sprint 5 |

---

### ⚠️ Sprint 4 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Trainer Agent generates boring scenarios | Medium | High | Review 10 generated scenarios manually, tune prompts |
| Dashboard Firestore read cost high | Medium | Medium | Aggregate metrics daily via Cloud Scheduler, not real-time |
| Badge animation not impressive enough | Low | High | A/B test 2 animation styles, pick WOW one |
| Extension auth breaks between browser restarts | Medium | High | Token refresh logic test on extension reload |
| Training score calculation bug | Medium | Medium | Unit test edge cases: all correct, all wrong, partial |

---

### 📝 Sprint 4 Definition of Done

- [ ] Extension auto-blocks threat URL trong < 300ms
- [ ] Training drill: start → quiz → submit → score → badge works end-to-end
- [ ] Badge award animation plays for score ≥ 80
- [ ] GET /metrics/summary returns correct 30-day data
- [ ] Dashboard renders with real Firestore data (no hardcoded values)
- [ ] trust_score updates after training session submit
- [ ] Demo Dry Run #2: full 3-segment demo completes in < 4 minutes

---

---

## 🟥 SPRINT 5: "Polish, QA & Competition Ready"
### Week 9–10 | 2026-09-29 → 2026-10-10

---

### 🎯 Sprint Goal

> **"Đánh bóng toàn bộ sản phẩm, fix mọi bug quan trọng, tối ưu performance, và rehearsal demo đến mức có thể trình bày trước ban giám khảo AI Riser Vietnam một cách tự tin và ấn tượng."**

Kết thúc Sprint 5:
- Không có bug P0 mở
- Lighthouse Performance > 85 trên tất cả trang
- Demo script < 3 phút, rehearse 5 lần, không có bước nào bị lỗi
- Extension submitted to Chrome Web Store (staging)

---

### 📖 User Stories in Sprint 5

| Story ID | User Story | Story Points | Priority |
|---|---|---|---|
| STORY-07.4 | Scan History Page | 3 | 🟢 P2 |
| POLISH-01 | Performance Optimization | 8 | 🔴 P0 |
| POLISH-02 | Accessibility Audit & Fix | 5 | 🟡 P1 |
| POLISH-03 | Error Handling & Edge Cases | 8 | 🔴 P0 |
| POLISH-04 | Security Audit | 5 | 🔴 P0 |
| DEMO-01 | Demo Script Polish & Rehearsal | 8 | 🔴 P0 |
| DEMO-02 | Judge Q&A Preparation | 5 | 🟡 P1 |
| **Total** | | **42 SP** | |

---

### ✅ Task List — Sprint 5

#### 📄 Remaining Features Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| TASK-07.4.1 | Build History page (paginated) | Frontend | 2h | 04.2.3 | 🟢 P2 |
| TASK-07.4.2 | Build Scan Detail page | Frontend | 1h | 04.2.3 | 🟢 P2 |

#### ⚡ Performance Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| PERF-01 | Lighthouse audit: mọi trang ≥ 85 | Frontend | 2h | — | 🔴 P0 |
| PERF-02 | Next.js bundle analysis: reduce bundle size | Frontend | 2h | PERF-01 | 🔴 P0 |
| PERF-03 | Image optimization (next/image, WebP) | Frontend | 1h | — | 🟡 P1 |
| PERF-04 | API response caching (Redis/memory) cho hot paths | Backend | 2h | — | 🟡 P1 |
| PERF-05 | Scan response streaming via SSE (optional) | Backend | 3h | 04.2.2 | 🟡 P1 |
| PERF-06 | k6 load test: 100 concurrent users | QA | 2h | — | 🔴 P0 |

#### ♿ Accessibility Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| A11Y-01 | axe-core audit: fix all Level A violations | Frontend | 2h | — | 🟡 P1 |
| A11Y-02 | Keyboard navigation test: all flows | QA | 1.5h | — | 🟡 P1 |
| A11Y-03 | Screen reader test (NVDA/VoiceOver) | QA | 1.5h | — | 🟡 P1 |
| A11Y-04 | Verify color contrast ≥ 4.5:1 all text | Frontend | 1h | — | 🟡 P1 |

#### 🔒 Security Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| SEC-01 | OWASP Top 10 audit cho API | Security | 2h | — | 🔴 P0 |
| SEC-02 | Verify Firestore rules: penetration test | Security | 2h | 01.2.2 | 🔴 P0 |
| SEC-03 | Rate limiting test: 429 triggers correctly | QA | 1h | — | 🔴 P0 |
| SEC-04 | Input sanitization: XSS test on scan input | Security | 1.5h | — | 🔴 P0 |
| SEC-05 | Extension permissions audit (minimal permissions) | Security | 1h | 06.1.1 | 🟡 P1 |

#### 🐛 Bug Fix Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| BUG-HUNT-1 | Full regression test + bug log | QA | 3h | — | 🔴 P0 |
| BUG-FIX-* | Fix tất cả P0/P1 bugs từ regression | Team | variable | BUG-HUNT-1 | 🔴 P0 |

#### 🎤 Demo Preparation Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| DEMO-01 | Viết và lock demo script final (3 phút) | PM | 2h | — | 🔴 P0 |
| DEMO-02 | Chuẩn bị dữ liệu demo: real Vietnamese fraud samples | PM | 1.5h | — | 🔴 P0 |
| DEMO-03 | Demo Rehearsal lần 1 (full team) | All | 1.5h | DEMO-01 | 🔴 P0 |
| DEMO-04 | Demo Rehearsal lần 2 (timed, < 3 phút) | All | 1.5h | DEMO-03 | 🔴 P0 |
| DEMO-05 | Demo Rehearsal lần 3 (final, cold run) | All | 1.5h | DEMO-04 | 🔴 P0 |
| DEMO-06 | Chuẩn bị slides / pitch deck backup | PM | 3h | — | 🟡 P1 |
| DEMO-07 | Judge Q&A: 30 anticipated questions + answers | All | 2h | — | 🟡 P1 |
| DEMO-08 | Tạo video demo backup (phòng khi live demo lỗi) | PM | 2h | — | 🔴 P0 |

#### 🚀 Release Track

| Task ID | Task | Assign | Est | Dep | Priority |
|---|---|---|---|---|---|
| REL-01 | Tag release: `v1.0.0-demo` trên GitHub | Dev Lead | 0.5h | — | 🔴 P0 |
| REL-02 | Deploy production build lên Cloud Run | DevOps | 1h | — | 🔴 P0 |
| REL-03 | Extension: package và test install từ .crx | Extension | 1h | — | 🔴 P0 |
| REL-04 | Setup demo environment (separate GCP project) | DevOps | 2h | — | 🔴 P0 |
| REL-05 | Smoke test production environment | QA | 1.5h | REL-02 | 🔴 P0 |

---

### 📦 Sprint 5 Deliverables

```
✅ Deliverable 1: Zero P0 Bugs
   Full regression pass
   All critical paths tested
   No unhandled errors in 1-hour stress test

✅ Deliverable 2: Performance Targets Met
   Lighthouse Performance ≥ 85 (all pages)
   API P95 Detect: < 2s
   Dashboard load: < 2s
   Extension popup open: < 200ms

✅ Deliverable 3: Security Cleared
   OWASP audit pass
   Firestore rules: no unauthorized access
   Rate limits: 429 fires correctly

✅ Deliverable 4: Demo-Ready Product
   v1.0.0-demo tagged on GitHub
   Production deployed on Cloud Run
   Extension packaged and installable
   Video demo backup ready

✅ Deliverable 5: Demo Script — Competition-Ready
   3 rehearsals completed
   Script runs in < 3 minutes
   Q&A preparation: 30 questions answered
   Judge checklist: 100% covered
```

---

### 📅 Sprint 5 Ceremonies

| Ceremony | Ngày | Thời gian | Output |
|---|---|---|---|
| **Sprint Planning** | W9 Day 1 (Mon 29/09) | 09:00–11:00 | Sprint 5 backlog (lighter, focus QA) |
| **Daily Standup** | Mỗi ngày | 09:00–09:15 | Bugs, blockers |
| **Bug Bash Session** | W9 Day 2 (Tue 30/09) | 14:00–17:00 | Tất cả team test cùng lúc |
| **Performance Review** | W9 Day 4 (Thu 02/10) | 14:00–15:30 | Lighthouse results, action items |
| **Security Review** | W9 Day 5 (Fri 03/10) | 14:00–15:30 | OWASP findings, fixes |
| **Demo Rehearsal #1** | W10 Day 6 (Mon 06/10) | 14:00–15:30 | First full rehearsal |
| **Demo Rehearsal #2** | W10 Day 8 (Wed 08/10) | 14:00–15:30 | Timed rehearsal |
| **Demo Rehearsal #3** | W10 Day 9 (Thu 09/10) | 14:00–15:30 | Final cold run |
| **Sprint Review** | W10 Day 10 (Fri 10/10) | 10:00–12:00 | Final product demo to stakeholders |
| **Release Celebration** | W10 Day 10 (Fri 10/10) | 17:00–19:00 | 🎉 Team celebration |

---

### ⚠️ Sprint 5 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live demo fails (network issue) | Medium | Critical | Video backup ready + offline demo mode |
| Gemini API down during demo | Low | Critical | Pre-cache 3 demo scenarios, fallback to cached response |
| Extension rejected by Chrome | Low | High | Use unpacked extension mode for demo (no store needed) |
| Performance regressions from late features | Medium | High | Lock features at W9 Day 3, no new code after that |
| Judge asks unsupported question | Medium | Medium | Prepare 30 Q&A, practice pivoting gracefully |
| Production DB has stale/no data | Low | Medium | Seed demo data on production before competition |

---

### 📝 Sprint 5 Definition of Done

- [ ] `v1.0.0-demo` tag exists on GitHub
- [ ] Production Cloud Run deployment live and stable
- [ ] Extension installable from `.crx` file
- [ ] Lighthouse Performance ≥ 85 (mobile + desktop)
- [ ] 0 open P0 bugs
- [ ] 0 open security vulnerabilities (High/Critical)
- [ ] Demo script < 3 minutes (timed)
- [ ] Video backup recorded and accessible
- [ ] Judge Q&A doc: 30 questions with answers
- [ ] All 5 AI Modes demo-able in one session
- [ ] Team confidence: everyone can demo any part

---

---

## 📊 Velocity & Capacity Planning

### Story Points per Sprint

```
Sprint 1: 52 SP  ████████████████████████████░░░░░ Foundation heavy
Sprint 2: 52 SP  ████████████████████████████░░░░░ AI Engine heavy
Sprint 3: 47 SP  ██████████████████████████░░░░░░░ Simulation + Ext start
Sprint 4: 39 SP  ████████████████████░░░░░░░░░░░░░ Training + buffer
Sprint 5: 42 SP  ████████████████████░░░░░░░░░░░░░ QA + Demo Prep
─────────────────────────────────────────────────
Total:   232 SP  Average: 46.4 SP / sprint
```

### Effort Breakdown

| Domain | Total Hours | % |
|---|---|---|
| Backend (API + AI Agents) | ~72h | 37% |
| Frontend (Web App UI) | ~64h | 33% |
| Chrome Extension | ~24h | 12% |
| QA & Testing | ~20h | 10% |
| DevOps & Infrastructure | ~16h | 8% |
| **Total** | **~196h** | 100% |

---

## 📋 Agile Ceremonies Cheat Sheet

### Daily Standup Format (15 phút)

Mỗi thành viên trả lời:
1. **Yesterday**: Hôm qua tôi đã hoàn thành gì?
2. **Today**: Hôm nay tôi sẽ làm gì?
3. **Blocker**: Có điều gì đang chặn tôi không?

> Rule: Không problem-solving trong standup. Offline sau standup.

---

### Sprint Planning Agenda (4 giờ)

```
Hour 1: Sprint Goal alignment
  - PM presents sprint goal
  - Team confirms feasibility
  - Goal refined to 1 clear sentence

Hour 2: Story walkthrough
  - PM walks through stories
  - Team asks clarifying questions
  - Stories accepted/rejected into sprint

Hour 3: Task breakdown + estimation
  - Team breaks stories into tasks
  - Estimate each task (Fibonacci SP)
  - Assign owners

Hour 4: Commitment + risk review
  - Final sprint backlog confirmed
  - Risks logged
  - Sprint board updated
```

---

### Sprint Review Agenda (2 giờ)

```
15m: Sprint metrics recap (velocity, burndown)
45m: Demo of completed stories (Scrum Master facilitates)
30m: Stakeholder feedback (questions, suggestions)
30m: Product Backlog grooming (next sprint items)
```

---

### Sprint Retrospective Agenda (1.5 giờ)

```
Method: Start / Stop / Continue

15m: Individual reflection (silent writing)
30m: Share findings per category
  ✅ Continue: What's working well?
  🛑 Stop: What's hurting the team?
  🆕 Start: What should we try?
30m: Vote on top 3 action items
15m: Assign owners + deadlines for action items
```

---

## 🔗 Tài liệu liên quan

| Tài liệu | Link |
|---|---|
| Product Backlog | [ProductBacklog.md](./ProductBacklog.md) |
| Design Freeze | [DesignFreeze.md](../DesignFreeze.md) |
| MVP Definition | [MVP.md](../01_Product/MVP.md) |
| Feature List | [FeatureList.md](../01_Product/FeatureList.md) |
| API Reference | [APIReference.md](../14_API/APIReference.md) |
| Database Schema | [DatabaseSchema.md](../11_Database/DatabaseSchema.md) |
| AI Agents | [AgentArchitecture.md](../10_Agent/AgentArchitecture.md) |
| Demo Flow | [DemoScript.md](../19_Demo/DemoScript.md) |
