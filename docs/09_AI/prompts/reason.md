# 🧠 REASON PROMPT LIBRARY
### Agent: ReasoningAgent | Model: `gemini-2.5-pro` | Version: v1.0.0-FROZEN
### Source: [DesignFreeze.md §5.5](../../DesignFreeze.md) | Temperature: 0.3 | Max Tokens: 1024

---

## System Prompt — Reason v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Reasoning Agent — the Educator of the Internet Immune System.
Your job: explain WHY detected threats are dangerous, in language
that builds long-term fraud awareness for everyday Vietnamese internet users.

─── AUDIENCE CALIBRATION ────────────────────────────────────────
trust_score < 40  → BASIC: Use very simple language. Max 2-sentence explanations.
                    Focus on: "don't click" + one reason why.
trust_score 40–70 → STANDARD: Explain mechanism + what could happen.
                    Include: the technique name + real consequence.
trust_score > 70  → ADVANCED: Include technical terms (with plain translation).
                    Include: attack chain + how attackers operationalize the data.

─── EXPLANATION PRINCIPLES ──────────────────────────────────────
1. Simple Vietnamese — Grade 8 reading level. No jargon without explanation.
2. Explain the MECHANISM (how the attack works), not just the label.
3. Ground in real consequences: lost money, stolen identity, account takeover.
4. Each red_flag explanation: 40–120 characters.
5. ai_narrative: 150–300 characters.
6. Never mention specific real account numbers, victim names, or case IDs.
7. End with ONE concrete, memorable action tip.

─── BANNED JARGON (must translate if used) ──────────────────────
SQL injection → "chèn mã độc vào database"
XSS          → "đoạn mã chạy trong trình duyệt"
MITM         → "nghe lén giữa đường truyền"
Phishing     → "lừa đảo giả mạo"
Malware      → "phần mềm độc hại"

─── IMMUNITY POINTS LOGIC ───────────────────────────────────────
risk_score ≥ 80 OR red_flag_count ≥ 4 → immunity_points_earned: 15
risk_score ≥ 50 OR red_flag_count ≥ 2 → immunity_points_earned: 10
else                                   → immunity_points_earned: 5

─── OUTPUT RULES ────────────────────────────────────────────────
- No text outside JSON.
- what_to_do: exactly 3 items, action-oriented, start with a verb.
- educational_tip: 1 memorable phrase, max 120 characters.
- Each learn_more: specific, actionable, max 100 characters.
```

---

## User Prompt Template

```
Explain the following threat detection result to the user in simple, educational Vietnamese.

── SCAN RESULT ───────────────────────────────────────────────────
Classification: {{classification}}
Risk Score: {{risk_score}}/100
Content Type: {{content_type}}
URL: {{url | "N/A"}}
Content Preview (first 200 chars): {{content_preview}}

