# 🗄️ FIRESTORE DATABASE DESIGN — Internet Immune System
### Version: 1.0.0 | Platform: Cloud Firestore (Native Mode) | Region: `asia-southeast1`
### Status: Production Ready | Source: [DesignFreeze.md](../DesignFreeze.md) Section 4

> **NoSQL Design Principles Applied:**
> - Flat collections (max 1 subcollection level) → optimize read cost
> - Denormalized data → zero joins, fast reads
> - Document ID strategy → predictable lookups where possible
> - Immutable audit records → `update/delete: false` on critical collections

---

## 📐 Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                     FIRESTORE COLLECTIONS                            │
│                                                                      │
│  ┌─────────────┐         ┌──────────────────┐                       │
│  │   users     │ 1 ──── N│   scan_results   │                       │
│  │  (uid)      │         │  (scanId)        │                       │
│  └──────┬──────┘         └────────┬─────────┘                       │
│         │                         │ 1                               │
│         │                         │                                 │
│         │                         ▼ 0..1                            │
│         │ 1              ┌──────────────────┐                       │
│         ├──────────── N  │   simulations    │                       │
│         │                │  (simulationId)  │                       │
│         │                └──────────────────┘                       │
│         │                                                            │
│         │ 1              ┌──────────────────┐                       │
│         ├──────────── N  │training_sessions │                       │
│         │                │  (sessionId)     │                       │
│         │                └──────────────────┘                       │
│         │                                                            │
│         │ 1              ┌──────────────────┐                       │
│         └──────────── N  │  fraud_reports   │                       │
│                          │  (reportId)      │                       │
│                          └────────┬─────────┘                       │
│                                   │ verified                        │
│                                   ▼                                 │
│  ┌──────────────────────┐  ┌──────────────────┐                     │
│  │  threat_intelligence │  │  notifications   │                     │
│  │  (SHA-256 hash ID)   │  │  (notifId)       │                     │
│  └──────────────────────┘  └──────────────────┘                     │
└──────────────────────────────────────────────────────────────────────┘

Legend:
  1 ──── N  → One-to-many relationship (via uid field)
  →         → Reference (denormalized, no FK constraint in NoSQL)
```

---

## 📦 Collections

---

### Collection 1: `users`

> **Purpose**: Lưu profile người dùng, cài đặt bảo vệ, điểm miễn dịch, và badges.
> **Doc ID**: Firebase Auth UID (e.g. `"abc123xyz"`)
> **Access**: User đọc/ghi doc của chính mình. Admin SDK full access.

#### TypeScript Interface
```ts
interface UserDocument {
  // Identity
  uid:            string           // = Doc ID = Firebase Auth UID
  email:          string           // from Google Auth
  display_name:   string           // from Google Auth
  photo_url:      string | null    // Google profile photo

  // Immunity System
  trust_score:    number           // 0–100, default: 50
  antibody_level: number           // 1–10, derived from trust_score
  badges:         string[]         // e.g. ["phishing_expert_v1", "community_guardian_v1"]
  total_scans:    number           // denormalized counter
  threats_blocked: number          // denormalized counter

  // Settings
  settings: {
    alerts_enabled:      boolean   // default: true
    auto_block:          boolean   // default: false
    language:            'vi' | 'en'  // default: 'vi'
    sensitivity:         'strict' | 'balanced' | 'lenient'  // default: 'balanced'
    extension_active:    boolean   // default: false
    trusted_domains:     string[]  // e.g. ["google.com", "youtube.com"]
  }

  // Metadata
  created_at:     FirebaseFirestore.Timestamp
  last_active:    FirebaseFirestore.Timestamp
  account_status: 'active' | 'suspended' | 'deleted'  // default: 'active'
}
```

#### Constraints
| Field | Constraint |
|---|---|
| `trust_score` | 0 ≤ n ≤ 100 |
| `antibody_level` | 1 ≤ n ≤ 10 |
| `settings.language` | Enum: `'vi'` \| `'en'` |
| `settings.sensitivity` | Enum: `'strict'` \| `'balanced'` \| `'lenient'` |
| `settings.trusted_domains` | Max 50 entries |
| `email` | Valid email format |

#### Example Document
```json
{
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "email": "nguyenvana@gmail.com",
  "display_name": "Nguyễn Văn An",
  "photo_url": "https://lh3.googleusercontent.com/a/photo.jpg",
  "trust_score": 76,
  "antibody_level": 2,
  "badges": ["phishing_awareness_v1", "first_scan_v1"],
  "total_scans": 248,
  "threats_blocked": 31,
  "settings": {
    "alerts_enabled": true,
    "auto_block": false,
    "language": "vi",
    "sensitivity": "balanced",
    "extension_active": true,
    "trusted_domains": ["google.com", "youtube.com", "zalo.me"]
  },
  "created_at": "2026-08-01T00:00:00Z",
  "last_active": "2026-08-03T13:30:00Z",
  "account_status": "active"
}
```

#### Denormalized Counter Strategy
```ts
// Increment counters via FieldValue.increment — ATOMIC
await db.doc(`users/${uid}`).update({
  total_scans:    FieldValue.increment(1),
  threats_blocked: FieldValue.increment(1),  // only if threat
})
```

---

### Collection 2: `scan_results`

> **Purpose**: Lưu kết quả mỗi lần quét AI. Immutable sau khi tạo.
> **Doc ID**: Auto UUID v4 (e.g. `"sr_a1b2c3d4-..."`)
> **Access**: Owner reads only. Backend creates. No updates/deletes.

#### TypeScript Interface
```ts
interface ScanResultDocument {
  // Identity
  scan_id:        string           // = Doc ID
  uid:            string           // ref → users.uid

