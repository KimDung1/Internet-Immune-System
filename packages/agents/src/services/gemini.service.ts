import { ai, modelConfig, globalSystemInstruction } from '../config/gemini.config.js'

export interface GeminiGenerateOptions {
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro'
  temperature?: number
  maxTokens?: number
  responseSchema?: Record<string, unknown>
  maxAttempts?: number
  fallbackObject?: Record<string, unknown>
}

export class GeminiService {
  async generateContent<T>(promptText: string, options: GeminiGenerateOptions = {}): Promise<T> {
    const modelName = options.model || modelConfig.flash
    const temperature = options.temperature ?? 0.1
    const maxAttempts = options.maxAttempts ?? 3

    const fullPrompt = `${globalSystemInstruction}\n\n${promptText}`

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (!process.env.GEMINI_API_KEY) {
          console.warn('[GeminiService] GEMINI_API_KEY missing. Returning fallback object.')
          if (options.fallbackObject) return options.fallbackObject as T
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: fullPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: options.responseSchema as any,
            temperature,
          },
        })

        const text = response.text
        if (!text) throw new Error('Empty text returned from Gemini API')

        const parsed = JSON.parse(text)
        return parsed as T
      } catch (err: any) {
        console.warn(`[GeminiService] Attempt ${attempt}/${maxAttempts} failed:`, err.message)
        if (attempt === maxAttempts) {
          if (options.fallbackObject) {
            console.warn('[GeminiService] Max attempts reached. Returning fallback object.')
            return options.fallbackObject as T
          }
          throw err
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)))
      }
    }

    throw new Error('[GeminiService] Unexpected end of retry loop')
  }
}

export const geminiService = new GeminiService()
