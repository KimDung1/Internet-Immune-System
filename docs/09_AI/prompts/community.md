# 👥 COMMUNITY PROMPT LIBRARY
### Agent: CommunityAgent | Model: `gemini-2.5-flash` | Version: v1.0.0-FROZEN
### Source: [AgentArchitecture.md](../../10_Agent/AgentArchitecture.md) | Temperature: 0.1 | Max Tokens: 256

---

## System Prompt — Community v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Community Agent — the Collective Intelligence processor of the Internet Immune System.
Your job: evaluate community fraud reports to separate genuine threats from spam,
normalize the reported entity, and estimate severity.

─── EVALUATION CRITERIA ─────────────────────────────────────────

SPAM DETECTION — Mark is_spam: true if ANY of these:
  1. description < 20 characters (too short to be genuine)
  2. entity_value looks random, test-like, or clearly nonsensical
     Examples: "test123", "aaaaaaa", "12345", "xxx"
  3. reporter_trust_score < 10 (new user, possibly bot)
  4. description is gibberish or irrelevant to entity_value
  5. Description has no connection to fraud (e.g., "tôi ghét app này")
  6. Same description repeated verbatim (copy-paste spam)

SEVERITY ESTIMATION — estimate based on description keywords:
  CRITICAL → "rút tiền", "chuyển khoản", "mất tiền", "bị hack", "tài khoản bị khóa"
              "lừa đảo đầu tư", "giả danh công an", "bắt cóc", "tống tiền"
  HIGH     → "yêu cầu OTP", "hỏi mật khẩu", "form đăng nhập", "giả mạo ngân hàng"
              "phishing", "link lạ từ SMS", "link yêu cầu cài app"
  MEDIUM   → "gọi điện lạ", "tin nhắn nghi ngờ", "đề nghị việc làm online"
              "quảng cáo kỳ lạ", "không liên hệ được sau giao dịch"
  LOW      → "tôi nghi ngờ", "không chắc chắn", "có vẻ lạ"

ENTITY NORMALIZATION RULES:
  URL/DOMAIN → extract hostname, lowercase, remove www.
               e.g. "HTTP://WWW.Fake-Bank.PH/login" → "fake-bank.ph"
  PHONE     → digits only, remove spaces/dashes
               e.g. "0903 456-789" → "0903456789"
  BANK ACC  → remove spaces: "1234 5678 9012" → "123456789012"
  EMAIL     → lowercase, trim: "Scammer@Gmail.COM " → "scammer@gmail.com"

AUTO-VERIFIABLE (auto-add to TI without manual review):
  true if ALL of these:
  - is_spam: false
  - confidence >= 0.85
  - entity matches known phishing pattern:
    domains: bank-name + [secure/login/verify/support] + [.ph/.cc/.tk/.ga/.ml/.net (not .vn)]
    phones: starts with 09 (non-traceable prepaid) + used in reported scam context

─── OUTPUT RULES ────────────────────────────────────────────────
- No text outside JSON
- spam_reason: concise, < 100 chars (or null if not spam)
- normalized_entity: always return, even if is_spam: true
- confidence: 0.0–1.0, reflects certainty of spam classification
```

---

## User Prompt Template

```
Evaluate this community fraud report for authenticity, normalize the entity, and estimate severity.

── REPORT DETAILS ────────────────────────────────────────────────
Reporter Trust Score: {{reporter_trust_score}} / 100
Entity Type: {{entity_type}}
Entity Value: {{entity_value}}
Description: "{{description}}"
Evidence URLs provided: {{evidence_url_count | 0}} files

── PRE-CHECK CONTEXT ─────────────────────────────────────────────
Reports from this user in last 1 hour: {{reports_last_hour | 0}}
Same entity reported before: {{is_existing_in_ti | false}}
Same description seen recently: {{duplicate_desc_detected | false}}

── TASK ──────────────────────────────────────────────────────────
1. Determine if this is spam (bot / bad-faith / too vague / duplicate)
2. Normalize the entity_value to standard format
3. Estimate severity based on description keywords
4. Determine if entity matches known auto-verifiable patterns
5. Return confidence score for your spam assessment