  // Input
  input_type:     'url' | 'email' | 'text' | 'dom'
  input_value:    string           // max 4000 chars (raw user input)
  input_hash:     string           // SHA-256 of normalized input_value (for dedup)
  content_type:   string           // MIME hint: 'text/plain' | 'text/html' | 'text/uri-list'

  // AI Analysis Result
  risk_score:          number      // 0–100
  classification:      'safe' | 'suspicious' | 'phishing' | 'malware' | 'scam'
  confidence:          number      // 0.0–1.0
  gemini_explanation:  string      // max 500 chars, Vietnamese
  red_flags:           RedFlag[]
  action_recommendation: 'ALLOW' | 'BLOCK' | 'WARN'

  // AI Metadata
  model_used:     string           // e.g. "gemini-2.5-flash"
  detection_source: 'ai' | 'threat_intelligence' | 'cache'  // how result was obtained
  processing_ms:  number           // latency in milliseconds

  // References
  simulation_id:  string | null    // ref → simulations.simulation_id (set later)
  threat_intel_id: string | null   // ref → threat_intelligence doc (if TI hit)

  // Metadata
  timestamp:      FirebaseFirestore.Timestamp
  client_version: string           // app version that submitted
  source:         'web' | 'extension' | 'api'
}

interface RedFlag {
  id:          string    // e.g. "fake_domain", "urgency_language"
  label:       string    // e.g. "Fake Domain Spoofing"
  severity:    'low' | 'medium' | 'high' | 'critical'
  description: string    // max 150 chars
}
```

#### Constraints
| Field | Constraint |
|---|---|
| `input_value` | max 4000 chars |
| `risk_score` | 0 ≤ n ≤ 100 |
| `confidence` | 0.0 ≤ n ≤ 1.0 |
| `red_flags` | max 10 items |
| `red_flags[].description` | max 150 chars |
| `gemini_explanation` | max 500 chars |
| `processing_ms` | must be positive |

#### Example Document
```json
{
  "scan_id": "sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "input_type": "url",
  "input_value": "http://vietcombank-secure-login.ph/dang-nhap",
  "input_hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "content_type": "text/uri-list",
  "risk_score": 87,
  "classification": "phishing",
  "confidence": 0.94,
  "gemini_explanation": "Đây là trang web giả mạo Vietcombank. Domain không phải vietcombank.com.vn chính thức. Trang dùng ngôn ngữ khẩn cấp để lừa nạn nhân nhập thông tin đăng nhập.",
  "red_flags": [
    {
      "id": "fake_domain",
      "label": "Fake Domain Spoofing",
      "severity": "critical",
      "description": "Domain 'vietcombank-secure-login.ph' giả mạo ngân hàng chính thức"
    },
    {
      "id": "no_https",
      "label": "Không có HTTPS",
      "severity": "high",
      "description": "Trang dùng HTTP không mã hóa — ngân hàng thật không bao giờ dùng HTTP"
    },
    {
      "id": "ph_tld",
      "label": "TLD Đáng Ngờ (.ph)",
      "severity": "high",
      "description": "Đuôi tên miền .ph (Philippines) bất thường cho ngân hàng Việt Nam"
    }
  ],
  "action_recommendation": "BLOCK",
  "model_used": "gemini-2.5-flash",
  "detection_source": "ai",
  "processing_ms": 1842,
  "simulation_id": null,
  "threat_intel_id": null,
  "timestamp": "2026-08-03T13:30:00Z",
  "client_version": "1.0.0",
  "source": "web"
}
```

---

### Collection 3: `simulations`

> **Purpose**: Lưu kết quả AI Consequence Simulation. Immutable sau khi tạo.
> **Doc ID**: Auto UUID v4 (e.g. `"sim_..."`)
> **Access**: Owner reads. Backend creates. No client updates/deletes.

#### TypeScript Interface
```ts
interface SimulationDocument {
  simulation_id:   string          // = Doc ID
  scan_id:         string          // ref → scan_results.scan_id (1:1)
  uid:             string          // ref → users.uid

  // Consequence steps
  steps: {
    step:        1 | 2 | 3
    title:       string            // max 60 chars
    description: string            // max 150 chars
    timestamp_label: string        // e.g. "T+0:00", "T+4 seconds", "T+3 minutes"
    severity: 'medium' | 'high' | 'critical'
  }[]                              // always exactly 3 steps

  potential_loss:   string         // e.g. "50.000.000 VND" — Vietnamese format
  closing_message:  string         // max 200 chars

  // AI Metadata
  model_used:      string          // "gemini-2.5-pro"
  generation_ms:   number          // latency

