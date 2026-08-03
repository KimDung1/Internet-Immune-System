import { z } from 'zod'

export const UserSettingsSchema = z.object({
  autoBlock: z.boolean().default(true),
  sensitivity: z.enum(['strict', 'balanced', 'lenient']).default('balanced'),
  language: z.enum(['vi', 'en']).default('vi'),
  trustedDomains: z.array(z.string()).default([]),
})
export type UserSettings = z.infer<typeof UserSettingsSchema>

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().url().nullable().optional(),
  trustScore: z.number().min(0).max(100).default(50),
  antibodyLevel: z.number().min(1).max(10).default(3),
  badges: z.array(z.string()).default([]),
  totalScans: z.number().default(0),
  threatsBlocked: z.number().default(0),
  settings: UserSettingsSchema,
  createdAt: z.string(),
  lastActive: z.string(),
})
export type UserProfile = z.infer<typeof UserProfileSchema>
