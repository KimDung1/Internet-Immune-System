# 📚 LEARNING PROMPT LIBRARY
### Agent: LearningAgent (Embedded in TrainingSession workflow) | Model: `gemini-2.5-pro` | Version: v1.0.0-FROZEN
### Source: [AgentArchitecture.md](../../10_Agent/AgentArchitecture.md) | Temperature: 0.3 | Max Tokens: 1024

> LearningAgent handles the POST-SUBMIT phase of training sessions:
> scoring, feedback generation, adaptive difficulty, and long-term learning analytics.

---

## System Prompt — Learning v1.0 (FROZEN)

```
{{GLOBAL_SYSTEM_INSTRUCTION}}

You are the Learning Agent — the Coach of the Internet Immune System.
You analyze how a user answered a training drill and provide:
1. Detailed, personalized feedback for each question
2. An adaptive difficulty recommendation for the next session
3. A personalized learning insight about their fraud awareness

─── FEEDBACK PHILOSOPHY ─────────────────────────────────────────
Tone: Encouraging, never condescending. Treat every attempt as progress.

Wrong answer handling:
- Explain WHY the correct answer is right (not "you were wrong")
- Explain the specific cognitive trap that made the wrong option tempting
- Connect to real-world consequence: "If this were real, you would have..."

Right answer handling:
- Brief positive reinforcement
- Add "deeper insight" — something they may not have known even though correct
- Example: "You got it! Also note that attackers sometimes add HTTPS to fake sites,
  so even a padlock doesn't guarantee safety."

─── ADAPTIVE DIFFICULTY ALGORITHM ──────────────────────────────
Score 0–39  (0–1 correct):  → Next session: EASIER type
                                Change scenario_type to a more obvious one
                                Add 1 extra hint in the scenario
Score 40–69 (1–2 correct):  → Same difficulty, different scenario_type
Score 70–99 (2–3 correct):  → Same difficulty, try a harder variant
Score 100   (3/3 correct):  → Level up: increase difficulty if < 'hard'
                                If already 'hard': maintain + unlock hard variant

─── PERSONALIZED INSIGHT ────────────────────────────────────────
Analyze which question(s) the user got wrong.
Map wrong answers to specific cognitive biases:
  Q1 (Identification) wrong → Bias: Pattern Recognition (can't spot red flags)
  Q2 (Technique) wrong      → Bias: Illusion of Invulnerability ("won't happen to me")
  Q3 (Action) wrong         → Bias: Optimism Bias ("I'll check it later")

Generate ONE insight that addresses their specific weakness.
Keep it: < 150 characters, empowering, actionable.

─── OUTPUT RULES ────────────────────────────────────────────────
- question_feedbacks: EXACTLY same count as questions (always 3)
- learning_insight: 80–150 characters, second-person ("Bạn...")
- next_difficulty: must be 'easy' | 'medium' | 'hard'
- No text outside JSON
```

---

## User Prompt Template

```
Analyze this training session submission and provide personalized feedback.

── SESSION DETAILS ───────────────────────────────────────────────
Scenario Type: {{scenario_type}}
Difficulty: {{difficulty}}
Score: {{score}}/100
Correct: {{correct_count}}/3

── QUESTIONS AND ANSWERS ─────────────────────────────────────────
{{#each questions}}
Question {{step}}: "{{question}}"
Options:
  [0] {{options.[0]}}
  [1] {{options.[1]}}
  [2] {{options.[2]}}
  [3] {{options.[3]}}
Correct Answer: Option [{{correct_index}}] — "{{options.[correct_index]}}"
User Selected: Option [{{user_answer}}] — "{{options.[user_answer]}}"
Result: {{#if is_correct}}✅ CORRECT{{else}}❌ WRONG{{/if}}
Original explanation: "{{explanation}}"
{{/each}}

── USER PROFILE ──────────────────────────────────────────────────
Trust Score: {{trust_score}} / 100
Language: {{language | "vi"}}
Previous session score: {{prev_session_score | "N/A"}}
Common weak area: {{weak_area | "Not identified yet"}}

── TASK ──────────────────────────────────────────────────────────
1. For each question, write personalized feedback (encourage even if wrong)
2. Identify the cognitive bias behind any wrong answers
3. Generate ONE learning_insight targeting their specific weakness
4. Recommend next session difficulty using the adaptive algorithm
5. If all correct, add deeper insights they may not know

Calibrate language to trust_score {{trust_score}} (simple if < 40, detailed if > 70).

Respond ONLY with valid JSON:
```

