import { z } from 'zod'

export const ContentTypeSchema = z.enum(['url', 'email', 'text', 'dom'])
export type ContentType = z.infer<typeof ContentTypeSchema>

export const ClassificationSchema = z.enum(['safe', 'suspicious', 'phishing', 'malware', 'scam'])
export type Classification = z.infer<typeof ClassificationSchema>

export const ActionRecommendationSchema = z.enum(['ALLOW', 'BLOCK', 'WARN'])
export type ActionRecommendation = z.infer<typeof ActionRecommendationSchema>

export const RedFlagSchema = z.object({
  id: z.string(),
  label: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().max(150),
})
export type RedFlag = z.infer<typeof RedFlagSchema>

export const ScanAnalyzeRequestSchema = z.object({
  contentType: ContentTypeSchema,
  contentData: z.string().min(1).max(4000),
  url: z.string().url().optional(),
  domain: z.string().optional(),
  pageTitle: z.string().optional(),
  context: z.string().max(500).optional(),
})
export type ScanAnalyzeRequestBody = z.infer<typeof ScanAnalyzeRequestSchema>

export const ThreatResultSchema = z.object({
  riskScore: z.number().min(0).max(100),
  classification: ClassificationSchema,
  confidence: z.number().min(0).max(1),
  redFlags: z.array(RedFlagSchema).max(10),
  actionRecommendation: ActionRecommendationSchema,
  geminiExplanation: z.string().max(200),
  detectionSource: z.enum(['ai', 'threat_intelligence', 'cache', 'fallback']),
  scanId: z.string().optional(),
  inputValue: z.string().optional(),
  processingMs: z.number().optional(),
  fallback: z.boolean().optional(),
})
export type ThreatResult = z.infer<typeof ThreatResultSchema>

export interface ExplanationResult {
  aiNarrative?: string
  plainNarrative?: string
  redFlagDetails?: {
    flagId: string
    label: string
    explanation: string
    learnMore: string
  }[]
  whatToDo?: string[]
  actionSteps?: string[]
  educationalTip?: string
  immunityPointsEarned?: number
}