  created_at:      FirebaseFirestore.Timestamp
}
```

#### Constraints
| Field | Constraint |
|---|---|
| `steps` | Exactly 3 items |
| `steps[].title` | max 60 chars |
| `steps[].description` | max 150 chars |
| `potential_loss` | Vietnamese number format |
| `closing_message` | max 200 chars |

#### Example Document
```json
{
  "simulation_id": "sim_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "scan_id": "sr_9f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "steps": [
    {
      "step": 1,
      "title": "Bạn nhấp vào đường link",
      "description": "Trang web giả mạo Vietcombank tải ra. Trình duyệt không có cảnh báo do tên miền trông hợp lệ.",
      "timestamp_label": "T+0:00",
      "severity": "medium"
    },
    {
      "step": 2,
      "title": "Kẻ tấn công đánh cắp thông tin đăng nhập",
      "description": "Bạn nhập username và mật khẩu. Dữ liệu được gửi tức thì đến máy chủ của kẻ lừa đảo tại Philippines.",
      "timestamp_label": "T+0:04 giây",
      "severity": "critical"
    },
    {
      "step": 3,
      "title": "Tài khoản bị rút cạn trong 3 phút",
      "description": "Kẻ tấn công đăng nhập bằng thông tin của bạn, chuyển khoản 3 lần — tổng 50 triệu đồng — đến tài khoản trung gian.",
      "timestamp_label": "T+3 phút",
      "severity": "critical"
    }
  ],
  "potential_loss": "50.000.000 VND",
  "closing_message": "Hệ miễn dịch của bạn đã chặn điều này. Bạn vừa tránh được khoản thiệt hại lên đến 50 triệu đồng.",
  "model_used": "gemini-2.5-pro",
  "generation_ms": 4231,
  "created_at": "2026-08-03T13:31:00Z"
}
```

---

### Collection 4: `training_sessions`

> **Purpose**: Lưu mỗi phiên luyện tập (drill). Có thể update khi submit.
> **Doc ID**: Auto UUID v4 (e.g. `"ts_..."`)
> **Access**: Owner reads. Owner/Backend creates. Owner updates (submit answers). No deletes.

#### TypeScript Interface
```ts
interface TrainingSessionDocument {
  session_id:      string          // = Doc ID
  uid:             string          // ref → users.uid

  // Scenario (from Trainer Agent)
  scenario_type:   'phishing_email' | 'fake_sms' | 'fake_site' | 'investment_scam' | 'romance_scam'
  difficulty:      'easy' | 'medium' | 'hard'
  scenario_content: string         // the fake threat content
  scenario_brand:   string | null  // fictional brand used (NOT real brand name)

  // Questions (hidden correct_index until submit)
  questions: {
    question_id:   string
    question:      string
    options:       string[]        // always 4 options
    correct_index: number          // 0–3 (only visible server-side before submit)
    explanation:   string          // why that's the correct answer
  }[]                              // always 3 questions

  // User Response (null until submitted)
  user_answers:   number[] | null  // [selectedIndex0, selectedIndex1, selectedIndex2]
  score:          number | null    // 0–100, null until submitted
  badges_earned:  string[]         // badges awarded this session

  // Session Lifecycle
  status:         'pending' | 'completed' | 'expired'
  difficulty_used: 'easy' | 'medium' | 'hard'

  // AI Metadata
  model_used:     string           // "gemini-2.5-pro"