---

## Output Format

### JSON Schema
```typescript
interface LearningOutput {
  question_feedbacks: {
    question_id:     string
    is_correct:      boolean
    feedback:        string       // 50–200 chars, encouraging
    deeper_insight?: string       // optional, for correct answers
    cognitive_bias?: string       // optional, for wrong answers — name the bias
  }[]                             // EXACTLY 3 items
  learning_insight:  string       // 80–150 chars, "Bạn..." second person
  next_difficulty:   'easy' | 'medium' | 'hard'
  next_scenario_hint: string      // which scenario_type to try next
  encouragement:     string       // 1 motivational line, max 80 chars
}
```

### Gemini `responseSchema`
```typescript
const learningResponseSchema = {
  type: 'OBJECT',
  required: ['question_feedbacks', 'learning_insight', 'next_difficulty', 'next_scenario_hint', 'encouragement'],
  properties: {
    question_feedbacks: {
      type: 'ARRAY', minItems: 3, maxItems: 3,
      items: {
        type: 'OBJECT',
        required: ['question_id', 'is_correct', 'feedback'],
        properties: {
          question_id:    { type: 'STRING' },
          is_correct:     { type: 'BOOLEAN' },
          feedback:       { type: 'STRING', minLength: 20, maxLength: 200 },
          deeper_insight: { type: 'STRING', maxLength: 150, nullable: true },
          cognitive_bias: { type: 'STRING', maxLength: 80, nullable: true },
        }
      }
    },
    learning_insight:   { type: 'STRING', minLength: 30, maxLength: 150 },
    next_difficulty:    { type: 'STRING', enum: ['easy', 'medium', 'hard'] },
    next_scenario_hint: { type: 'STRING' },
    encouragement:      { type: 'STRING', maxLength: 80 },
  }
}
```

### Example Output — Score 67 (2/3 correct, Q2 wrong)
```json
{
  "question_feedbacks": [
    {
      "question_id": "q1_sim001",
      "is_correct": true,
      "feedback": "Chính xác! Bạn đã nhận ra domain giả mạo ngay lập tức — đây là kỹ năng quan trọng nhất trong bảo mật mạng.",
      "deeper_insight": "Lưu ý thêm: kẻ gian thường mua domain trông giống thật hơn, ví dụ 'vietcombank-vn.com' thay vì 'vietcombank-verify.net'. Luôn tìm đúng tên miền chính thức."
    },
    {
      "question_id": "q2_sim001",
      "is_correct": false,
      "feedback": "Bạn chọn 'Authority' — cũng là một kỹ thuật có trong tin nhắn này, nhưng kỹ thuật CHÍNH ở đây là Scarcity + Urgency: 'tài khoản bị khóa trong 2 giờ'. Kẻ gian muốn bạn hành động vội mà không suy nghĩ.",
      "cognitive_bias": "Illusion of Single Threat — khi thấy 1 kỹ thuật, dễ bỏ qua kỹ thuật khác nguy hiểm hơn"
    },
    {
      "question_id": "q3_sim001",
      "is_correct": true,
      "feedback": "Hoàn toàn đúng! Gọi hotline chính thức là hành động an toàn nhất — không bao giờ tương tác qua link trong SMS.",
      "deeper_insight": "Thêm tip: lưu hotline ngân hàng vào danh bạ ngay hôm nay. Khi khẩn cấp, bạn không cần phải tìm kiếm."
    }
  ],
  "learning_insight": "Bạn giỏi nhận diện domain giả, nhưng cần luyện thêm việc phân biệt các kỹ thuật tâm lý — đặc biệt Urgency và Authority kết hợp.",
  "next_difficulty": "medium",
  "next_scenario_hint": "fake_sms",
  "encouragement": "2/3 — Bạn đang tiến bộ rất nhanh! Thử bài tiếp theo nhé 🚀"
}
```

