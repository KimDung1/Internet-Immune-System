# 🌐 REST API DESIGN — Internet Immune System
### Version: v1 | Base: `https://api.immune-system.vn/v1` | Spec: OpenAPI 3.1
### Source: [DesignFreeze.md §3](../DesignFreeze.md) | Stack: Node.js + Hono.js + Cloud Run

---

## 📋 Table of Contents

1. [Base Configuration](#1-base-configuration)
2. [Authentication Flow](#2-authentication)
3. [Standard Envelope](#3-response-envelope)
4. [Error Codes](#4-error-codes)
5. [Rate Limits](#5-rate-limits)
6. [API Modules](#6-api-modules)
   - [POST /auth/verify](#auth)
   - [POST /scans/analyze](#scans--threat-analysis)
   - [GET /scans](#history)
   - [POST /scans/:id/simulate](#simulation)
   - [POST /scans/:id/explain](#recommendation--explain)
   - [GET /reports/threats](#community)
   - [POST /training/sessions](#vaccination--training)
   - [GET /users/me](#user--metrics)
7. [WebSocket Protocol](#7-websocket-real-time-scan)
8. [OpenAPI 3.1 Specification](#8-openapi-31-yaml)

---

## 1. Base Configuration

```
Base URL:     https://api.immune-system.vn/v1
Protocol:     HTTPS only (HTTP → 301 redirect)
Auth:         Firebase JWT — Authorization: Bearer <token>
Content-Type: application/json
Charset:      UTF-8
Versioning:   URI-based (/v1/, /v2/)
Timezone:     UTC (all timestamps ISO 8601)
CORS Origins: https://*.immune-system.vn
              chrome-extension://*
              (localhost:3000 — development only)
```

### Middleware Stack (Execution Order)
```
Request →
  [1] CORS                 → origin whitelist
  [2] Rate Limiter         → token-bucket per user
  [3] Request ID           → inject X-Request-ID if missing
  [4] Auth Guard           → verify Firebase JWT
  [5] Request Logger       → Cloud Logging
  [6] Body Validator       → Zod schema validation
  [7] Route Handler        → business logic
  [8] Response Formatter   → wrap in standard envelope
  [9] Error Handler        → map errors to standard format
→ Response
```

### Required Headers
```http
Authorization: Bearer <Firebase_ID_Token>
Content-Type: application/json
X-Request-ID: <uuid-v4>          (optional — for tracing, auto-generated if missing)
Accept-Language: vi               (optional — response language hint)
```

---

## 2. Authentication

### How It Works

```
Client                    Backend                 Firebase Auth
  │                          │                         │
  │ 1. Google Sign-In        │                         │
  │ ─────────────────────────────────────────────────► │
  │                          │                         │
  │ 2. Firebase ID Token     │                         │
  │ ◄───────────────────────────────────────────────── │
  │                          │                         │
  │ 3. POST /auth/verify     │                         │
  │   Authorization: Bearer <token>                    │
  │ ──────────────────────► │                         │
  │                          │ 4. verifyIdToken()      │
  │                          │ ──────────────────────► │
  │                          │                         │
  │                          │ 5. Decoded UID + email  │
  │                          │ ◄────────────────────── │
  │                          │                         │
  │                          │ 6. Upsert users/{uid}   │
  │                          │    in Firestore          │
  │                          │                         │
  │ 7. User profile + trustScore                       │
  │ ◄────────────────────── │                         │
```

### Token Expiry & Refresh
- Firebase ID Token: **1 hour** expiry
- Client must call `firebase.auth().currentUser.getIdToken(true)` to refresh
- Backend returns `401 UNAUTHORIZED` on expired token
- Client SDK handles auto-refresh transparently

---

## 3. Response Envelope

> **Every response — success or error — MUST use this exact structure.**

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "timestamp": "2026-08-03T13:49:52.000Z",
    "processingMs": 1842
  }
}
```

### Error Response
```json
{
  "status": "error",
  "data": null,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 60 giây.",
    "details": {
      "retryAfterSeconds": 60,
      "limit": "30 requests/minute"
    }
  },
  "meta": {
    "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "timestamp": "2026-08-03T13:49:52.000Z",
    "processingMs": 12
  }
}
```

### Paginated List Response
```json
{
  "status": "success",
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 248,
      "limit": 20,
      "offset": 0,
      "hasMore": true,
      "nextCursor": "eyJ0aW1lc3RhbXAiOiIyMDI2LTA4LTAzVDEzOjQ5OjUyWiJ9"
    }
  },
  "error": null,
  "meta": { ... }
}
```

---

## 4. Error Codes

| Code | HTTP Status | Message (VN) | When |
|---|---|---|---|
| `UNAUTHORIZED` | 401 | Token không hợp lệ hoặc đã hết hạn | Missing/expired JWT |
| `FORBIDDEN` | 403 | Bạn không có quyền truy cập tài nguyên này | JWT valid, wrong ownership |
| `NOT_FOUND` | 404 | Không tìm thấy tài nguyên | Document doesn't exist |
| `INVALID_INPUT` | 400 | Dữ liệu đầu vào không hợp lệ | Zod validation failed |
| `INVALID_URL` | 400 | URL không đúng định dạng | Malformed URL |
| `CONTENT_TOO_LONG` | 413 | Nội dung vượt quá 4000 ký tự | Input > 4000 chars |
| `RATE_LIMITED` | 429 | Quá nhiều yêu cầu — thử lại sau {n} giây | Rate limit exceeded |
| `GEMINI_TIMEOUT` | 504 | AI phân tích quá thời gian cho phép | Gemini > 10s timeout |
| `GEMINI_SAFETY_BLOCK` | 422 | Nội dung bị AI từ chối do chính sách an toàn | Gemini safety filter |
| `SCAN_NOT_FOUND` | 404 | Lịch sử quét không tồn tại | scanId doesn't exist |
| `SESSION_EXPIRED` | 410 | Phiên luyện tập đã hết hạn (24h) | Training session expired |
| `INTERNAL_ERROR` | 500 | Lỗi hệ thống. Vui lòng thử lại sau | Uncaught exception |

---

## 5. Rate Limits

| Endpoint | Limit | Window | Strategy |
|---|---|---|---|
| `POST /scans/analyze` | 30 requests | per minute per user | Token bucket |
| `POST /training/sessions` | 10 sessions | per day per user | Fixed window |
| `POST /training/sessions/:id/submit` | 3 attempts | per session | Per-resource |
| `POST /reports` | 5 reports | per hour per user | Token bucket |
| `POST /auth/verify` | 10 requests | per minute per IP | IP-based |
| All other endpoints | 100 requests | per minute per user | Token bucket |

### Rate Limit Response Headers
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1722690000
Retry-After: 47
```

---

## 6. API Modules

---

### AUTH

---

#### `POST /auth/verify`
Verify Firebase ID Token và upsert user record. Gọi sau mỗi lần đăng nhập.

**Auth**: Required (Firebase ID Token)

**Request Body**: None (token in Authorization header)

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "uid": "gAbC12dEfGhIjKlM3nOpQ",
    "email": "nguyenvana@gmail.com",
    "displayName": "Nguyễn Văn An",
    "photoUrl": "https://lh3.googleusercontent.com/a/photo.jpg",
    "trustScore": 76,
    "antibodyLevel": 2,
    "badges": ["phishing_awareness_v1", "first_scan_v1"],
    "totalScans": 248,
    "threatsBlocked": 31,
    "isNewUser": false,
    "settings": {
      "alertsEnabled": true,
      "autoBlock": false,
      "language": "vi",
      "sensitivity": "balanced",
      "extensionActive": true
    }
  },
  "error": null,
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601", "processingMs": 124 }
}
```

**Errors**: `401 UNAUTHORIZED`, `500 INTERNAL_ERROR`

---

#### `DELETE /auth/session`
Sign out — revoke current refresh token.

**Auth**: Required

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": { "message": "Đăng xuất thành công" },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `401 UNAUTHORIZED`

---

### SCANS — THREAT ANALYSIS

---

#### `POST /scans/analyze`
Gửi nội dung nghi ngờ để AI phân tích. Core endpoint của toàn hệ thống.

**Auth**: Required
**Rate Limit**: 30/min/user

**Request Body:**
```json
{
  "contentType": "url | email | text | dom",
  "contentData": "http://vietcombank-secure-login.ph/dang-nhap",
  "context": "Received via Zalo message from unknown number"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `contentType` | enum | ✅ | `url \| email \| text \| dom` |
| `contentData` | string | ✅ | 1–4000 chars |
| `context` | string | ❌ | max 500 chars, user-provided hint |

**Processing Flow:**
```
1. Normalize + hash contentData
2. Check Firestore threat_intelligence (instant blacklist hit)
   → If hit: return cached result (skip AI, <50ms)
3. Call Gemini 2.5 Flash with Detect prompt
4. Parse + validate Gemini response
5. Write scan_result to Firestore
6. Return result
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "scanId": "sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "riskScore": 87,
    "classification": "phishing",
    "confidence": 0.94,
    "geminiExplanation": "Đây là trang giả mạo Vietcombank. Domain vietcombank-secure-login.ph không phải tên miền ngân hàng chính thức. Trang có form đăng nhập thu thập thông tin thẻ ngân hàng.",
    "redFlags": [
      {
        "id": "fake_domain",
        "label": "Fake Domain Spoofing",
        "severity": "critical",
        "description": "Domain giả mạo ngân hàng chính thức"
      },
      {
        "id": "no_https",
        "label": "Không có HTTPS",
        "severity": "high",
        "description": "HTTP không mã hóa — ngân hàng thật không dùng HTTP"
      }
    ],
    "actionRecommendation": "BLOCK",
    "detectionSource": "ai",
    "processingMs": 1842,
    "threatIntelHit": false
  },
  "error": null,
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601", "processingMs": 1842 }
}
```

**Errors**: `400 INVALID_INPUT`, `400 INVALID_URL`, `413 CONTENT_TOO_LONG`, `422 GEMINI_SAFETY_BLOCK`, `429 RATE_LIMITED`, `504 GEMINI_TIMEOUT`

---

#### `GET /scans/:scanId`
Lấy chi tiết một kết quả quét.

**Auth**: Required (owner only)
**Path Params**: `scanId` — UUID của scan_result

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "scanId": "sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "inputType": "url",
    "inputValue": "http://vietcombank-secure-login.ph/dang-nhap",
    "riskScore": 87,
    "classification": "phishing",
    "confidence": 0.94,
    "geminiExplanation": "...",
    "redFlags": [ ... ],
    "actionRecommendation": "BLOCK",
    "modelUsed": "gemini-2.5-flash",
    "detectionSource": "ai",
    "source": "web",
    "simulationId": null,
    "timestamp": "2026-08-03T13:30:00Z",
    "processingMs": 1842
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 SCAN_NOT_FOUND`

---

### HISTORY

---

#### `GET /scans`
Lịch sử tất cả lần quét của user (có phân trang, filter).

**Auth**: Required
**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | int | 20 | Items per page (max 100) |
| `cursor` | string | — | Opaque pagination cursor |
| `classification` | enum | all | Filter: `safe \| phishing \| malware \| scam \| suspicious` |
| `source` | enum | all | Filter: `web \| extension \| api` |
| `from` | ISO date | — | Start date filter |
| `to` | ISO date | — | End date filter |
| `sortBy` | enum | `timestamp` | `timestamp \| riskScore` |
| `order` | enum | `desc` | `asc \| desc` |

**Example:**
```
GET /scans?limit=20&classification=phishing&from=2026-07-01&cursor=eyJ0aW1lc3RhbXAiO...
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "scanId": "sr_9f3a2b1c-...",
        "inputType": "url",
        "inputPreview": "http://vietcombank-secure-login.ph/...",
        "riskScore": 87,
        "classification": "phishing",
        "actionRecommendation": "BLOCK",
        "source": "web",
        "hasSimulation": false,
        "timestamp": "2026-08-03T13:30:00Z"
      },
      {
        "scanId": "sr_8e2a1b0c-...",
        "inputType": "text",
        "inputPreview": "[Vietcombank]: Tài khoản của bạn bị khóa...",
        "riskScore": 92,
        "classification": "scam",
        "actionRecommendation": "BLOCK",
        "source": "extension",
        "hasSimulation": true,
        "timestamp": "2026-08-03T11:15:00Z"
      }
    ],
    "pagination": {
      "total": 248,
      "limit": 20,
      "hasMore": true,
      "nextCursor": "eyJ0aW1lc3RhbXAiOiIyMDI2LTA4LTAzVDExOjE1OjAwWiIsInNjYW5JZCI6InNyXzhlMmExYjBjIn0="
    },
    "summary": {
      "totalScans": 248,
      "threats": 31,
      "safe": 217,
      "avgRiskScore": 23
    }
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `400 INVALID_INPUT` (bad query params), `401 UNAUTHORIZED`

---

### SIMULATION

---

#### `POST /scans/:scanId/simulate`
Khởi chạy AI Consequence Simulation cho một mối đe dọa đã phát hiện. Chỉ hoạt động với classification ≠ `safe`.

**Auth**: Required (owner only)
**Rate Limit**: 100/min/user (governed by general limit)

**Request Body**: None

**Processing Flow:**
```
1. Fetch scan_result from Firestore (verify ownership)
2. Validate: classification must not be 'safe'
3. Check: simulation already exists for this scanId? → return existing
4. Call Gemini 2.5 Pro with Simulate prompt + scan context
5. Parse simulation steps + potential_loss
6. Write to simulations collection
7. Update scan_results.simulation_id
8. Return result
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "simulationId": "sim_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "scanId": "sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "steps": [
      {
        "step": 1,
        "title": "Bạn nhấp vào đường link",
        "description": "Trang web giả mạo Vietcombank tải ra. Trình duyệt không có cảnh báo do tên miền trông hợp lệ.",
        "timestampLabel": "T+0:00",
        "severity": "medium"
      },
      {
        "step": 2,
        "title": "Kẻ tấn công đánh cắp thông tin đăng nhập",
        "description": "Bạn nhập username và mật khẩu. Dữ liệu gửi tức thì đến máy chủ của kẻ lừa đảo tại Philippines.",
        "timestampLabel": "T+0:04 giây",
        "severity": "critical"
      },
      {
        "step": 3,
        "title": "Tài khoản bị rút cạn trong 3 phút",
        "description": "Kẻ tấn công chuyển khoản 3 lần — tổng 50 triệu đồng — đến tài khoản trung gian.",
        "timestampLabel": "T+3 phút",
        "severity": "critical"
      }
    ],
    "potentialLoss": "50.000.000 VND",
    "closingMessage": "Hệ miễn dịch của bạn đã chặn điều này. Bạn vừa tránh được khoản thiệt hại lên đến 50 triệu đồng.",
    "isExisting": false,
    "generatedByModel": "gemini-2.5-pro",
    "generationMs": 4231
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `400 INVALID_INPUT` (safe scan), `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 SCAN_NOT_FOUND`, `504 GEMINI_TIMEOUT`

---

#### `GET /scans/:scanId/simulation`
Lấy kết quả simulation đã tạo trước đó.

**Auth**: Required (owner only)

**Response `200 OK`:** Same structure as `POST /simulate` data object.

**Errors**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 NOT_FOUND` (no simulation yet)

---

### RECOMMENDATION — EXPLAIN

---

#### `POST /scans/:scanId/explain`
AI giải thích chi tiết tại sao nội dung nguy hiểm — dành cho Explain Mode.

**Auth**: Required (owner only)
**Note**: Kết quả explain KHÔNG được lưu vào Firestore (ephemeral, generated per-request)

**Request Body:**
```json
{
  "language": "vi | en",
  "depth": "simple | detailed"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `language` | enum | `vi` | Response language |
| `depth` | enum | `detailed` | `simple` = 2-3 sentences; `detailed` = full analysis |

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "scanId": "sr_9f3a2b1c-...",
    "aiNarrative": "Đây là một cuộc tấn công lừa đảo (phishing) tinh vi nhằm vào khách hàng Vietcombank. Kẻ tấn công đã tạo ra một tên miền 'vietcombank-secure-login.ph' trông giống tên miền chính thức, nhưng thực tế là một địa chỉ hoàn toàn khác tại Philippines. Mục tiêu là đánh cắp thông tin đăng nhập của bạn.",
    "redFlagDetails": [
      {
        "id": "fake_domain",
        "label": "Giả mạo tên miền (Domain Spoofing)",
        "severity": "critical",
        "explanation": "Tên miền hợp lệ của Vietcombank là 'vietcombank.com.vn'. Tên miền này dùng '-secure-login.ph' — một kỹ thuật gọi là 'Lookalike Domain' để đánh lừa người dùng thiếu kinh nghiệm.",
        "learnMore": "Luôn kiểm tra thanh địa chỉ trình duyệt trước khi nhập mật khẩu. Ngân hàng thật không bao giờ yêu cầu đăng nhập qua link trong SMS."
      },
      {
        "id": "no_https",
        "label": "Không có HTTPS (Kết nối không bảo mật)",
        "severity": "high",
        "explanation": "HTTP nghĩa là dữ liệu bạn nhập (mật khẩu, số thẻ) được truyền không mã hóa — bất kỳ ai trên cùng mạng WiFi đều có thể đọc được.",
        "learnMore": "Tìm biểu tượng ổ khóa 🔒 trên thanh địa chỉ. Nếu không thấy, ĐỪNG nhập thông tin nhạy cảm."
      }
    ],
    "whatToDo": [
      "Không nhấp vào link này",
      "Gọi hotline Vietcombank 1800 1218 để xác nhận",
      "Báo cáo số điện thoại/link này cho cộng đồng IIS"
    ],
    "educationalTip": "Khi nhận SMS từ ngân hàng, hãy luôn kiểm tra độc lập qua app ngân hàng hoặc gọi hotline — không bao giờ qua link trong tin nhắn.",
    "immunityPointsEarned": 5,
    "generatedByModel": "gemini-2.5-pro",
    "generationMs": 3892
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 SCAN_NOT_FOUND`, `504 GEMINI_TIMEOUT`

---

### COMMUNITY

---

#### `GET /reports/threats`
Community threat feed — danh sách mối đe dọa được cộng đồng xác minh.

**Auth**: Required
**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | int | 20 | Items per page (max 50) |
| `cursor` | string | — | Pagination cursor |
| `riskLevel` | enum | `HIGH,CRITICAL` | Comma-separated: `LOW,MEDIUM,HIGH,CRITICAL` |
| `entityType` | enum | all | `URL \| PHONE \| BANK_ACCOUNT \| EMAIL` |
| `verified` | bool | `true` | Filter verified only |
| `source` | enum | all | `SYSTEM \| COMMUNITY \| NCSC_VN` |

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "threatId": "7f83b165...",
        "entityType": "DOMAIN",
        "entityValue": "vietcombank-secure-login.ph",
        "riskLevel": "CRITICAL",
        "classifications": ["phishing", "credential_theft"],
        "description": "Trang giả mạo Vietcombank thu thập thông tin đăng nhập internet banking.",
        "source": "COMMUNITY",
        "reportCount": 127,
        "verified": true,
        "estimatedVictims": 127,
        "estimatedLossVnd": 6350000000,
        "firstSeen": "2026-07-15T08:00:00Z",
        "lastUpdated": "2026-08-03T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 1456,
      "hasMore": true,
      "nextCursor": "eyJsYXN0VXBkYXRlZCI6..."
    },
    "stats": {
      "totalThreats": 1456,
      "verifiedThreats": 1203,
      "communityReports": 8421,
      "estimatedProtected": 45230
    }
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `POST /reports`
Submit báo cáo mối đe dọa mới từ cộng đồng.

**Auth**: Required
**Rate Limit**: 5/hour/user

**Request Body:**
```json
{
  "entityType": "URL | PHONE | BANK_ACCOUNT | EMAIL",
  "entityValue": "0903 456 789",
  "description": "Số điện thoại này giả danh công an gọi yêu cầu nộp tiền bảo lãnh. Họ nói tôi đang bị điều tra vì liên quan đến rửa tiền.",
  "evidenceUrls": []
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `entityType` | enum | ✅ | `URL \| PHONE \| BANK_ACCOUNT \| EMAIL` |
| `entityValue` | string | ✅ | 1–500 chars |
| `description` | string | ✅ | 10–500 chars |
| `evidenceUrls` | string[] | ❌ | max 3 URLs, must be Cloud Storage |

**Response `201 Created`:**
```json
{
  "status": "success",
  "data": {
    "reportId": "fr_3c4d5e6f-...",
    "status": "pending",
    "message": "Báo cáo của bạn đã được ghi nhận và sẽ được kiểm duyệt trong 24 giờ. Cảm ơn bạn đã bảo vệ cộng đồng!",
    "immunityPointsEarned": 10
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `400 INVALID_INPUT`, `429 RATE_LIMITED`

---

### VACCINATION — TRAINING

---

#### `POST /training/sessions`
Tạo phiên luyện tập mới với AI-generated scenario.

**Auth**: Required
**Rate Limit**: 10 sessions/day/user

**Request Body:**
```json
{
  "preferredType": "phishing_email | fake_sms | fake_site | investment_scam | romance_scam | auto",
  "difficulty": "easy | medium | hard | auto"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `preferredType` | enum | `auto` | Scenario type (auto = AI picks) |
| `difficulty` | enum | `auto` | Difficulty level (auto = based on trust_score) |

**Processing Flow:**
```
1. Check daily session limit (10/day)
2. Read user's trust_score to calibrate difficulty (if auto)
3. Call Gemini 2.5 Pro with Trainer prompt
4. Generate: scenario_content + 3 questions (4 options each, 1 correct)
5. Write training_session (status: pending, user_answers: null)
6. Return session (WITHOUT correct_index — hidden until submit)
```

**Response `201 Created`:**
```json
{
  "status": "success",
  "data": {
    "sessionId": "ts_2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
    "scenarioType": "phishing_email",
    "difficulty": "medium",
    "scenarioContent": "[Techbank - Phòng Bảo Mật]: Tài khoản của quý khách đã bị đăng nhập từ thiết bị lạ tại Hà Nội lúc 02:15 SA. Vui lòng xác minh ngay tại: http://techbank-verify.net/secure hoặc tài khoản sẽ bị khóa trong 2 giờ.",
    "questions": [
      {
        "questionId": "q1_2b3c4d",
        "question": "Dấu hiệu đáng ngờ nào rõ nhất trong tin nhắn này?",
        "options": [
          "Tin nhắn gửi lúc 2 giờ sáng",
          "Domain techbank-verify.net không phải tên miền ngân hàng chính thức",
          "Tin nhắn bằng tiếng Việt",
          "Đề cập đến địa điểm cụ thể (Hà Nội)"
        ]
      },
      {
        "questionId": "q2_2b3c4d",
        "question": "Đây là thủ thuật tâm lý gì?",
        "options": [
          "Authority — giả danh quyền lực",
          "Scarcity + Urgency — tạo áp lực thời gian",
          "Social Proof — lợi dụng đám đông",
          "Reciprocity — tặng quà để đổi lại"
        ]
      },
      {
        "questionId": "q3_2b3c4d",
        "question": "Bạn nên làm gì ngay bây giờ?",
        "options": [
          "Nhấp vào link để kiểm tra xem tài khoản có bị khóa không",
          "Gọi trực tiếp hotline ngân hàng bằng số có trên thẻ hoặc website chính thức",
          "Chụp màn hình và chia sẻ cho bạn bè để hỏi ý kiến",
          "Trả lời tin nhắn để yêu cầu giải thích thêm"
        ]
      }
    ],
    "expiresAt": "2026-08-04T13:35:00Z"
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `POST /training/sessions/:sessionId/submit`
Submit câu trả lời, nhận điểm và giải thích.

**Auth**: Required (owner only)
**Rate Limit**: 3 attempts per session

**Request Body:**
```json
{
  "answers": [1, 1, 1]
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `answers` | number[] | ✅ | Exactly 3 items, each 0–3 (index of chosen option) |

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "sessionId": "ts_2b3c4d5e-...",
    "score": 100,
    "maxScore": 100,
    "correctCount": 3,
    "totalQuestions": 3,
    "results": [
      {
        "questionId": "q1_2b3c4d",
        "question": "Dấu hiệu đáng ngờ nào rõ nhất?",
        "yourAnswer": 1,
        "correctAnswer": 1,
        "isCorrect": true,
        "explanation": "Domain 'techbank-verify.net' là dấu hiệu rõ ràng nhất — ngân hàng thật dùng domain chính thức (techbank.vn)."
      },
      {
        "questionId": "q2_2b3c4d",
        "question": "Đây là thủ thuật tâm lý gì?",
        "yourAnswer": 1,
        "correctAnswer": 1,
        "isCorrect": true,
        "explanation": "'Tài khoản bị khóa trong 2 giờ' tạo áp lực thời gian — đây là Scarcity/Urgency technique."
      },
      {
        "questionId": "q3_2b3c4d",
        "question": "Bạn nên làm gì?",
        "yourAnswer": 1,
        "correctAnswer": 1,
        "isCorrect": true,
        "explanation": "Xác minh qua hotline trên thẻ — không bao giờ qua link SMS."
      }
    ],
    "badgesEarned": [
      {
        "id": "perfect_drill_v1",
        "name": "Perfect Drill",
        "description": "Đạt điểm tuyệt đối trong một buổi luyện tập",
        "icon": "🎯"
      },
      {
        "id": "phishing_awareness_v1",
        "name": "Phishing Awareness",
        "description": "Nhận diện chính xác tất cả dấu hiệu phishing",
        "icon": "🛡️"
      }
    ],
    "trustScoreDelta": 5,
    "newTrustScore": 81,
    "completedAt": "2026-08-03T13:37:45Z"
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `400 INVALID_INPUT`, `403 FORBIDDEN`, `404 NOT_FOUND`, `410 SESSION_EXPIRED`

---

#### `GET /training/sessions`
Lịch sử các phiên luyện tập của user.

**Auth**: Required
**Query Parameters**: `limit` (default 20), `cursor`, `status` (pending|completed|expired)

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "sessionId": "ts_2b3c4d5e-...",
        "scenarioType": "phishing_email",
        "difficulty": "medium",
        "status": "completed",
        "score": 100,
        "badgesEarned": ["perfect_drill_v1"],
        "createdAt": "2026-08-03T13:35:00Z",
        "completedAt": "2026-08-03T13:37:45Z"
      }
    ],
    "pagination": { "total": 12, "hasMore": false, "nextCursor": null },
    "stats": {
      "totalSessions": 12,
      "completedSessions": 12,
      "averageScore": 84,
      "totalBadgesEarned": 3
    }
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `GET /training/badges`
Tất cả badges — cả đã earn và chưa earn.

**Auth**: Required

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "earned": [
      {
        "id": "first_scan_v1",
        "name": "First Scan",
        "description": "Thực hiện lần quét đầu tiên",
        "icon": "🔍",
        "earnedAt": "2026-08-01T10:00:00Z"
      },
      {
        "id": "phishing_awareness_v1",
        "name": "Phishing Awareness",
        "description": "Hoàn thành bài drill phishing đầu tiên",
        "icon": "🛡️",
        "earnedAt": "2026-08-03T13:37:45Z"
      }
    ],
    "locked": [
      {
        "id": "community_guardian_v1",
        "name": "Community Guardian",
        "description": "Gửi 10 báo cáo cộng đồng được xác minh",
        "icon": "🏆",
        "requirement": "Submit 10 verified community reports",
        "progress": { "current": 2, "target": 10 }
      }
    ]
  },
  "error": null,
  "meta": { ... }
}
```

---

### USER & METRICS

---

#### `GET /users/me`
Profile và Trust Score của user hiện tại.

**Auth**: Required

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "uid": "gAbC12dEfGhIjKlM3nOpQ",
    "email": "nguyenvana@gmail.com",
    "displayName": "Nguyễn Văn An",
    "photoUrl": "https://lh3.googleusercontent.com/a/photo.jpg",
    "trustScore": 76,
    "antibodyLevel": 2,
    "badges": ["phishing_awareness_v1", "first_scan_v1"],
    "totalScans": 248,
    "threatsBlocked": 31,
    "settings": {
      "alertsEnabled": true,
      "autoBlock": false,
      "language": "vi",
      "sensitivity": "balanced",
      "extensionActive": true,
      "trustedDomains": ["google.com", "youtube.com"]
    },
    "createdAt": "2026-08-01T00:00:00Z",
    "lastActive": "2026-08-03T13:30:00Z"
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `PATCH /users/me/settings`
Cập nhật cài đặt bảo vệ.

**Auth**: Required

**Request Body** (partial update — only send changed fields):
```json
{
  "alertsEnabled": true,
  "autoBlock": true,
  "language": "en",
  "sensitivity": "strict",
  "extensionActive": true,
  "trustedDomains": ["google.com", "youtube.com", "zalo.me"]
}
```

**Validation:**
| Field | Constraint |
|---|---|
| `language` | `vi \| en` |
| `sensitivity` | `strict \| balanced \| lenient` |
| `trustedDomains` | Array of strings, max 50 items |

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "settings": {
      "alertsEnabled": true,
      "autoBlock": true,
      "language": "en",
      "sensitivity": "strict",
      "extensionActive": true,
      "trustedDomains": ["google.com", "youtube.com", "zalo.me"]
    },
    "message": "Cài đặt đã được cập nhật"
  },
  "error": null,
  "meta": { ... }
}
```

**Errors**: `400 INVALID_INPUT`, `401 UNAUTHORIZED`

---

#### `GET /metrics/summary`
Thống kê bảo mật 30 ngày của user.

**Auth**: Required

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "from": "2026-07-04T00:00:00Z",
      "to": "2026-08-03T23:59:59Z",
      "days": 30
    },
    "scans": {
      "total": 248,
      "threats": 31,
      "safe": 217,
      "avgRiskScore": 23,
      "byClassification": {
        "phishing": 18,
        "scam": 9,
        "malware": 4,
        "suspicious": 12,
        "safe": 205
      },
      "bySource": {
        "web": 120,
        "extension": 128
      }
    },
    "training": {
      "sessionsCompleted": 12,
      "avgScore": 84,
      "badgesEarned": 3
    },
    "community": {
      "reportsSubmitted": 2,
      "reportsVerified": 1,
      "peopleProtected": 847
    },
    "trustScore": {
      "current": 76,
      "change30d": 26,
      "trend": "up"
    },
    "heatmapData": [
      { "date": "2026-07-04", "scanCount": 3, "maxRisk": 87 },
      { "date": "2026-07-05", "scanCount": 0, "maxRisk": 0 }
    ]
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `GET /notifications`
Danh sách thông báo in-app.

**Auth**: Required
**Query Params**: `limit` (default 20), `unreadOnly` (bool)

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "notificationId": "notif_4d5e6f7a-...",
        "type": "badge_earned",
        "title": "🛡️ Huy hiệu mới! Phishing Expert",
        "body": "Bạn đã nhận huy hiệu 'Phishing Expert'",
        "actionUrl": "/profile#badges",
        "data": { "badgeId": "phishing_awareness_v1" },
        "read": false,
        "createdAt": "2026-08-03T13:37:45Z"
      }
    ],
    "pagination": { "total": 5, "hasMore": false },
    "unreadCount": 2
  },
  "error": null,
  "meta": { ... }
}
```

---

#### `PATCH /notifications/:notifId/read`
Đánh dấu notification đã đọc.

**Auth**: Required (owner only)

**Response `200 OK`:**
```json
{
  "status": "success",
  "data": { "notificationId": "notif_4d5e...", "read": true },
  "error": null,
  "meta": { ... }
}
```

---

## 7. WebSocket — Real-Time Scan

> Dùng cho tính năng scan với streaming progress updates (tránh timeout 30s).

**Endpoint**: `wss://api.immune-system.vn/v1/ws/scan`

**Auth**: Query param `?token=<Firebase_ID_Token>`

### Protocol Flow
```
Client                                Server
  │                                      │
  │─── WS Connect ?token=<jwt> ─────────►│
  │                                      │ (verify token)
  │◄── { event: "connected" } ───────────│
  │                                      │
  │─── { event: "scan", data: {         │
  │      contentType: "url",            │
  │      contentData: "http://..." } } ──►│
  │                                      │
  │◄── { event: "progress",             │
  │      data: { stage: "checking_tl"}} │
  │                                      │
  │◄── { event: "progress",             │
  │      data: { stage: "calling_ai" }} │
  │                                      │
  │◄── { event: "progress",             │
  │      data: { stage: "analyzing" }}  │
  │                                      │
  │◄── { event: "result",               │
  │      data: { scanId, riskScore, ... }}│
  │                                      │
  │─── WS Close ────────────────────────►│
```

### Message Schemas

**Client → Server:**
```json
{
  "event": "scan",
  "data": {
    "contentType": "url | email | text | dom",
    "contentData": "http://suspicious-site.ph",
    "context": "optional hint"
  }
}
```

**Server → Client (progress):**
```json
{
  "event": "progress",
  "data": {
    "stage": "checking_tl | calling_ai | analyzing | writing",
    "message": "Đang kiểm tra cơ sở dữ liệu mối đe dọa...",
    "progressPercent": 25
  }
}
```

**Server → Client (result):**
```json
{
  "event": "result",
  "data": {
    "scanId": "sr_...",
    "riskScore": 87,
    "classification": "phishing",
    "confidence": 0.94,
    "geminiExplanation": "...",
    "redFlags": [ ... ],
    "actionRecommendation": "BLOCK"
  }
}
```

**Server → Client (error):**
```json
{
  "event": "error",
  "data": {
    "code": "GEMINI_TIMEOUT",
    "message": "AI phân tích quá thời gian. Vui lòng thử lại."
  }
}
```

---

## 8. OpenAPI 3.1 YAML

```yaml
openapi: 3.1.0
info:
  title: Internet Immune System API
  version: 1.0.0
  description: |
    REST API for the Internet Immune System — AI-powered fraud detection,
    consequence simulation, explanation, training, and real-time protection.
    Powered by Google Gemini AI.
  contact:
    name: IIS Development Team
    url: https://github.com/KimDung1/Internet-Immune-System
  license:
    name: MIT
    identifier: MIT

servers:
  - url: https://api.immune-system.vn/v1
    description: Production
  - url: http://localhost:8080/v1
    description: Local Development

tags:
  - name: Authentication
    description: Firebase token verification and session management
  - name: Threat Analysis
    description: AI-powered content scanning and threat detection
  - name: History
    description: Scan history and filtering
  - name: Simulation
    description: AI consequence simulation (Theater Mode)
  - name: Recommendation
    description: AI detailed explanation of threats
  - name: Community
    description: Community threat reports and feed
  - name: Training
    description: Gamified anti-fraud training (Vaccination Mode)
  - name: User & Metrics
    description: User profile, settings, and analytics

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: Firebase JWT
      description: Firebase ID Token obtained after Google Sign-In

  schemas:
    # ─── RESPONSE ENVELOPE ────────────────────────────────────
    ResponseEnvelope:
      type: object
      required: [status, data, error, meta]
      properties:
        status:
          type: string
          enum: [success, error]
        data:
          nullable: true
          description: Present on success, null on error
        error:
          nullable: true
          $ref: '#/components/schemas/ErrorObject'
        meta:
          $ref: '#/components/schemas/MetaObject'

    ErrorObject:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
          enum:
            - UNAUTHORIZED
            - FORBIDDEN
            - NOT_FOUND
            - INVALID_INPUT
            - INVALID_URL
            - CONTENT_TOO_LONG
            - RATE_LIMITED
            - GEMINI_TIMEOUT
            - GEMINI_SAFETY_BLOCK
            - SCAN_NOT_FOUND
            - SESSION_EXPIRED
            - INTERNAL_ERROR
        message:
          type: string
          description: Human-readable message in Vietnamese
        details:
          type: object
          additionalProperties: true
          nullable: true

    MetaObject:
      type: object
      required: [requestId, timestamp]
      properties:
        requestId:
          type: string
          format: uuid
        timestamp:
          type: string
          format: date-time
        processingMs:
          type: integer
          minimum: 0

    PaginationObject:
      type: object
      properties:
        total:
          type: integer
        limit:
          type: integer
        hasMore:
          type: boolean
        nextCursor:
          type: string
          nullable: true

    # ─── DOMAIN SCHEMAS ───────────────────────────────────────
    RedFlag:
      type: object
      required: [id, label, severity, description]
      properties:
        id:
          type: string
          example: fake_domain
        label:
          type: string
          example: Fake Domain Spoofing
        severity:
          type: string
          enum: [low, medium, high, critical]
        description:
          type: string
          maxLength: 150

    ScanResult:
      type: object
      properties:
        scanId:
          type: string
          example: sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c
        riskScore:
          type: integer
          minimum: 0
          maximum: 100
        classification:
          type: string
          enum: [safe, suspicious, phishing, malware, scam]
        confidence:
          type: number
          format: float
          minimum: 0.0
          maximum: 1.0
        geminiExplanation:
          type: string
          maxLength: 500
        redFlags:
          type: array
          items:
            $ref: '#/components/schemas/RedFlag'
          maxItems: 10
        actionRecommendation:
          type: string
          enum: [ALLOW, BLOCK, WARN]
        detectionSource:
          type: string
          enum: [ai, threat_intelligence, cache]
        processingMs:
          type: integer
        threatIntelHit:
          type: boolean

    SimulationStep:
      type: object
      required: [step, title, description, timestampLabel, severity]
      properties:
        step:
          type: integer
          enum: [1, 2, 3]
        title:
          type: string
          maxLength: 60
        description:
          type: string
          maxLength: 150
        timestampLabel:
          type: string
          example: "T+0:04 giây"
        severity:
          type: string
          enum: [medium, high, critical]

    TrainingQuestion:
      type: object
      required: [questionId, question, options]
      properties:
        questionId:
          type: string
        question:
          type: string
        options:
          type: array
          items:
            type: string
          minItems: 4
          maxItems: 4

    Badge:
      type: object
      required: [id, name, description, icon]
      properties:
        id:
          type: string
        name:
          type: string
        description:
          type: string
        icon:
          type: string
        earnedAt:
          type: string
          format: date-time
          nullable: true

    UserSettings:
      type: object
      properties:
        alertsEnabled:
          type: boolean
        autoBlock:
          type: boolean
        language:
          type: string
          enum: [vi, en]
        sensitivity:
          type: string
          enum: [strict, balanced, lenient]
        extensionActive:
          type: boolean
        trustedDomains:
          type: array
          items:
            type: string
          maxItems: 50

    UserProfile:
      type: object
      properties:
        uid:
          type: string
        email:
          type: string
          format: email
        displayName:
          type: string
        photoUrl:
          type: string
          nullable: true
        trustScore:
          type: integer
          minimum: 0
          maximum: 100
        antibodyLevel:
          type: integer
          minimum: 1
          maximum: 10
        badges:
          type: array
          items:
            type: string
        totalScans:
          type: integer
        threatsBlocked:
          type: integer
        settings:
          $ref: '#/components/schemas/UserSettings'

  responses:
    Unauthorized:
      description: Missing or invalid Firebase JWT
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ResponseEnvelope'
          example:
            status: error
            data: null
            error:
              code: UNAUTHORIZED
              message: Token không hợp lệ hoặc đã hết hạn
            meta:
              requestId: uuid
              timestamp: "2026-08-03T13:49:52Z"
              processingMs: 12

    RateLimited:
      description: Rate limit exceeded
      headers:
        Retry-After:
          schema:
            type: integer
          description: Seconds to wait before retry
        X-RateLimit-Limit:
          schema:
            type: integer
        X-RateLimit-Remaining:
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ResponseEnvelope'

# ─── PATHS ─────────────────────────────────────────────────────
paths:

  # AUTH
  /auth/verify:
    post:
      tags: [Authentication]
      summary: Verify Firebase token and upsert user
      operationId: authVerify
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Token valid, user profile returned
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ResponseEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/UserProfile'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /auth/session:
    delete:
      tags: [Authentication]
      summary: Sign out and revoke token
      operationId: authSignOut
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Signed out successfully
        '401':
          $ref: '#/components/responses/Unauthorized'

  # SCANS
  /scans/analyze:
    post:
      tags: [Threat Analysis]
      summary: Analyze content for threats using Gemini AI
      operationId: scansAnalyze
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [contentType, contentData]
              properties:
                contentType:
                  type: string
                  enum: [url, email, text, dom]
                contentData:
                  type: string
                  minLength: 1
                  maxLength: 4000
                context:
                  type: string
                  maxLength: 500
                  nullable: true
            example:
              contentType: url
              contentData: "http://vietcombank-secure-login.ph/dang-nhap"
              context: "Received via Zalo from unknown number"
      responses:
        '200':
          description: Analysis complete
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ResponseEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/ScanResult'
        '400':
          description: Invalid input or URL
        '413':
          description: Content too long (>4000 chars)
        '422':
          description: Content blocked by Gemini safety filters
        '429':
          $ref: '#/components/responses/RateLimited'
        '504':
          description: Gemini API timeout

  /scans:
    get:
      tags: [History]
      summary: Get user's scan history (paginated)
      operationId: scansHistory
      security:
        - BearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
        - name: cursor
          in: query
          schema:
            type: string
        - name: classification
          in: query
          schema:
            type: string
            enum: [safe, suspicious, phishing, malware, scam]
        - name: source
          in: query
          schema:
            type: string
            enum: [web, extension, api]
        - name: from
          in: query
          schema:
            type: string
            format: date
        - name: to
          in: query
          schema:
            type: string
            format: date
        - name: sortBy
          in: query
          schema:
            type: string
            enum: [timestamp, riskScore]
            default: timestamp
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Paginated scan history
        '401':
          $ref: '#/components/responses/Unauthorized'

  /scans/{scanId}:
    get:
      tags: [History]
      summary: Get single scan result detail
      operationId: scanGetById
      security:
        - BearerAuth: []
      parameters:
        - name: scanId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Scan result detail
        '403':
          description: Forbidden (not owner)
        '404':
          description: Scan not found

  /scans/{scanId}/simulate:
    post:
      tags: [Simulation]
      summary: Generate AI consequence simulation for a threat
      operationId: scanSimulate
      security:
        - BearerAuth: []
      parameters:
        - name: scanId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Simulation generated
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ResponseEnvelope'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          simulationId:
                            type: string
                          steps:
                            type: array
                            items:
                              $ref: '#/components/schemas/SimulationStep'
                          potentialLoss:
                            type: string
                          closingMessage:
                            type: string
        '400':
          description: Cannot simulate safe content
        '403':
          description: Forbidden
        '404':
          description: Scan not found
        '504':
          description: Gemini timeout

  /scans/{scanId}/simulation:
    get:
      tags: [Simulation]
      summary: Get existing simulation result
      operationId: scanGetSimulation
      security:
        - BearerAuth: []
      parameters:
        - name: scanId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Simulation data
        '404':
          description: No simulation exists for this scan

  /scans/{scanId}/explain:
    post:
      tags: [Recommendation]
      summary: Get AI detailed explanation of why content is dangerous
      operationId: scanExplain
      security:
        - BearerAuth: []
      parameters:
        - name: scanId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                language:
                  type: string
                  enum: [vi, en]
                  default: vi
                depth:
                  type: string
                  enum: [simple, detailed]
                  default: detailed
      responses:
        '200':
          description: AI explanation with red flag details and recommendations
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          description: Scan not found

  # COMMUNITY
  /reports/threats:
    get:
      tags: [Community]
      summary: Get community verified threat feed
      operationId: threatsGetFeed
      security:
        - BearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 50
        - name: cursor
          in: query
          schema:
            type: string
        - name: riskLevel
          in: query
          schema:
            type: string
            example: "HIGH,CRITICAL"
        - name: entityType
          in: query
          schema:
            type: string
            enum: [URL, PHONE, BANK_ACCOUNT, EMAIL]
        - name: verified
          in: query
          schema:
            type: boolean
            default: true
      responses:
        '200':
          description: Community threat feed

  /reports:
    post:
      tags: [Community]
      summary: Submit a community fraud report
      operationId: reportsCreate
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [entityType, entityValue, description]
              properties:
                entityType:
                  type: string
                  enum: [URL, PHONE, BANK_ACCOUNT, EMAIL]
                entityValue:
                  type: string
                  maxLength: 500
                description:
                  type: string
                  minLength: 10
                  maxLength: 500
                evidenceUrls:
                  type: array
                  items:
                    type: string
                    format: uri
                  maxItems: 3
      responses:
        '201':
          description: Report submitted successfully
        '400':
          description: Invalid input
        '429':
          $ref: '#/components/responses/RateLimited'

  # TRAINING
  /training/sessions:
    post:
      tags: [Training]
      summary: Start a new AI-generated training drill
      operationId: trainingCreate
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                preferredType:
                  type: string
                  enum: [phishing_email, fake_sms, fake_site, investment_scam, romance_scam, auto]
                  default: auto
                difficulty:
                  type: string
                  enum: [easy, medium, hard, auto]
                  default: auto
      responses:
        '201':
          description: Training session created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ResponseEnvelope'
                  - type: object
                    properties:
                      data:
                        type: object
                        properties:
                          sessionId:
                            type: string
                          scenarioType:
                            type: string
                          difficulty:
                            type: string
                          scenarioContent:
                            type: string
                          questions:
                            type: array
                            items:
                              $ref: '#/components/schemas/TrainingQuestion'
                          expiresAt:
                            type: string
                            format: date-time
        '429':
          description: Daily session limit reached (10/day)

    get:
      tags: [Training]
      summary: Get user's training session history
      operationId: trainingHistory
      security:
        - BearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: cursor
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, completed, expired]
      responses:
        '200':
          description: Training history

  /training/sessions/{sessionId}/submit:
    post:
      tags: [Training]
      summary: Submit answers for a training session
      operationId: trainingSubmit
      security:
        - BearerAuth: []
      parameters:
        - name: sessionId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [answers]
              properties:
                answers:
                  type: array
                  items:
                    type: integer
                    minimum: 0
                    maximum: 3
                  minItems: 3
                  maxItems: 3
                  example: [1, 1, 1]
      responses:
        '200':
          description: Score and feedback returned with badges
        '400':
          description: Invalid answers
        '403':
          description: Forbidden (not owner)
        '404':
          description: Session not found
        '410':
          description: Session expired (24h)

  /training/badges:
    get:
      tags: [Training]
      summary: Get all badges (earned and locked)
      operationId: trainingBadges
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Badge list with progress

  # USER
  /users/me:
    get:
      tags: [User & Metrics]
      summary: Get current user profile
      operationId: usersMe
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/ResponseEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/UserProfile'

  /users/me/settings:
    patch:
      tags: [User & Metrics]
      summary: Update user protection settings
      operationId: usersUpdateSettings
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserSettings'
      responses:
        '200':
          description: Settings updated
        '400':
          description: Invalid settings values

  /metrics/summary:
    get:
      tags: [User & Metrics]
      summary: Get 30-day personal security metrics
      operationId: metricsGetSummary
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Security metrics summary

  /notifications:
    get:
      tags: [User & Metrics]
      summary: Get in-app notifications
      operationId: notificationsGet
      security:
        - BearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: unreadOnly
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: Notification list

  /notifications/{notifId}/read:
    patch:
      tags: [User & Metrics]
      summary: Mark notification as read
      operationId: notificationsMarkRead
      security:
        - BearerAuth: []
      parameters:
        - name: notifId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Notification marked as read
        '403':
          description: Forbidden
        '404':
          description: Notification not found
```

---

## Endpoint Summary

| # | Method | Path | Auth | Rate Limit |
|---|---|---|---|---|
| 1 | POST | `/auth/verify` | Bearer | 10/min/IP |
| 2 | DELETE | `/auth/session` | Bearer | — |
| 3 | **POST** | `/scans/analyze` | Bearer | **30/min/user** |
| 4 | GET | `/scans` | Bearer | 100/min/user |
| 5 | GET | `/scans/:scanId` | Bearer | 100/min/user |
| 6 | POST | `/scans/:scanId/simulate` | Bearer | 100/min/user |
| 7 | GET | `/scans/:scanId/simulation` | Bearer | 100/min/user |
| 8 | POST | `/scans/:scanId/explain` | Bearer | 100/min/user |
| 9 | GET | `/reports/threats` | Bearer | 100/min/user |
| 10 | **POST** | `/reports` | Bearer | **5/hour/user** |
| 11 | **POST** | `/training/sessions` | Bearer | **10/day/user** |
| 12 | GET | `/training/sessions` | Bearer | 100/min/user |
| 13 | POST | `/training/sessions/:id/submit` | Bearer | 3/session |
| 14 | GET | `/training/badges` | Bearer | 100/min/user |
| 15 | GET | `/users/me` | Bearer | 100/min/user |
| 16 | PATCH | `/users/me/settings` | Bearer | 100/min/user |
| 17 | GET | `/metrics/summary` | Bearer | 100/min/user |
| 18 | GET | `/notifications` | Bearer | 100/min/user |
| 19 | PATCH | `/notifications/:id/read` | Bearer | 100/min/user |
| WS | WSS | `/ws/scan` | Token param | — |

---

## 🔗 Tài liệu liên quan

| Tài liệu | Link |
|---|---|
| Design Freeze (API Section) | [DesignFreeze.md §3](../DesignFreeze.md) |
| Firestore Schema | [FirestoreDesign.md](../11_Database/FirestoreDesign.md) |
| Backend Architecture | [BackendArchitecture.md](../12_Backend/BackendArchitecture.md) |
| Prompt Engineering | [PromptEngineering.md](../09_AI/PromptEngineering.md) |
| Security Guidelines | [SecurityGuide.md](../15_Security/) |