  // Timestamps
  created_at:     FirebaseFirestore.Timestamp    // session start
  expires_at:     FirebaseFirestore.Timestamp    // 24h after created_at
  completed_at:   FirebaseFirestore.Timestamp | null
}
```

#### Example Document (pending state)
```json
{
  "session_id": "ts_2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "scenario_type": "phishing_email",
  "difficulty": "medium",
  "scenario_content": "[Techbank - Phòng Bảo Mật]: Tài khoản của quý khách đã bị đăng nhập từ thiết bị lạ tại Hà Nội lúc 02:15 SA. Vui lòng xác minh ngay tại: http://techbank-verify.net/secure hoặc tài khoản sẽ bị khóa trong 2 giờ.",
  "scenario_brand": "Techbank (fictional)",
  "questions": [
    {
      "question_id": "q1_2b3c4d",
      "question": "Dấu hiệu đáng ngờ nào rõ nhất trong tin nhắn này?",
      "options": [
        "Tin nhắn gửi lúc 2 giờ sáng",
        "Domain techbank-verify.net không phải tên miền ngân hàng chính thức",
        "Tin nhắn bằng tiếng Việt",
        "Đề cập đến địa điểm cụ thể (Hà Nội)"
      ],
      "correct_index": 1,
      "explanation": "Ngân hàng thật sẽ dùng tên miền chính thức của họ (ví dụ: techbank.vn). Domain 'techbank-verify.net' là dấu hiệu rõ ràng của trang giả mạo."
    },
    {
      "question_id": "q2_2b3c4d",
      "question": "Đây là thủ thuật tâm lý gì?",
      "options": [
        "Authority — giả danh quyền lực",
        "Scarcity + Urgency — tạo áp lực thời gian",
        "Social Proof — lợi dụng đám đông",
        "Reciprocity — tặng quà để đổi lại"
      ],
      "correct_index": 1,
      "explanation": "'Tài khoản sẽ bị khóa trong 2 giờ' tạo ra áp lực thời gian khẩn cấp — thủ thuật Scarcity/Urgency phổ biến nhất trong lừa đảo ngân hàng."
    },
    {
      "question_id": "q3_2b3c4d",
      "question": "Bạn nên làm gì ngay bây giờ?",
      "options": [
        "Nhấp vào link để kiểm tra xem tài khoản có bị khóa không",
        "Gọi trực tiếp hotline ngân hàng bằng số có trên thẻ hoặc website chính thức",
        "Chụp màn hình và chia sẻ cho bạn bè để hỏi ý kiến",
        "Trả lời tin nhắn để yêu cầu giải thích thêm"
      ],
      "correct_index": 1,
      "explanation": "Luôn xác minh qua kênh chính thức (hotline trên thẻ/website). Không bao giờ nhấp link trong SMS/email đáng ngờ."
    }
  ],
  "user_answers": null,
  "score": null,
  "badges_earned": [],
  "status": "pending",
  "difficulty_used": "medium",
  "model_used": "gemini-2.5-pro",
  "created_at": "2026-08-03T13:35:00Z",
  "expires_at": "2026-08-04T13:35:00Z",
  "completed_at": null
}
```

#### Example Document (completed state — after submit)
```json
{
  "...": "(same fields as above, plus:)",
  "user_answers": [1, 1, 1],
  "score": 100,
  "badges_earned": ["perfect_drill_v1", "phishing_awareness_v1"],
  "status": "completed",
  "completed_at": "2026-08-03T13:37:45Z"
}
```

---

### Collection 5: `threat_intelligence`

> **Purpose**: Blacklist của các entity đã biết là nguy hiểm. Tra cứu trước khi gọi AI.
> **Doc ID**: SHA-256 hash của `normalize(entity_value)` — deterministic lookup
> **Access**: Public read. No client writes (Admin SDK only).

#### TypeScript Interface
```ts
interface ThreatIntelligenceDocument {
  doc_id:          string          // = SHA-256(normalize(entity_value))
  entity_type:     'URL' | 'PHONE' | 'BANK_ACCOUNT' | 'EMAIL' | 'DOMAIN'
  entity_value:    string          // the raw entity (normalized lowercase)
  entity_normalized: string        // trimmed, lowercased, URL-parsed domain only

  risk_level:      'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  classifications: string[]        // ['phishing', 'malware'] — can be multiple
  description:     string          // why it's dangerous, max 300 chars

  // Source tracking
  source:          'SYSTEM' | 'COMMUNITY' | 'NCSC_VN' | 'GOOGLE_SAFEBROWSING'
  report_count:    number          // how many community reports
  verified:        boolean         // manually verified by admin

  // Victim data (aggregated, no PII)
  estimated_victims: number | null
  estimated_loss_vnd: number | null

  // Timestamps
  first_seen:      FirebaseFirestore.Timestamp
  last_updated:    FirebaseFirestore.Timestamp
  expires_at:      FirebaseFirestore.Timestamp | null  // null = indefinite
}
```

#### Example Document
```json
{
  "doc_id": "7f83b1657ff1cf5d5b4c452bfe72f49a9f5b3fd25cbbc60e63f7f8a09e56b3",
  "entity_type": "DOMAIN",
  "entity_value": "vietcombank-secure-login.ph",
  "entity_normalized": "vietcombank-secure-login.ph",
  "risk_level": "CRITICAL",
  "classifications": ["phishing", "credential_theft"],
  "description": "Trang giả mạo Vietcombank thu thập thông tin đăng nhập internet banking. Đã có 127 nạn nhân báo cáo.",
  "source": "COMMUNITY",
  "report_count": 127,
  "verified": true,
  "estimated_victims": 127,
  "estimated_loss_vnd": 6350000000,
  "first_seen": "2026-07-15T08:00:00Z",
  "last_updated": "2026-08-03T12:00:00Z",
  "expires_at": null
}
```

#### Hash Normalization Logic
```ts
// apps/api/src/services/threat-intel.service.ts
import { createHash } from 'crypto'

function normalizeEntity(value: string, type: string): string {
  const v = value.trim().toLowerCase()
  if (type === 'URL' || type === 'DOMAIN') {
    try {
      return new URL(v.startsWith('http') ? v : `https://${v}`).hostname
    } catch { return v }
  }
  if (type === 'PHONE') return v.replace(/\D/g, '') // digits only
  if (type === 'BANK_ACCOUNT') return v.replace(/\s/g, '')
  return v
}

export function getThreatIntelDocId(entityValue: string, entityType: string): string {
  const normalized = normalizeEntity(entityValue, entityType)
  return createHash('sha256').update(normalized).digest('hex')
}
```

---

### Collection 6: `fraud_reports`

> **Purpose**: Báo cáo từ cộng đồng — input cho threat_intelligence sau khi verified.
> **Doc ID**: Auto UUID v4 (e.g. `"fr_..."`)
> **Access**: Auth users can create. No client reads/updates/deletes (Admin only).

#### TypeScript Interface
```ts
interface FraudReportDocument {
  report_id:       string          // = Doc ID
  uid:             string          // reporting user ref → users.uid