### Example Output — Score 100 (3/3 perfect)
```json
{
  "question_feedbacks": [
    {
      "question_id": "q1_sim001",
      "is_correct": true,
      "feedback": "Xuất sắc! Bạn phát hiện ngay domain giả. Kỹ năng này bảo vệ bạn khỏi 80% tấn công phishing.",
      "deeper_insight": "Bước tiếp theo: thử kiểm tra certificate của website (nhấp vào 🔒 trên thanh địa chỉ) — ngay cả HTTPS cũng có thể là giả nếu kẻ gian dùng free SSL."
    },
    {
      "question_id": "q2_sim001",
      "is_correct": true,
      "feedback": "Chính xác! Scarcity + Urgency — kỹ thuật lâu đời nhất trong lừa đảo. Bạn biết cách nhận ra nó.",
      "deeper_insight": "Kẻ gian ngày càng tinh vi hơn: có trường hợp chúng đợi 24h để tạo cảm giác 'chân thật', rồi mới gửi link. Urgency sẽ ít rõ hơn."
    },
    {
      "question_id": "q3_sim001",
      "is_correct": true,
      "feedback": "Tuyệt vời! Xác minh qua kênh chính thức là phản xạ cần được xây dựng cho tất cả mọi người.",
      "deeper_insight": "Tip nâng cao: nếu bạn đang quản trị tài khoản doanh nghiệp, cân nhắc kích hoạt IP whitelist và thiết lập login alert tức thì qua email/SMS."
    }
  ],
  "learning_insight": "Bạn đạt điểm tuyệt đối! Hệ miễn dịch của bạn đang ở cấp độ cao. Hãy chia sẻ kiến thức này với người thân.",
  "next_difficulty": "hard",
  "next_scenario_hint": "investment_scam",
  "encouragement": "100/100 — Huyền thoại! Thử thách cấp độ Khó ngay nhé 🏆"
}
```

---

## Adaptive Learning Algorithm

```typescript
// packages/agents/src/services/adaptive-learning.service.ts

interface AdaptiveRecommendation {
  nextDifficulty:    'easy' | 'medium' | 'hard'
  nextScenarioHint:  string
  trustScoreDelta:   number
}

function computeAdaptive(
  score: number,
  currentDifficulty: 'easy' | 'medium' | 'hard',
  correctCount: number,
  wrongQuestions: number[]  // indices of wrong questions
): AdaptiveRecommendation {

  const SCENARIO_ROTATION = [
    'phishing_email', 'fake_sms', 'fake_site', 'investment_scam', 'romance_scam'
  ]

  // Score bands
  if (score <= 39) {
    // 0–1 correct: go easier
    return {
      nextDifficulty: 'easy',
      nextScenarioHint: SCENARIO_ROTATION[Math.floor(Math.random() * 3)],  // simpler types
      trustScoreDelta: 1,
    }
  }

  if (score <= 69) {
    // Same difficulty, rotate scenario type
    return {
      nextDifficulty: currentDifficulty,
      nextScenarioHint: 'auto',  // let AI pick variation
      trustScoreDelta: 3,
    }
  }

  if (score <= 99) {
    // 2/3 correct: same difficulty, harder variant
    return {
      nextDifficulty: currentDifficulty,
      nextScenarioHint: 'investment_scam',  // more complex scenario
      trustScoreDelta: 3,
    }
  }

  // 100: Level up difficulty
  const difficulties = ['easy', 'medium', 'hard'] as const
  const currentIdx = difficulties.indexOf(currentDifficulty)
  const nextDifficulty = difficulties[Math.min(currentIdx + 1, 2)]
  return {
    nextDifficulty,
    nextScenarioHint: 'romance_scam',  // hardest scenario for advanced
    trustScoreDelta: 5,
  }
}
```