Red Flags Detected:
{{#each red_flags}}
- [{{severity}}] {{label}}: {{description}}
{{/each}}

── USER PROFILE ──────────────────────────────────────────────────
Trust Score: {{trust_score}} / 100
Language preference: {{language | "vi"}}
Explanation depth: {{depth | "detailed"}}

── TASK ──────────────────────────────────────────────────────────
1. Write an ai_narrative explaining what this threat is and how it works (150–300 chars)
2. For each red_flag, write explanation (40–120 chars) + learn_more (actionable, max 100 chars)
3. Write exactly 3 immediate what_to_do actions, start each with an action verb
4. Write one educational_tip — a memorable rule for life (max 120 chars)
5. Calculate immunity_points_earned based on risk_score and red_flag count

Calibrate language complexity to trust_score {{trust_score}}:
{{#if (lt trust_score 40)}}Use very simple language, 1-2 sentence explanations, focus on "do not click."{{/if}}
{{#if (between trust_score 40 70)}}Explain the mechanism briefly with the consequence.{{/if}}
{{#if (gte trust_score 70)}}Include technical detail and the full attack chain.{{/if}}

Respond ONLY with valid JSON:
```

---

## Output Format

### JSON Schema
```typescript
interface ReasonOutput {
  ai_narrative: string              // 150–300 chars, Vietnamese
  red_flag_details: {
    flag_id:     string             // matches red_flag.id from detect output
    label:       string             // display label
    explanation: string             // 40–120 chars, plain Vietnamese
    learn_more:  string             // actionable tip, max 100 chars
  }[]
  what_to_do:           string[]    // exactly 3 items, verb-first
  educational_tip:      string      // max 120 chars
  immunity_points_earned: 5 | 10 | 15
}
```

### Gemini `responseSchema`
```typescript
const reasonResponseSchema = {
  type: 'OBJECT',
  required: ['ai_narrative', 'red_flag_details', 'what_to_do', 'educational_tip', 'immunity_points_earned'],
  properties: {
    ai_narrative: { type: 'STRING', minLength: 50, maxLength: 300 },
    red_flag_details: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        required: ['flag_id', 'label', 'explanation', 'learn_more'],
        properties: {
          flag_id:     { type: 'STRING' },
          label:       { type: 'STRING' },
          explanation: { type: 'STRING', maxLength: 120 },
          learn_more:  { type: 'STRING', maxLength: 100 },
        }
      }
    },
    what_to_do: {
      type: 'ARRAY', minItems: 3, maxItems: 3,
      items: { type: 'STRING', maxLength: 150 }
    },
    educational_tip:       { type: 'STRING', maxLength: 120 },
    immunity_points_earned: { type: 'NUMBER', enum: [5, 10, 15] },
  }
}
```

### Example Output (phishing, trust_score = 65)
```json
{
  "ai_narrative": "Kẻ tấn công tạo trang web trông giống Vietcombank để lừa bạn nhập mật khẩu. Khi bạn điền vào, thông tin lập tức gửi đến máy chủ của họ ở Philippines — và tài khoản của bạn có thể bị rút cạn trong vài phút.",
  "red_flag_details": [
    {
      "flag_id": "fake_domain",
      "label": "Fake Domain Spoofing",
      "explanation": "Tên miền giả, trông giống ngân hàng thật nhưng không phải. Kẻ gian đăng ký domain này để đánh lừa bạn.",
      "learn_more": "Luôn kiểm tra tên miền trên thanh địa chỉ — ngân hàng thật dùng .com.vn chính thức."
    },
    {
      "flag_id": "no_https",
      "label": "Kết nối Không Bảo Mật",
      "explanation": "HTTP không mã hóa — ai cũng có thể đọc dữ liệu bạn nhập nếu dùng WiFi công cộng.",
      "learn_more": "Tìm biểu tượng ổ khóa 🔒 trên thanh địa chỉ — nếu không thấy, đừng nhập gì cả."
    }
  ],
  "what_to_do": [
    "Đóng tab này ngay lập tức — không nhập bất kỳ thông tin nào",
    "Gọi hotline Vietcombank 1800 1218 để xác nhận có thực sự có vấn đề với tài khoản không",
    "Báo cáo đường link này cho cộng đồng IIS để bảo vệ người khác"
  ],
  "educational_tip": "Ngân hàng thật KHÔNG BAO GIỜ gửi link đăng nhập qua SMS hay Zalo — gõ trực tiếp vào trình duyệt.",
  "immunity_points_earned": 15
}
```

### Example Output (suspicious, trust_score = 25 — BASIC)
```json
{
  "ai_narrative": "Đường link này trông đáng ngờ. Chúng tôi chưa thể xác nhận đây là trang an toàn. Hãy thận trọng.",
  "red_flag_details": [
    {
      "flag_id": "urgency_language",
      "label": "Ngôn Ngữ Tạo Áp Lực",
      "explanation": "Tin nhắn cố ý làm bạn sợ để hành động vội vàng. Đây là dấu hiệu lừa đảo.",
      "learn_more": "Khi thấy 'khóa ngay', 'hết hạn hôm nay' — dừng lại và kiểm tra kỹ."
    }
  ],
  "what_to_do": [
    "Đừng nhấp vào bất kỳ link nào trong tin nhắn này",
    "Liên hệ trực tiếp tổ chức qua số điện thoại trên website chính thức",
    "Hỏi người thân hoặc dùng tính năng Phân Tích lại để kiểm tra"
  ],
  "educational_tip": "Khi nghi ngờ, đừng làm gì cả — hỏi người tin cậy trước.",
  "immunity_points_earned": 5
}
```

---

## Fallback Response

> Triggered when: Gemini Pro timeout, safety block, parse error × 2

```json
{
  "ai_narrative": "Nội dung này có dấu hiệu đáng ngờ. Chúng tôi khuyên bạn thận trọng và xác minh qua kênh chính thức trước khi thực hiện bất kỳ hành động nào.",
  "red_flag_details": [],
  "what_to_do": [
    "Không chia sẻ thông tin cá nhân hoặc tài chính qua link này",
    "Liên hệ tổ chức liên quan qua số điện thoại hoặc website chính thức",
    "Báo cáo cho cộng đồng Internet Immune System nếu bạn nghi ngờ đây là lừa đảo"
  ],
  "educational_tip": "Khi nghi ngờ, hãy luôn xác minh qua số điện thoại chính thức — không qua link.",
  "immunity_points_earned": 5
}
```

---

## Guardrails

### Pre-call
```typescript
// Input validation
if (!scanResult) throw new AgentError('SCAN_NOT_FOUND')
if (!scanResult.red_flags || !Array.isArray(scanResult.red_flags)) {
  scanResult.red_flags = []
}

// Content preview: max 200 chars, no PII
const contentPreview = sanitizeInput(scanResult.input_value).slice(0, 200)

// Language validation
const allowedLanguages = ['vi', 'en']
const lang = allowedLanguages.includes(options.language) ? options.language : 'vi'

// Depth validation
const depth = ['simple', 'detailed'].includes(options.depth) ? options.depth : 'detailed'
```

### Post-call
```typescript
function applyReasonGuardrails(raw: ReasonOutput, scan: ScanDocument): ReasonOutput {
  // GUARDRAIL 1: what_to_do must have exactly 3 items
  if (!raw.what_to_do || raw.what_to_do.length !== 3) {
    raw.what_to_do = [
      'Không nhấp vào bất kỳ link nào từ nguồn này',
      'Liên hệ tổ chức qua kênh chính thức',
      'Báo cáo cho cộng đồng IIS',
    ]
  }

  // GUARDRAIL 2: ai_narrative length
  raw.ai_narrative = (raw.ai_narrative ?? '').slice(0, 300)
  if (raw.ai_narrative.length < 50) {
    raw.ai_narrative = 'Nội dung này có dấu hiệu đáng ngờ. Xem chi tiết bên dưới.'
  }

  // GUARDRAIL 3: immunity_points must be 5, 10, or 15
  if (![5, 10, 15].includes(raw.immunity_points_earned)) {
    raw.immunity_points_earned = 5
  }

  // GUARDRAIL 4: No real brand names in educational_tip (prevent hallucination)
  const REAL_BRANDS = ['Vietcombank', 'BIDV', 'VietinBank', 'Agribank']
  // only flag if tip contains brand name + link pattern
  REAL_BRANDS.forEach(brand => {
    if (raw.educational_tip?.includes(brand) && raw.educational_tip?.includes('http')) {
      raw.educational_tip = 'Khi nghi ngờ, hãy luôn xác minh qua số điện thoại chính thức.'
    }
  })

  // GUARDRAIL 5: educational_tip max length
  raw.educational_tip = (raw.educational_tip ?? '').slice(0, 120)

  return raw
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Audience calibration by trust_score. |
