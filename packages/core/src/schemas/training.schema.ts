import { z } from 'zod'

export const QuestionSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string(),
})
export type Question = z.infer<typeof QuestionSchema>

export const TrainingSessionSchema = z.object({
  sessionId: z.string(),
  uid: z.string(),
  scenarioType: z.string(),
  scenarioContent: z.string(),
  scenarioBrand: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questions: z.array(QuestionSchema).length(3),
  status: z.enum(['pending', 'completed', 'expired']),
  userAnswers: z.array(z.number().min(0).max(3)).optional(),
  score: z.number().min(0).max(100).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
})
export type TrainingSession = z.infer<typeof TrainingSessionSchema>