---

## Fallback Response

> Triggered when Gemini fails to generate feedback (timeout or error × 2)

```typescript
function buildFallbackLearning(session: TrainingSessionDocument): LearningOutput {
  const feedbacks = session.questions.map((q, i) => {
    const userAnswer = session.user_answers?.[i] ?? -1
    const isCorrect = userAnswer === q.correct_index
    return {
      question_id: q.question_id,
      is_correct: isCorrect,
      feedback: isCorrect
        ? 'Đúng rồi! Bạn đã nhận ra dấu hiệu đúng.'
        : `Chưa chính xác. Đáp án đúng là: "${q.options[q.correct_index]}". ${q.explanation}`,
    }
  })

  return {
    question_feedbacks: feedbacks,
    learning_insight: 'Mỗi bài tập là một bước tiến trong hành trình xây dựng hệ miễn dịch số.',
    next_difficulty: 'medium',
    next_scenario_hint: 'auto',
    encouragement: 'Tiếp tục luyện tập để nâng cao điểm miễn dịch! 💪',
  }
}
```

---

## Guardrails

### Pre-call
```typescript
// Validate session state
if (session.status !== 'pending') throw new AgentError('SESSION_ALREADY_COMPLETED')
if (session.expires_at < Date.now()) throw new AgentError('SESSION_EXPIRED')

// Validate answers array
if (!Array.isArray(answers) || answers.length !== 3) {
  throw new AgentError('INVALID_ANSWERS', 'Must provide exactly 3 answers')
}
answers.forEach((a, i) => {
  if (![0, 1, 2, 3].includes(a)) {
    throw new AgentError('INVALID_ANSWER_INDEX', `Answer ${i} must be 0–3, got ${a}`)
  }
})

// Rate limit: max 3 submissions per session (anti-cheat)
const submissionCount = await getSubmissionCount(session.session_id)
if (submissionCount >= 3) throw new AgentError('MAX_SUBMISSIONS_EXCEEDED')
```

### Post-call
```typescript
function applyLearningGuardrails(raw: LearningOutput, session: TrainingSessionDocument): LearningOutput {
  // GUARDRAIL 1: Must have exactly 3 feedbacks
  if (raw.question_feedbacks.length !== 3) {
    return buildFallbackLearning(session)
  }

  // GUARDRAIL 2: is_correct must match actual answers
  session.questions.forEach((q, i) => {
    const actualIsCorrect = session.user_answers![i] === q.correct_index
    if (raw.question_feedbacks[i].is_correct !== actualIsCorrect) {
      raw.question_feedbacks[i].is_correct = actualIsCorrect
      console.warn(`[GUARDRAIL-2] Corrected is_correct for question ${i}`)
    }
  })

  // GUARDRAIL 3: Encouragement max length
  raw.encouragement = (raw.encouragement ?? '').slice(0, 80)

  // GUARDRAIL 4: learning_insight length
  if (!raw.learning_insight || raw.learning_insight.length < 30) {
    raw.learning_insight = 'Hãy tiếp tục luyện tập để củng cố kỹ năng nhận diện lừa đảo.'
  }
  raw.learning_insight = raw.learning_insight.slice(0, 150)

  // GUARDRAIL 5: next_difficulty must be valid
  if (!['easy', 'medium', 'hard'].includes(raw.next_difficulty)) {
    raw.next_difficulty = 'medium'
  }

  return raw
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Adaptive difficulty. Cognitive bias mapping. |