Respond ONLY with valid JSON:
```

---

## Output Format

### JSON Schema
```typescript
interface CommunityEvalOutput {
  is_spam:           boolean
  spam_reason:       string | null   // < 100 chars, or null
  normalized_entity: string          // cleaned entity value
  entity_type:       'URL' | 'PHONE' | 'BANK_ACCOUNT' | 'EMAIL' | 'DOMAIN'
  estimated_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  is_duplicate:      boolean
  auto_verifiable:   boolean         // can be immediately added to TI
  confidence:        number          // 0.00–1.00
}
```

### Gemini `responseSchema`
```typescript
const communityResponseSchema = {
  type: 'OBJECT',
  required: ['is_spam', 'normalized_entity', 'entity_type', 'estimated_severity', 'is_duplicate', 'auto_verifiable', 'confidence'],
  properties: {
    is_spam:           { type: 'BOOLEAN' },
    spam_reason:       { type: 'STRING', maxLength: 100, nullable: true },
    normalized_entity: { type: 'STRING' },
    entity_type:       { type: 'STRING', enum: ['URL', 'PHONE', 'BANK_ACCOUNT', 'EMAIL', 'DOMAIN'] },
    estimated_severity: { type: 'STRING', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    is_duplicate:      { type: 'BOOLEAN' },
    auto_verifiable:   { type: 'BOOLEAN' },
    confidence:        { type: 'NUMBER', minimum: 0.0, maximum: 1.0 },
  }
}
```

### Example — Legitimate Report
```json
{
  "is_spam": false,
  "spam_reason": null,
  "normalized_entity": "vietcombank-secure-login.ph",
  "entity_type": "DOMAIN",
  "estimated_severity": "CRITICAL",
  "is_duplicate": false,
  "auto_verifiable": true,
  "confidence": 0.95
}
```

### Example — Spam Report
```json
{
  "is_spam": true,
  "spam_reason": "Mô tả quá ngắn và không liên quan đến hành vi lừa đảo",
  "normalized_entity": "test123",
  "entity_type": "URL",
  "estimated_severity": "LOW",
  "is_duplicate": false,
  "auto_verifiable": false,
  "confidence": 0.91
}
```

### Community Feed Prompt (GET /reports/threats)

```
No Gemini call needed for reading feed.
Community feed is served directly from threat_intelligence Firestore collection.
Filtering and sorting is handled by Firestore queries + index.
```

---

## Fallback Response

```json
{
  "is_spam": false,
  "spam_reason": null,
  "normalized_entity": "<entity_value.trim().toLowerCase()>",
  "entity_type": "<input.entity_type>",
  "estimated_severity": "MEDIUM",
  "is_duplicate": false,
  "auto_verifiable": false,
  "confidence": 0.50
}
```

---

## Guardrails

### Pre-call (No-AI Spam Checks)
```typescript
// These checks happen BEFORE calling Gemini — save cost + latency

function preFlightSpamCheck(report: FraudReportInput): SpamCheckResult {
  // 1. Description length
  if (!report.description || report.description.trim().length < 20) {
    return { isSpam: true, reason: 'Mô tả quá ngắn — tối thiểu 20 ký tự' }
  }

  // 2. Entity value sanity check
  const NONSENSE_PATTERNS = [/^(test|aaaa|1234|xxx|asdf|qwerty)/i, /^.{1,3}$/]
  if (NONSENSE_PATTERNS.some(p => p.test(report.entityValue))) {
    return { isSpam: true, reason: 'Giá trị thực thể không hợp lệ — trông như thử nghiệm' }
  }

  // 3. Reporter trust score
  if (report.reporterTrustScore < 10) {
    return { isSpam: true, reason: 'Điểm tin cậy người dùng quá thấp' }
  }

  // 4. Rate limit: same entity from same user in 1h
  const recentSame = getRecentReportsByUser(report.uid, 3600000)
    .filter(r => r.entityHash === sha256(report.entityValue))
  if (recentSame.length >= 3) {
    return { isSpam: true, reason: 'Báo cáo trùng lặp — cùng entity trong vòng 1 giờ' }
  }

  // 5. Rate limit: > 5 reports in 1 hour from same user
  const recentAll = getRecentReportsByUser(report.uid, 3600000)
  if (recentAll.length >= 5) {
    return { isSpam: true, reason: 'Quá nhiều báo cáo trong 1 giờ — có thể là spam' }
  }

  return { isSpam: false, reason: null }
}
```

### Post-call
```typescript
function applyCommunityGuardrails(raw: CommunityEvalOutput): CommunityEvalOutput {
  // GUARDRAIL 1: confidence must be 0.0–1.0
  raw.confidence = Math.min(1.0, Math.max(0.0, raw.confidence ?? 0.5))

  // GUARDRAIL 2: auto_verifiable requires high confidence
  if (raw.auto_verifiable && raw.confidence < 0.85) {
    raw.auto_verifiable = false
    console.warn('[GUARDRAIL-2] auto_verifiable set to false: confidence too low', raw.confidence)
  }

  // GUARDRAIL 3: spam_reason length
  if (raw.spam_reason) raw.spam_reason = raw.spam_reason.slice(0, 100)

  // GUARDRAIL 4: If is_spam is true, auto_verifiable must be false
  if (raw.is_spam) raw.auto_verifiable = false

  // GUARDRAIL 5: normalized_entity must not be empty
  if (!raw.normalized_entity || raw.normalized_entity.trim().length === 0) {
    throw new AgentError('INVALID_NORMALIZED_ENTITY')
  }

  return raw
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Pre-flight spam check. Auto-verify logic. |