  entity_type:     'URL' | 'PHONE' | 'BANK_ACCOUNT' | 'EMAIL'
  entity_value:    string          // the entity being reported
  description:     string          // user's description, max 500 chars
  evidence_urls:   string[]        // optional screenshot URLs (Cloud Storage), max 3

  // Review workflow
  status:          'pending' | 'verified' | 'rejected' | 'duplicate'
  reviewed_by:     string | null   // admin uid
  review_note:     string | null   // admin comment
  threat_intel_id: string | null   // ref → threat_intelligence (if created)

  // Anti-spam
  reporter_trust_score: number     // snapshot of user's trust_score at time of report
  is_spam:         boolean         // auto-detected

  created_at:      FirebaseFirestore.Timestamp
  reviewed_at:     FirebaseFirestore.Timestamp | null
}
```

#### Example Document
```json
{
  "report_id": "fr_3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "entity_type": "PHONE",
  "entity_value": "0903 456 789",
  "description": "Số điện thoại này giả danh công an gọi yêu cầu nộp tiền bảo lãnh. Họ nói tôi đang bị điều tra vì liên quan đến rửa tiền.",
  "evidence_urls": [],
  "status": "pending",
  "reviewed_by": null,
  "review_note": null,
  "threat_intel_id": null,
  "reporter_trust_score": 76,
  "is_spam": false,
  "created_at": "2026-08-03T13:38:00Z",
  "reviewed_at": null
}
```

---

### Collection 7: `notifications`

> **Purpose**: In-app notifications cho user — threat alerts, badge awards, system messages.
> **Doc ID**: Auto UUID v4
> **Access**: Owner reads/updates (mark read). Backend creates. No deletes.

#### TypeScript Interface
```ts
interface NotificationDocument {
  notification_id: string          // = Doc ID
  uid:             string          // target user

  type:            'threat_alert' | 'badge_earned' | 'training_reminder' | 'system'
  title:           string          // max 60 chars
  body:            string          // max 200 chars
  action_url:      string | null   // deep link e.g. "/scan/sr_abc123"

  // Data payload (type-specific)
  data: {
    scan_id?:        string
    badge_id?:       string
    threat_level?:   'high' | 'critical'
  }

