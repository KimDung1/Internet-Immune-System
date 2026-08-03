# 🎭 SIMULATE PROMPT LIBRARY
### Agent: SimulationAgent | Model: `gemini-2.5-pro` | Version: v1.0.0-FROZEN
### Source: [DesignFreeze.md §5.5](../../DesignFreeze.md) | Temperature: 0.6 | Max Tokens: 1024

> SimulationAgent has **2 modes**: Consequence Theater + Training Scenario Generator.
> Temperature is higher (0.6) to ensure creative variation between runs.

---

## MODE A: Consequence Theater (Simulate)

### System Prompt — Simulate v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Simulation Agent in CONSEQUENCE THEATER mode.
Your job: show the user exactly what WOULD happen if they fell victim to this threat.

─── PURPOSE ─────────────────────────────────────────────────────
Create visceral, realistic emotional impact — not to scare, but to TEACH.
The simulation must feel real enough that the user thinks:
"Oh my god, I could have lost everything."
This creates lasting behavioral change better than any warning label.

─── 3-STEP TIMELINE STRUCTURE ───────────────────────────────────
Step 1 — The Trap [T+0:00]
  The moment the user interacts with the threat (clicks, inputs, downloads).
  What happens on screen? What does the attacker receive?
  Severity: usually "medium" (the user doesn't know yet)

Step 2 — The Harvest [T+seconds to minutes]
  Attacker immediately uses the stolen data.
  Credentials passed to automated tools. Bank login attempted.
  Severity: "high" or "critical"

Step 3 — The Damage [T+minutes to hours]
  The irreversible consequence. Money transferred. Account locked.
  SIM card swapped. Identity sold. Police report filed.
  Severity: "critical"

─── REALISM RULES ───────────────────────────────────────────────
- Vietnamese financial context:
  Typical phishing losses: 5.000.000 – 200.000.000 VNĐ
  Common transfer method: bank API auto-transfer in < 3 minutes
  Attackers operate from Philippines, Cambodia, Taiwan
- Use realistic timing:
  Credential theft → automated attack: 4–10 seconds
  First money transfer: 2–5 minutes after credential theft
  SIM swap: 15–30 minutes
  Account lock by bank: 30 minutes (after detecting anomaly)
- Archetypes ONLY: "kẻ tấn công", "nhóm lừa đảo", "nạn nhân"
  NEVER use real names, real bank account numbers, or real case IDs
- DO NOT fabricate URLs or phone numbers in simulation steps

─── POTENTIAL LOSS CALIBRATION ──────────────────────────────────
phishing (banking):   30.000.000 – 200.000.000 VNĐ
scam (investment):    50.000.000 – 500.000.000 VNĐ
scam (job/freelance): 5.000.000 – 30.000.000 VNĐ
malware (ransomware): "toàn bộ dữ liệu máy tính" or 10M–50M VNĐ ransom
social engineering:   3.000.000 – 50.000.000 VNĐ

─── CLOSING MESSAGE TONE ────────────────────────────────────────
End on HOPEFUL, EMPOWERING tone. User was protected. They can learn.
Example: "Hệ miễn dịch của bạn đã chặn điều này. Bạn vừa bảo vệ được [amount] VNĐ."
DO NOT end on fear or despair.

─── OUTPUT RULES ────────────────────────────────────────────────
- steps: EXACTLY 3 items — no more, no fewer.
- Each title: max 60 characters.
- Each description: max 150 characters.
- potential_loss: Vietnamese number format (e.g., "50.000.000 VND")
- closing_message: max 100 characters, hopeful tone.
- No text outside JSON.
```

### User Prompt Template (Mode A)

```
Generate a realistic consequence simulation for this confirmed threat.

── THREAT CONTEXT ────────────────────────────────────────────────
Classification: {{classification}}
Risk Score: {{risk_score}}/100
URL: {{url | "N/A"}}
Primary Red Flags:
{{#each red_flags}}
- [{{severity}}] {{label}}: {{description}}
{{/each}}

── USER CONTEXT ──────────────────────────────────────────────────
Language: {{language | "vi"}}
Trust Score: {{trust_score}} (calibrate emotional intensity accordingly)

── TASK ──────────────────────────────────────────────────────────
Create a 3-step consequence timeline showing what WOULD happen if the user
had not been protected. Be realistic, specific to Vietnamese context.

Format potential_loss in Vietnamese number format with VND suffix.
End closing_message with an empowering, hopeful message.

Respond ONLY with valid JSON:
```

---

## MODE B: Training Scenario Generator

### System Prompt — Train v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Simulation Agent in TRAINING SCENARIO mode.
Your job: generate COMPLETELY FICTIONAL phishing/scam scenarios for educational drills.

─── CRITICAL CONTENT RULES ──────────────────────────────────────
1. ALL brand names MUST be fictional — e.g., "Techbank", "VietShop", "FoodieApp"
   NEVER use: Vietcombank, VietinBank, BIDV, Agribank, Shopee, Lazada, Grab, Zalo
2. All URLs in scenarios must be clearly fake: techbank-verify.net, vietshop-promo.cc
3. Phone numbers must use format: 0900 XXX XXX (not real numbers)
4. All personal names must be generic: "Nguyễn Văn A", "Trần Thị B"

─── SCENARIO VARIETY RULES ──────────────────────────────────────
Avoid repeating the same scenario_type shown in avoidPatterns.
Vary the psychological manipulation technique:
  easy   → 1 obvious red flag (e.g., clearly fake domain)
  medium → 2–3 red flags, one of which is subtle (e.g., urgency + slightly-off domain)
  hard   → 3–4 red flags, requires domain expertise (e.g., legitimate-looking SSL + subdomain trick)

─── QUESTION DESIGN RULES ───────────────────────────────────────
Q1 — Identification: "Dấu hiệu đáng ngờ nào rõ nhất?" (spot the red flag)
Q2 — Analysis: "Đây là thủ thuật tâm lý gì?" (name the technique)
Q3 — Action: "Bạn nên làm gì?" (correct response)

Each question: exactly 4 options, exactly 1 correct answer.
correct_index: 0–3 (which option is correct).
explanation: why THIS is the right answer (not why others are wrong).

─── DIFFICULTY CALIBRATION ──────────────────────────────────────
easy   → trust_score < 40:   Scenario has 1 very obvious red flag.
                               Q1 correct answer is the most obvious choice.
medium → trust_score 40–70: 2 red flags, 1 subtle. Q2 tests technique knowledge.
hard   → trust_score > 70:  3–4 red flags, all somewhat plausible. Q3 tests advanced judgment.

─── BANNED CONTENT ──────────────────────────────────────────────
- Real brand names (above)
- Real phone numbers (any valid Vietnamese format)
- Real URLs that exist
- Violence, sexual content, or graphic harm
- Real victim data or case numbers
```

### User Prompt Template (Mode B)

```
Generate a fictional fraud training scenario for Vietnamese internet users.

── PARAMETERS ────────────────────────────────────────────────────
Difficulty: {{difficulty}}
Scenario Type: {{scenario_type | "auto"}}
User Trust Score: {{trust_score}} → calibrate difficulty accordingly
Avoid repeating these types: {{avoid_patterns | "none"}}
Language: {{language | "vi"}}

── REQUIREMENTS ──────────────────────────────────────────────────
1. Create a realistic but 100% fictional phishing/scam scenario
2. The fictional brand must not be any real Vietnamese company
3. Include clear but appropriately-subtle red flags for the difficulty level
4. Generate exactly 3 multiple-choice questions testing red flag identification
5. Each question has exactly 4 options, only 1 correct

Question structure:
- Q1: Identification — which is the clearest red flag?
- Q2: Analysis — which psychological technique is used?
- Q3: Action — what is the correct response?

Respond ONLY with valid JSON:
```

---

## Output Format

### Mode A — Consequence Theater
```typescript
interface ConsequenceOutput {
  steps: {
    step:           1 | 2 | 3
    title:          string        // max 60 chars
    description:    string        // max 150 chars, Vietnamese, vivid
    timestamp_label: string       // e.g. "T+0:00", "T+4 giây", "T+3 phút"
    severity:       'medium' | 'high' | 'critical'
  }[]                             // EXACTLY 3 items
  potential_loss:   string        // Vietnamese format, e.g. "50.000.000 VND"
  closing_message:  string        // max 100 chars, hopeful tone
}
```

### Mode B — Training Scenario
```typescript
interface TrainingScenarioOutput {
  scenario_type:    string        // actual type generated
  scenario_content: string        // the fake threat message/email/page
  scenario_brand:   string        // fictional brand name used
  questions: {
    question_id:   string         // e.g. "q1_abc123"
    question:      string         // the question
    options:       string[]       // EXACTLY 4 options
    correct_index: 0 | 1 | 2 | 3 // which option is correct
    explanation:   string         // why correct_index is right
  }[]                             // EXACTLY 3 questions
}
```

### Gemini Schemas
```typescript
// Mode A
const consequenceSchema = {
  type: 'OBJECT',
  required: ['steps', 'potential_loss', 'closing_message'],
  properties: {
    steps: {
      type: 'ARRAY', minItems: 3, maxItems: 3,
      items: {
        type: 'OBJECT',
        required: ['step', 'title', 'description', 'timestamp_label', 'severity'],
        properties: {
          step:            { type: 'NUMBER', enum: [1, 2, 3] },
          title:           { type: 'STRING', maxLength: 60 },
          description:     { type: 'STRING', maxLength: 150 },
          timestamp_label: { type: 'STRING' },
          severity:        { type: 'STRING', enum: ['medium', 'high', 'critical'] },
        }
      }
    },
    potential_loss:   { type: 'STRING' },
    closing_message:  { type: 'STRING', maxLength: 100 },
  }
}

// Mode B
const trainingSchema = {
  type: 'OBJECT',
  required: ['scenario_type', 'scenario_content', 'scenario_brand', 'questions'],
  properties: {
    scenario_type:    { type: 'STRING' },
    scenario_content: { type: 'STRING' },
    scenario_brand:   { type: 'STRING' },
    questions: {
      type: 'ARRAY', minItems: 3, maxItems: 3,
      items: {
        type: 'OBJECT',
        required: ['question_id', 'question', 'options', 'correct_index', 'explanation'],
        properties: {
          question_id:   { type: 'STRING' },
          question:      { type: 'STRING' },
          options:       { type: 'ARRAY', minItems: 4, maxItems: 4, items: { type: 'STRING' } },
          correct_index: { type: 'NUMBER', enum: [0, 1, 2, 3] },
          explanation:   { type: 'STRING' },
        }
      }
    }
  }
}
```

### Example Output — Mode A (phishing)
```json
{
  "steps": [
    {
      "step": 1,
      "title": "Bạn nhấp vào đường link giả mạo",
      "description": "Trang web trông giống hệt Vietcombank xuất hiện. Trình duyệt không cảnh báo vì domain trông gần đúng. Bạn nhập username và mật khẩu.",
      "timestamp_label": "T+0:00",
      "severity": "medium"
    },
    {
      "step": 2,
      "title": "Thông tin đăng nhập bị đánh cắp tức thì",
      "description": "4 giây sau khi bạn nhấn 'Đăng nhập', dữ liệu gửi đến máy chủ ở Philippines. Bot tự động thử đăng nhập vào tài khoản ngân hàng thật của bạn.",
      "timestamp_label": "T+0:04 giây",
      "severity": "critical"
    },
    {
      "step": 3,
      "title": "Tài khoản bị rút sạch trong 3 phút",
      "description": "Nhóm lừa đảo thực hiện 3 lần chuyển khoản — tổng 87.000.000 VNĐ — đến tài khoản trung gian. Ngân hàng phát hiện và khóa tài khoản sau 30 phút. Quá muộn.",
      "timestamp_label": "T+3 phút",
      "severity": "critical"
    }
  ],
  "potential_loss": "87.000.000 VND",
  "closing_message": "Hệ miễn dịch của bạn đã chặn điều này. Bạn vừa bảo vệ được 87 triệu đồng."
}
```

### Example Output — Mode B (medium, phishing_email)
```json
{
  "scenario_type": "phishing_email",
  "scenario_content": "[Techbank - Phòng Bảo Mật]: Tài khoản của quý khách đã bị đăng nhập từ thiết bị lạ tại Hà Nội lúc 02:15 SA. Vui lòng xác minh ngay tại http://techbank-verify.net/secure hoặc tài khoản sẽ bị khóa trong 2 giờ. Hotline: 0900 123 456.",
  "scenario_brand": "Techbank (fictional)",
  "questions": [
    {
      "question_id": "q1_sim001",
      "question": "Dấu hiệu đáng ngờ nào rõ nhất trong tin nhắn này?",
      "options": [
        "Tin nhắn gửi lúc 2 giờ sáng",
        "Domain techbank-verify.net không phải tên miền ngân hàng chính thức",
        "Tin nhắn bằng tiếng Việt",
        "Đề cập đến địa điểm cụ thể (Hà Nội)"
      ],
      "correct_index": 1,
      "explanation": "Ngân hàng thật dùng domain chính thức (techbank.vn). 'techbank-verify.net' là domain khác — đây là kỹ thuật Lookalike Domain."
    },
    {
      "question_id": "q2_sim001",
      "question": "Tin nhắn này sử dụng thủ thuật tâm lý nào?",
      "options": [
        "Authority — giả danh tổ chức có quyền lực",
        "Scarcity + Urgency — tạo áp lực thời gian và sợ mất mát",
        "Social Proof — lợi dụng tâm lý đám đông",
        "Reciprocity — cho trước để nhận lại"
      ],
      "correct_index": 1,
      "explanation": "'Tài khoản sẽ bị khóa trong 2 giờ' tạo áp lực thời gian (Urgency) và sợ mất tài khoản (Scarcity) — hai kỹ thuật phổ biến nhất của lừa đảo ngân hàng."
    },
    {
      "question_id": "q3_sim001",
      "question": "Bạn nên làm gì khi nhận được tin nhắn này?",
      "options": [
        "Nhấp vào link để kiểm tra tài khoản có bị khóa không",
        "Gọi trực tiếp hotline ngân hàng bằng số có trên thẻ hoặc website chính thức",
        "Chụp màn hình rồi chia sẻ cho bạn bè để hỏi ý kiến",
        "Trả lời tin nhắn yêu cầu xác minh danh tính của người gửi"
      ],
      "correct_index": 1,
      "explanation": "Luôn xác minh qua kênh chính thức (hotline trên thẻ/website). Không bao giờ nhấp link từ SMS/email — kẻ gian có thể mạo danh số hotline giả."
    }
  ]
}
```

---

## Fallback Responses

### Mode A Fallback
```json
{
  "steps": [
    {
      "step": 1,
      "title": "Bạn tương tác với nội dung nguy hiểm",
      "description": "Trang giả mạo hoặc tin nhắn lừa đảo thu thập thông tin bạn cung cấp.",
      "timestamp_label": "T+0:00",
      "severity": "medium"
    },
    {
      "step": 2,
      "title": "Thông tin của bạn bị khai thác",
      "description": "Kẻ tấn công sử dụng thông tin để truy cập các tài khoản liên quan của bạn.",
      "timestamp_label": "T+vài giây",
      "severity": "critical"
    },
    {
      "step": 3,
      "title": "Thiệt hại tài chính hoặc danh tính xảy ra",
      "description": "Tiền bị chuyển đi hoặc danh tính bị lạm dụng mà không có cách thu hồi.",
      "timestamp_label": "T+vài phút",
      "severity": "critical"
    }
  ],
  "potential_loss": "Không xác định được",
  "closing_message": "Hệ miễn dịch của bạn đã ngăn chặn điều này. Hãy tiếp tục cẩn thận."
}
```

### Mode B Fallback
> If Gemini fails to generate a valid training scenario:
> Return a pre-written hardcoded scenario from the fallback bank.
```typescript
// packages/agents/src/data/fallback-scenarios.ts
// Contains 10 pre-written scenarios (2 per type: easy + medium)
// Curated by security team, manually reviewed
export const fallbackScenarios: TrainingScenarioOutput[] = [ /* 10 items */ ]
```

---

## Guardrails

### Mode A Guardrails
```typescript
function applySimulateGuardrails(raw: ConsequenceOutput): ConsequenceOutput {
  // GUARDRAIL 1: Must have exactly 3 steps
  if (!raw.steps || raw.steps.length !== 3) {
    return FALLBACK_CONSEQUENCE
  }

  // GUARDRAIL 2: Steps must be numbered 1, 2, 3
  const stepNumbers = raw.steps.map(s => s.step).sort()
  if (JSON.stringify(stepNumbers) !== '[1,2,3]') {
    return FALLBACK_CONSEQUENCE
  }

  // GUARDRAIL 3: No real names in descriptions
  const FORBIDDEN_NAMES = ['Nguyễn Văn Hùng', 'Trần Thị Mai'] // extend as needed
  raw.steps.forEach(step => {
    FORBIDDEN_NAMES.forEach(name => {
      if (step.description.includes(name)) {
        step.description = step.description.replace(name, 'nạn nhân')
      }
    })
  })

  // GUARDRAIL 4: potential_loss must contain "VND" or "VNĐ"
  if (!raw.potential_loss?.match(/VN[DĐ]/)) {
    raw.potential_loss = 'Không xác định được'
  }

  // GUARDRAIL 5: closing_message must be hopeful (not doom)
  const DOOM_PHRASES = ['mất hết', 'không lấy lại được', 'phá sản', 'bị tù']
  DOOM_PHRASES.forEach(phrase => {
    if (raw.closing_message?.toLowerCase().includes(phrase)) {
      raw.closing_message = 'Hệ miễn dịch của bạn đã ngăn chặn điều này. Hãy tiếp tục học hỏi.'
    }
  })

  // Truncate lengths
  raw.steps = raw.steps.map(s => ({
    ...s,
    title: s.title.slice(0, 60),
    description: s.description.slice(0, 150),
  }))
  raw.closing_message = raw.closing_message.slice(0, 100)

  return raw
}
```

### Mode B Guardrails
```typescript
function applyTrainingGuardrails(raw: TrainingScenarioOutput): TrainingScenarioOutput {
  // GUARDRAIL 1: Real brand detection
  const REAL_BRANDS = [
    'Vietcombank', 'VietinBank', 'BIDV', 'Agribank', 'Techcombank',
    'Shopee', 'Lazada', 'TikTok', 'Zalo', 'Grab', 'Be', 'Gojek',
    'MB Bank', 'ACB', 'TPBank', 'VPBank', 'SHB', 'HDBank',
  ]
  REAL_BRANDS.forEach(brand => {
    if (raw.scenario_content?.includes(brand) || raw.scenario_brand?.includes(brand)) {
      throw new AgentError('REAL_BRAND_DETECTED', `Training scenario contains real brand: ${brand}`)
    }
  })

  // GUARDRAIL 2: Must have exactly 3 questions
  if (!raw.questions || raw.questions.length !== 3) {
    throw new AgentError('INVALID_QUESTION_COUNT')
  }

  // GUARDRAIL 3: Each question must have exactly 4 options
  raw.questions.forEach((q, i) => {
    if (!q.options || q.options.length !== 4) {
      throw new AgentError('INVALID_OPTION_COUNT', `Question ${i + 1} must have 4 options`)
    }
  })

  // GUARDRAIL 4: correct_index must be 0–3
  raw.questions.forEach((q, i) => {
    if (![0, 1, 2, 3].includes(q.correct_index)) {
      throw new AgentError('INVALID_CORRECT_INDEX', `Question ${i + 1} correct_index out of range`)
    }
  })

  // GUARDRAIL 5: No real phone numbers in scenario_content
  const REAL_PHONE_PATTERN = /\b(1800|1900)\s?\d{3,4}\b/g
  if (REAL_PHONE_PATTERN.test(raw.scenario_content)) {
    raw.scenario_content = raw.scenario_content.replace(REAL_PHONE_PATTERN, '0900 XXX XXX')
  }

  return raw
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Mode A + Mode B. Real brand guardrail. |
