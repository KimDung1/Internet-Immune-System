export interface StandardMeta {
  requestId: string
  timestamp: string
  processingMs?: number
}

export interface StandardError {
  code: string
  message: string
  details?: unknown
}

export interface StandardEnvelope<T> {
  status: 'success' | 'error'
  data: T | null
  error: StandardError | null
  meta: StandardMeta
}

export * from './schemas/scan.schema.js'
export * from './schemas/user.schema.js'
export * from './schemas/simulation.schema.js'
export * from './schemas/training.schema.js'