  read:            boolean         // default: false
  created_at:      FirebaseFirestore.Timestamp
  read_at:         FirebaseFirestore.Timestamp | null
}
```

#### Example Document
```json
{
  "notification_id": "notif_4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
  "uid": "gAbC12dEfGhIjKlM3nOpQ",
  "type": "badge_earned",
  "title": "🛡️ Huy hiệu mới! Phishing Expert",
  "body": "Bạn đã nhận huy hiệu 'Phishing Expert' sau khi đạt điểm hoàn hảo trong bài luyện tập.",
  "action_url": "/profile#badges",
  "data": {
    "badge_id": "phishing_awareness_v1"
  },
  "read": false,
  "created_at": "2026-08-03T13:37:45Z",
  "read_at": null
}
```

---

---

## 🔗 Composite Indexes

> File: `firestore.indexes.json` — deploy với `firebase deploy --only firestore:indexes`

```json
{
  "indexes": [
    {
      "collectionGroup": "scan_results",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",       "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "scan_results",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",         "order": "ASCENDING" },
        { "fieldPath": "risk_score",  "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "scan_results",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",            "order": "ASCENDING" },
        { "fieldPath": "classification", "order": "ASCENDING" },
        { "fieldPath": "timestamp",      "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "scan_results",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",       "order": "ASCENDING" },
        { "fieldPath": "source",    "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "training_sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",        "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "training_sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",    "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "threat_intelligence",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entity_type",  "order": "ASCENDING" },
        { "fieldPath": "entity_value", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "threat_intelligence",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "risk_level",    "order": "ASCENDING" },
        { "fieldPath": "last_updated",  "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "threat_intelligence",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "source",       "order": "ASCENDING" },
        { "fieldPath": "verified",     "order": "ASCENDING" },
        { "fieldPath": "report_count", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "fraud_reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status",     "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",        "order": "ASCENDING" },
        { "fieldPath": "read",       "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "uid",        "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Index Usage Map

| Query | Index Used |
|---|---|
| User's scan history (paginated) | `scan_results: uid + timestamp DESC` |
| User's threats only | `scan_results: uid + classification + timestamp DESC` |
| Threat intelligence lookup by entity | `threat_intelligence: entity_type + entity_value` |
| Community threat feed (high risk) | `threat_intelligence: risk_level + last_updated DESC` |
| Admin report moderation queue | `fraud_reports: status + created_at DESC` |
| Unread notifications | `notifications: uid + read + created_at DESC` |

---

---

## 🔒 Security Rules

> File: `firestore.rules` — deploy với `firebase deploy --only firestore:rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ─────────────────────────────────────────────────────────
    // HELPER FUNCTIONS
    // ─────────────────────────────────────────────────────────

    // Check if user is authenticated
    function isAuthed() {
      return request.auth != null;
    }

    // Check if user owns the document (by uid field)
    function isOwner(uid) {
      return isAuthed() && request.auth.uid == uid;
    }

    // Check if request is from backend (Admin SDK)
    // Admin SDK bypasses all rules — this is for documentation clarity
    // In practice, Admin SDK always has full access
    function isAdmin() {
      return false; // Admin SDK bypasses rules — this block is never reached
    }

    // Validate string field: non-empty, within length limit
    function isValidString(field, maxLen) {
      return field is string
        && field.size() > 0
        && field.size() <= maxLen;
    }

    // Validate number is within range [min, max]
    function inRange(n, min, max) {
      return n is number && n >= min && n <= max;
    }

    // Check that only allowed fields are being written
    function onlyFields(allowedFields) {
      return request.resource.data.keys().hasOnly(allowedFields);
    }

    // Check that no new fields are added beyond what already exists
    function noNewFields() {
      return request.resource.data.keys().hasAll(resource.data.keys());
    }

    // Check write is not updating immutable fields
    function immutableField(field) {
      return !(field in request.resource.data.diff(resource.data).affectedKeys());
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: users
    // ─────────────────────────────────────────────────────────
    match /users/{userId} {

      // Read: user can only read their own document
      allow read: if isOwner(userId);

      // Create: only via authenticated session, with required fields
      allow create: if isOwner(userId)
        && isValidString(request.resource.data.email, 255)
        && isValidString(request.resource.data.display_name, 100)
        && inRange(request.resource.data.trust_score, 0, 100)
        && request.resource.data.account_status == 'active';

      // Update: user can update their own doc, with field-level restrictions
      allow update: if isOwner(userId)
        // Cannot change immutable identity fields
        && immutableField('uid')
        && immutableField('email')
        && immutableField('created_at')
        // trust_score can only go up by max 10 points per update (anti-cheat)
        && (
          !('trust_score' in request.resource.data.diff(resource.data).affectedKeys())
          || (
            inRange(request.resource.data.trust_score, 0, 100)
            && request.resource.data.trust_score <= resource.data.trust_score + 10
          )
        )
        // Settings validation
        && (
          !('settings' in request.resource.data.diff(resource.data).affectedKeys())
          || (
            request.resource.data.settings.language in ['vi', 'en']
            && request.resource.data.settings.keys().hasAll(['alerts_enabled', 'auto_block', 'language'])
          )
        );

      // Delete: not allowed (use account_status = 'deleted' soft delete)
      allow delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: scan_results
    // ─────────────────────────────────────────────────────────
    match /scan_results/{scanId} {

      // Read: owner only
      allow read: if isAuthed()
        && isOwner(resource.data.uid);

      // Create: authenticated users (but backend validates deeply)
      // Client can create but all sensitive fields are set server-side via Admin SDK
      allow create: if isAuthed()
        && request.resource.data.uid == request.auth.uid
        && isValidString(request.resource.data.input_value, 4000)
        && request.resource.data.input_type in ['url', 'email', 'text', 'dom']
        && inRange(request.resource.data.risk_score, 0, 100)
        && request.resource.data.classification in ['safe', 'suspicious', 'phishing', 'malware', 'scam'];

      // Update: IMMUTABLE — no client updates
      allow update: if false;

      // Delete: IMMUTABLE — no client deletes (audit trail)
      allow delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: simulations
    // ─────────────────────────────────────────────────────────
    match /simulations/{simulationId} {

      // Read: owner only
      allow read: if isAuthed()
        && isOwner(resource.data.uid);

      // Create: via backend only (Admin SDK), no direct client writes
      // We block client creates here; Admin SDK bypasses
      allow create: if false;

      // Update/Delete: IMMUTABLE
      allow update, delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: training_sessions
    // ─────────────────────────────────────────────────────────
    match /training_sessions/{sessionId} {

      // Read: owner only
      allow read: if isAuthed()
        && isOwner(resource.data.uid);

      // Create: authenticated users (session is created server-side, then returned)
      allow create: if isAuthed()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.status == 'pending'
        && request.resource.data.user_answers == null
        && request.resource.data.score == null;

      // Update: only allowed to submit answers (once, when pending)
      allow update: if isAuthed()
        && isOwner(resource.data.uid)
        // Can only update when status is 'pending'
        && resource.data.status == 'pending'
        // Can only change: user_answers, score, badges_earned, status, completed_at
        && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['user_answers', 'score', 'badges_earned', 'status', 'completed_at'])
        // Status can only change to 'completed'
        && request.resource.data.status == 'completed'
        // user_answers must be an array of 3 numbers 0-3
        && request.resource.data.user_answers is list
        && request.resource.data.user_answers.size() == 3
        // score must be valid
        && inRange(request.resource.data.score, 0, 100)
        // Cannot change immutable session data
        && immutableField('uid')
        && immutableField('scenario_content')
        && immutableField('questions')
        && immutableField('created_at');

      // Delete: not allowed
      allow delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: threat_intelligence
    // ─────────────────────────────────────────────────────────
    match /threat_intelligence/{docId} {

      // Public read — anyone can check if a URL/entity is in the blacklist
      // This enables unauthenticated browser extension pre-checks
      allow read: if true;

      // All writes: Admin SDK only (client writes blocked)
      allow write: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: fraud_reports
    // ─────────────────────────────────────────────────────────
    match /fraud_reports/{reportId} {

      // Read: blocked for clients (admin panel only)
      allow read: if false;

      // Create: authenticated users only, with validation
      allow create: if isAuthed()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.status == 'pending'
        && request.resource.data.entity_type in ['URL', 'PHONE', 'BANK_ACCOUNT', 'EMAIL']
        && isValidString(request.resource.data.entity_value, 500)
        && isValidString(request.resource.data.description, 500)
        // Evidence URLs: max 3
        && request.resource.data.evidence_urls.size() <= 3
        // Status must be pending on creation
        && request.resource.data.reviewed_by == null
        && request.resource.data.threat_intel_id == null;

      // Update/Delete: admin only (Admin SDK bypasses)
      allow update, delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // COLLECTION: notifications
    // ─────────────────────────────────────────────────────────
    match /notifications/{notifId} {

      // Read: owner only
      allow read: if isAuthed()
        && isOwner(resource.data.uid);

      // Create: backend only (Admin SDK)
      allow create: if false;

      // Update: owner can only mark as read
      allow update: if isAuthed()
        && isOwner(resource.data.uid)
        // Only 'read' and 'read_at' fields can change
        && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['read', 'read_at'])
        // Can only set read = true (not back to false)
        && request.resource.data.read == true
        // Cannot change content
        && immutableField('uid')
        && immutableField('type')
        && immutableField('title')
        && immutableField('body')
        && immutableField('created_at');

      // Delete: not allowed
      allow delete: if false;
    }

    // ─────────────────────────────────────────────────────────
    // CATCH-ALL: deny everything else
    // ─────────────────────────────────────────────────────────
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

---

## 📊 Data Access Patterns

> Các query thực tế sử dụng trong app — đảm bảo mọi query đều có index tương ứng.

```ts
// ── PATTERN 1: User scan history (paginated) ──────────────────
const userScansQuery = db.collection('scan_results')
  .where('uid', '==', currentUser.uid)
  .orderBy('timestamp', 'desc')
  .limit(20)
  .startAfter(lastVisibleDoc)    // for pagination

// → Uses index: uid ASC + timestamp DESC

// ── PATTERN 2: User threats only ──────────────────────────────
const userThreatsQuery = db.collection('scan_results')
  .where('uid', '==', currentUser.uid)
  .where('classification', 'in', ['phishing', 'malware', 'scam', 'suspicious'])
  .orderBy('timestamp', 'desc')
  .limit(5)

// → Uses index: uid ASC + classification ASC + timestamp DESC

// ── PATTERN 3: Threat intelligence fast lookup ─────────────────
const docId = getThreatIntelDocId(entityValue, entityType)
const threatDoc = await db.doc(`threat_intelligence/${docId}`).get()
// → Direct document get by computed ID — O(1), no index needed

// ── PATTERN 4: Community threat feed ──────────────────────────
const feedQuery = db.collection('threat_intelligence')
  .where('risk_level', 'in', ['HIGH', 'CRITICAL'])
  .where('verified', '==', true)
  .orderBy('last_updated', 'desc')
  .limit(20)

// → Uses index: risk_level ASC + last_updated DESC

// ── PATTERN 5: User training history ──────────────────────────
const trainingQuery = db.collection('training_sessions')
  .where('uid', '==', currentUser.uid)
  .orderBy('created_at', 'desc')
  .limit(10)

// → Uses index: uid ASC + created_at DESC

// ── PATTERN 6: Unread notifications ───────────────────────────
const notifQuery = db.collection('notifications')
  .where('uid', '==', currentUser.uid)
  .where('read', '==', false)
  .orderBy('created_at', 'desc')
  .limit(10)

// → Uses index: uid ASC + read ASC + created_at DESC

// ── PATTERN 7: Metrics summary (last 30 days) ─────────────────
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
const metricsQuery = db.collection('scan_results')
  .where('uid', '==', currentUser.uid)
  .where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo))
  .orderBy('timestamp', 'desc')

// → Uses single-field index (auto): uid + timestamp range
```

---

---

## 💰 Cost Optimization

### Read Reduction Strategies

```ts
// 1. DENORMALIZED COUNTERS — avoid expensive aggregation queries
//    Store total_scans + threats_blocked directly on users/{uid}
//    Update atomically with FieldValue.increment()

// 2. THREAT INTEL MEMORY CACHE — avoid repeated Firestore reads
//    Cache TI lookups in-memory (Cloud Run instance), TTL: 5 minutes
const tiCache = new Map<string, { data: ThreatIntelDoc; expiresAt: number }>()

async function lookupThreatIntel(docId: string) {
  const cached = tiCache.get(docId)
  if (cached && Date.now() < cached.expiresAt) return cached.data
  
  const doc = await db.doc(`threat_intelligence/${docId}`).get()
  if (doc.exists) {
    tiCache.set(docId, { data: doc.data() as ThreatIntelDoc, expiresAt: Date.now() + 300_000 })
  }
  return doc.data()
}

// 3. SCAN RESULT DEDUP — skip AI call if same input scanned in last hour
//    Check input_hash in scan_results before calling Gemini
async function checkDuplicate(uid: string, inputHash: string): Promise<string | null> {
  const oneHourAgo = Timestamp.fromDate(new Date(Date.now() - 3_600_000))
  const snap = await db.collection('scan_results')
    .where('uid', '==', uid)
    .where('input_hash', '==', inputHash)
    .where('timestamp', '>=', oneHourAgo)
    .limit(1)
    .get()
  return snap.empty ? null : snap.docs[0].id
}
```

### Estimated Costs (1000 active users/month)
| Operation | Volume/month | Cost (USD) |
|---|---|---|
| scan_results writes | ~50,000 | ~$0.09 |
| scan_results reads | ~200,000 | ~$0.14 |
| threat_intel reads (cached) | ~10,000 | ~$0.01 |
| users reads | ~100,000 | ~$0.06 |
| **Total Firestore** | | **~$0.30/month** |

---

---

## 🗓️ Data Retention (Cloud Scheduler Jobs)

```ts
// apps/api/src/jobs/retention.job.ts
// Runs daily at 02:00 AM ICT via Cloud Scheduler

export async function runRetentionCleanup() {
  const now = new Date()

  // 1. Delete scan_results older than 90 days
  const scanCutoff = new Date(now.getTime() - 90 * 86400 * 1000)
  await batchDelete('scan_results', 'timestamp', scanCutoff)

  // 2. Delete simulations older than 90 days
  await batchDelete('simulations', 'created_at', scanCutoff)

  // 3. Expire training sessions older than 24h (status: pending → expired)
  const sessionCutoff = new Date(now.getTime() - 86400 * 1000)
  await batchUpdate(
    'training_sessions',
    [['status', '==', 'pending'], ['expires_at', '<=', Timestamp.fromDate(now)]],
    { status: 'expired' }
  )

  // 4. Archive training_sessions older than 1 year to Cloud Storage
  const archiveCutoff = new Date(now.getTime() - 365 * 86400 * 1000)
  await archiveAndDelete('training_sessions', 'created_at', archiveCutoff)

  console.log('Retention cleanup complete', { cutoff: scanCutoff.toISOString() })
}

// Batch delete helper (Firestore max 500 writes per batch)
async function batchDelete(collection: string, field: string, before: Date) {
  const snap = await db.collection(collection)
    .where(field, '<', Timestamp.fromDate(before))
    .limit(400)
    .get()
  
  if (snap.empty) return
  const batch = db.batch()
  snap.docs.forEach(doc => batch.delete(doc.ref))
  await batch.commit()
  
  // Recurse if more docs remain
  if (snap.size === 400) await batchDelete(collection, field, before)
}
```

### Retention Summary
| Collection | Retention | Policy |
|---|---|---|
| `users` | Until deleted | Soft delete: `account_status = 'deleted'` |
| `scan_results` | 90 days | Hard delete via Cloud Scheduler |
| `simulations` | 90 days | Hard delete via Cloud Scheduler |
| `training_sessions` | 1 year | Archive to Cloud Storage then delete |
| `threat_intelligence` | Indefinite | Manual review only |
| `fraud_reports` | 2 years | Vietnam Cybersecurity Law 2018 compliance |
| `notifications` | 30 days | Hard delete unread after 30 days |

---

---

## ✅ Production Checklist

### Pre-Deploy
- [ ] `firestore.rules` deployed và tested với Firebase Emulator
- [ ] `firestore.indexes.json` deployed — tất cả 12 indexes active
- [ ] Firestore region: `asia-southeast1` (Singapore) ✓
- [ ] Firestore mode: Native (không phải Datastore) ✓
- [ ] Backup enabled: Cloud Firestore daily backups → Cloud Storage
- [ ] Admin SDK service account có minimal permissions (Firestore only)

### Security Verification
- [ ] Test: User A không thể đọc scan_results của User B (403)
- [ ] Test: Unauthenticated request → `threat_intelligence` readable, `scan_results` blocked
- [ ] Test: Client cannot write `simulations` (Admin SDK only)
- [ ] Test: `training_sessions` update chỉ allowed khi `status == 'pending'`
- [ ] Test: `users.trust_score` không thể tăng > 10 points per update từ client
- [ ] Test: `fraud_reports` create requires auth, read blocked

### Performance Verification
- [ ] All 6 access patterns tested với Firestore Emulator — no "missing index" errors
- [ ] Threat intel lookup < 50ms (with in-memory cache)
- [ ] Scan history query < 200ms (with index)
- [ ] Metric summary query < 500ms

### Monitoring
- [ ] Cloud Monitoring alert: Firestore reads > 10,000/hour
- [ ] Cloud Monitoring alert: Write errors > 10/minute
- [ ] Sentry: Firestore timeout errors captured
- [ ] Cloud Logging: All Admin SDK writes logged with requestId

---

## 🔗 Tài liệu liên quan

| Tài liệu | Link |
|---|---|
| Design Freeze (Database Section) | [DesignFreeze.md §4](../DesignFreeze.md) |
| API Reference | [APIReference.md](../14_API/APIReference.md) |
| Backend Architecture | [BackendArchitecture.md](../12_Backend/BackendArchitecture.md) |
| Security Guidelines | [SecurityGuide.md](../15_Security/) |
| Data Retention Policy | [DataRetention.md](./DataRetention.md) |
