# 🎯 RECOMMEND PROMPT LIBRARY
### Agent: RecommendationAgent | Model: `gemini-2.5-pro` | Version: v1.0.0-FROZEN
### Source: [AgentArchitecture.md](../../10_Agent/AgentArchitecture.md) | Temperature: 0.2 | Max Tokens: 512

---

## System Prompt — Recommend v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Recommendation Agent — the Action Advisor of the Internet Immune System.
Your job: give the user 3 concrete, specific actions they should take RIGHT NOW
after a threat has been detected.

─── PERSONALIZATION BY TRUST SCORE ──────────────────────────────
trust_score < 40   → BEGINNER: Ultra simple. Focus on 2 things: don't click + call.
                     No jargon. One sentence per action. Short and memorable.
trust_score 40–70 → STANDARD: Explain WHY for each action. Include verification step.
                     2-3 sentences per action.
trust_score > 70  → ADVANCED: Technical detail welcome. Include forensic step (check login history).
                     Mention account hygiene, 2FA, freeze option.

─── ACTION QUALITY RULES ────────────────────────────────────────
Each immediate_action MUST:
1. Start with an action verb (Đừng / Gọi / Kiểm tra / Báo cáo / Kích hoạt / Đổi / Đóng)
2. Be specific — not vague ("Hãy cẩn thận" is NOT acceptable)
3. Reference actual tools/channels when possible (hotline, app, website, police)
4. Be achievable in < 5 minutes

─── HOTLINE REFERENCE (use when relevant to detected brand) ────
Vietcombank:     1800 1218 (24/7)
VietinBank:      1800 1507 (24/7)
BIDV:            1900 9247 (24/7)
Agribank:        1900 558 818 (24/7)
Techcombank:     1800 588 822 (24/7)
MB Bank:         1800 545454 (24/7)
TPBank:          1800 585 807
Momo:            1900 54 54 41
ZaloPay:         1900 54 54 68
VNPay:           1900 55 77
Cybercrime Police (Cục An ninh mạng): 113 or portal.ncsc.gov.vn
Consumer Protection (Cục BVNTD):     1800 599 918

─── COMMUNITY REPORTING LOGIC ───────────────────────────────────
should_report = true if:
  - risk_score >= 60 (HIGH threat — community should know)
  - classification in ['phishing', 'malware', 'scam']
  - entity is a URL or phone number (reportable entities)

should_report = false if:
  - classification in ['suspicious', 'safe']
  - risk_score < 40

─── OUTPUT RULES ────────────────────────────────────────────────
- immediate_actions: EXACTLY 3 items, verb-first, specific
- protection_tip: 1 long-term habit, max 120 chars, memorable
- report_prompt: call-to-action, mention community protection effect
- hotline: relevant number or null (do NOT fabricate)
- No text outside JSON
```

---

## User Prompt Template

```
Generate specific, actionable recommendations for a user who just encountered this threat.

── THREAT SUMMARY ────────────────────────────────────────────────
Classification: {{classification}}
Risk Score: {{risk_score}}/100
URL / Entity: {{url | entity_value | "N/A"}}
Domain: {{domain | "N/A"}}
Primary Threat Type: {{primary_red_flag_label | "Unknown"}}

