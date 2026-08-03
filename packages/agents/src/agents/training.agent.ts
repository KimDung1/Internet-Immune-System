import type { TrainingSession, Question } from '@iis/core'
import { geminiService } from '../services/gemini.service.js'
import { modelConfig } from '../config/gemini.config.js'

const trainingSessionSchema = {
  type: 'OBJECT',
  required: ['scenario_type', 'scenario_content', 'scenario_brand', 'difficulty', 'questions'],
  properties: {
    scenario_type: { type: 'STRING' },
    scenario_content: { type: 'STRING', maxLength: 300 },
    scenario_brand: { type: 'STRING' },
    difficulty: { type: 'STRING', enum: ['easy', 'medium', 'hard'] },
    questions: {
      type: 'ARRAY',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'OBJECT',
        required: ['question_id', 'question', 'options', 'correct_index', 'explanation'],
        properties: {
          question_id: { type: 'STRING' },
          question: { type: 'STRING' },
          options: {
            type: 'ARRAY',
            minItems: 4,
            maxItems: 4,
            items: { type: 'STRING' },
          },
          correct_index: { type: 'NUMBER', minimum: 0, maximum: 3 },
          explanation: { type: 'STRING', maxLength: 150 },
        },
      },
    },
  },
}

export class TrainingAgent {
  async generateSession(uid: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<TrainingSession> {
    const prompt = `
Generate an interactive Vietnamese anti-fraud training drill scenario for a user.

Difficulty Level: ${difficulty}
Target Audience: Vietnamese internet user

Create a realistic fake scam message/email (using fictitious brands like "Techbank", "VietShop", "ZaloPay-Verify").
Include exactly 3 multiple choice questions (4 options each) testing:
Question 1: Spotting the Red Flag
Question 2: Identifying the Attack Vector
Question 3: Choosing the Correct Safe Action

Respond ONLY with valid JSON matching the schema.
    `.trim()

    const fallbackQuestions: Question[] = [
      {
        questionId: 'q1',
        question: 'Dấu hiệu lừa đảo rõ nhất trong tin nhắn này là gì?',
        options: [
          'Tên thương hiệu Techbank bị gõ sai',
          'Đường link có đuôi lạ (.ph thay vì .vn)',
          'Yêu cầu nhập OTP khẩn cấp',
          'Tất cả các phương án trên',
        ],
        correctIndex: 3,
        explanation: 'Kẻ lừa đảo thường dùng cả tên thương hiệu sai, domain lạ và hối thúc khẩn cấp.',
      },
      {
        questionId: 'q2',
        question: 'Kẻ tấn công đang cố gắng thực hiện hành vi gì?',
        options: ['Tải mã độc', 'Đánh cắp tài khoản ngân hàng', 'Khảo sát ý kiến', 'Quảng cáo'],
        correctIndex: 1,
        explanation: 'Kẻ tấn công đang dùng kỹ thuật Phishing để chiếm đoạt tài sản.',
      },
      {
        questionId: 'q3',
        question: 'Hành động đúng đắn nhất bạn nên làm là gì?',
        options: [
          'Nhấp vào link để kiểm tra',
          'Đổi mật khẩu ngay trên link',
          'Tắt tin nhắn và gọi tổng đài chính thức của ngân hàng',
          'Gửi tin nhắn cho bạn bè hỏi ý kiến',
        ],
        correctIndex: 2,
        explanation: 'Luôn luôn xác minh qua kênh tổng đài chính thức.',
      },
    ]

    const fallback: TrainingSession = {
      sessionId: `tr_${crypto.randomUUID().slice(0, 8)}`,
      uid,
      scenarioType: 'Phishing SMS',
      scenarioContent: 'TB: Tai khoan Techbank cua Quy khach bi khoai tam thoi. Vui long truy cap http://techbank-verify.ph de mo lai.',
      scenarioBrand: 'Techbank',
      difficulty,
      questions: fallbackQuestions,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    try {
      const raw = await geminiService.generateContent<any>(prompt, {
        model: modelConfig.pro,
        temperature: 0.5,
        responseSchema: trainingSessionSchema,
        fallbackObject: {
          scenario_type: fallback.scenarioType,
          scenario_content: fallback.scenarioContent,
          scenario_brand: fallback.scenarioBrand,
          difficulty: fallback.difficulty,
          questions: fallbackQuestions,
        },
      })

      const questions: Question[] = (raw.questions || fallbackQuestions).map((q: any, idx: number) => ({
        questionId: q.question_id || `q${idx + 1}`,
        question: q.question || '',
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : fallbackQuestions[idx]!.options,
        correctIndex: typeof q.correct_index === 'number' ? q.correct_index : 0,
        explanation: q.explanation || '',
      }))

      return {
        sessionId: `tr_${crypto.randomUUID().slice(0, 8)}`,
        uid,
        scenarioType: raw.scenario_type || fallback.scenarioType,
        scenarioContent: raw.scenario_content || fallback.scenarioContent,
        scenarioBrand: raw.scenario_brand || fallback.scenarioBrand,
        difficulty: raw.difficulty || difficulty,
        questions: questions.length === 3 ? questions : fallbackQuestions,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    } catch {
      return fallback
    }
  }
}

export const trainingAgent = new TrainingAgent()
