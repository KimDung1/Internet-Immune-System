import { z } from 'zod'

export const SimulationStepSchema = z.object({
  step: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string().max(60),
  description: z.string().max(150),
  timestampLabel: z.string(),
  severity: z.enum(['medium', 'high', 'critical']),
})
export type SimulationStep = z.infer<typeof SimulationStepSchema>

export const ConsequenceOutputSchema = z.object({
  simulationId: z.string(),
  scanId: z.string(),
  steps: z.array(SimulationStepSchema).length(3),
  potentialLoss: z.string(),
  closingMessage: z.string().max(100),
  createdAt: z.string(),
})
export type ConsequenceOutput = z.infer<typeof ConsequenceOutputSchema>