Detected Red Flags:
{{#each red_flags}}
- [{{severity}}] {{label}}
{{/each}}

── USER PROFILE ──────────────────────────────────────────────────
Trust Score: {{trust_score}} / 100
Language: {{language | "vi"}}
Auto-block enabled: {{auto_block | false}}

── TASK ──────────────────────────────────────────────────────────
1. Provide exactly 3 immediate actions the user should take RIGHT NOW
   Calibrate complexity to trust_score {{trust_score}}
2. Write one 30-day protection_tip to build long-term immunity
3. Decide if user should file a community report (should_report) and write a brief prompt
4. Include the relevant hotline if the threat impersonates a known Vietnamese institution

Respond ONLY with valid JSON:
```

---

## Output Format

### JSON Schema
```typescript
interface RecommendOutput {
  immediate_actions: string[]    // EXACTLY 3 items, verb-first
  protection_tip:   string       // max 120 chars, long-term habit
  should_report:    boolean
  report_prompt:    string       // CTA, max 80 chars
  hotline:          string | null // e.g. "1800 1218 (Vietcombank, 24/7)" or null
}
```

### Gemini `responseSchema`
```typescript
const recommendResponseSchema = {
  type: 'OBJECT',
  required: ['immediate_actions', 'protection_tip', 'should_report', 'report_prompt'],
  properties: {
    immediate_actions: {
      type: 'ARRAY', minItems: 3, maxItems: 3,
      items: { type: 'STRING', maxLength: 200 }
    },
    protection_tip:  { type: 'STRING', maxLength: 120 },
    should_report:   { type: 'BOOLEAN' },
    report_prompt:   { type: 'STRING', maxLength: 80 },
    hotline:         { type: 'STRING', nullable: true },
  }
}
```

### Example — Phishing (trust_score = 55, Vietcombank impersonation)
```json
{
  "immediate_actions": [
    "Đóng trang web đó ngay lập tức — không nhập bất kỳ thông tin gì, kể cả chỉ xem",
    "Gọi hotline Vietcombank 1800 1218 ngay bây giờ để kiểm tra xem tài khoản của bạn có thực sự có vấn đề không — chỉ mất 2 phút",
    "Đổi mật khẩu internet banking của bạn trong app ngân hàng chính thức (không qua bất kỳ link nào)"
  ],
  "protection_tip": "Lưu hotline của tất cả ngân hàng bạn dùng vào danh bạ — khi nghi ngờ, gọi thẳng, không click link.",
  "should_report": true,
  "report_prompt": "Báo cáo để bảo vệ 1.200 người dùng khác khỏi trang này",
  "hotline": "1800 1218 (Vietcombank, 24/7)"
}
```

### Example — Investment Scam (trust_score = 80, ADVANCED)
```json
{
  "immediate_actions": [
    "Đừng chuyển thêm tiền nào — nếu đã chuyển, ngay lập tức liên hệ ngân hàng để yêu cầu freeze giao dịch (gọi 1800 theo số trên thẻ)",
    "Kiểm tra lịch sử đăng nhập tài khoản ngân hàng và Momo/ZaloPay qua app chính thức — xem có truy cập lạ không, nếu có, kích hoạt 2FA ngay",
    "Báo cáo số điện thoại / tài khoản nhận tiền lên Cục An ninh mạng tại portal.ncsc.gov.vn — cung cấp bằng chứng sẽ giúp điều tra"
  ],
  "protection_tip": "Lợi nhuận đầu tư thật không bao giờ được 'đảm bảo' — 300% là con số cần báo động đỏ ngay.",
  "should_report": true,
  "report_prompt": "Báo cáo tài khoản lừa đảo này để cảnh báo cộng đồng",
  "hotline": "113 hoặc portal.ncsc.gov.vn (Cục An ninh mạng)"
}
```

### Example — Suspicious (low risk, trust_score = 30, BEGINNER)
```json
{
  "immediate_actions": [
    "Đừng nhấp vào link trong tin nhắn này — hãy đóng lại",
    "Nếu bạn muốn kiểm tra thông tin, hãy gõ trực tiếp địa chỉ website vào trình duyệt",
    "Hỏi người thân hoặc dùng Internet Immune System để quét link này trước"
  ],
  "protection_tip": "Không bao giờ nhấp link trong SMS — luôn gõ địa chỉ trực tiếp.",
  "should_report": false,
  "report_prompt": "",
  "hotline": null
}
```

---

## Fallback Response

```json
{
  "immediate_actions": [
    "Không nhấp vào bất kỳ link nào hoặc tải file từ nguồn này",
    "Liên hệ tổ chức liên quan qua số điện thoại trên website hoặc thẻ chính thức của họ",
    "Báo cáo cho cộng đồng Internet Immune System nếu bạn nghi ngờ đây là lừa đảo"
  ],
  "protection_tip": "Khi nghi ngờ, luôn xác minh qua kênh chính thức — không qua link trong tin nhắn.",
  "should_report": true,
  "report_prompt": "Giúp bảo vệ cộng đồng bằng cách báo cáo mối đe dọa này",
  "hotline": null
}
```

---

## Guardrails

### Pre-call
```typescript
// Validate inputs
if (!input.classification) throw new AgentError('MISSING_CLASSIFICATION')
if (!input.redFlags || !Array.isArray(input.redFlags)) input.redFlags = []

// Compute should_report hint for prompt
const shouldReportHint =
  input.riskScore >= 60 ||
  ['phishing', 'malware', 'scam'].includes(input.classification)
```

### Post-call
```typescript
function applyRecommendGuardrails(raw: RecommendOutput, input: RecommendationInput): RecommendOutput {
  // GUARDRAIL 1: Exactly 3 immediate_actions
  if (!raw.immediate_actions || raw.immediate_actions.length !== 3) {
    raw.immediate_actions = FALLBACK_RECOMMEND.immediate_actions
  }

  // GUARDRAIL 2: Each action must not be empty or < 10 chars
  raw.immediate_actions = raw.immediate_actions.map((action, i) => {
    if (!action || action.trim().length < 10) {
      return FALLBACK_RECOMMEND.immediate_actions[i]
    }
    return action.slice(0, 200)  // truncate to max
  })

  // GUARDRAIL 3: Validate hotline format (must match known hotline list or be null)
  const KNOWN_HOTLINES = ['1800', '1900', '113', 'portal.ncsc']
  if (raw.hotline) {
    const isKnown = KNOWN_HOTLINES.some(h => raw.hotline!.includes(h))
    if (!isKnown) {
      console.warn('[GUARDRAIL-3] Unknown hotline fabricated by AI — setting null', raw.hotline)
      raw.hotline = null  // never fabricate a hotline
    }
  }

  // GUARDRAIL 4: If should_report is true, report_prompt must not be empty
  if (raw.should_report && (!raw.report_prompt || raw.report_prompt.trim().length < 5)) {
    raw.report_prompt = 'Báo cáo để bảo vệ cộng đồng khỏi mối đe dọa này'
  }

  // GUARDRAIL 5: protection_tip length
  raw.protection_tip = (raw.protection_tip ?? '').slice(0, 120)
  if (raw.protection_tip.length < 5) {
    raw.protection_tip = FALLBACK_RECOMMEND.protection_tip
  }

  return raw
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Hotline registry. Trust-score calibration. |
