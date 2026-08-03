import type { ErrorHandler } from 'hono'
import type { StandardEnvelope } from '@iis/core'
import type { ApiEnv } from './request-id.middleware.js'

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandlerMiddleware: ErrorHandler<ApiEnv> = (err, c) => {
  const requestId = c.get('requestId') || crypto.randomUUID()
  const timestamp = new Date().toISOString()

  if (err instanceof AppError) {
    const envelope: StandardEnvelope<null> = {
      status: 'error',
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: { requestId, timestamp },
    }
    return c.json(envelope, err.statusCode as any)
  }

  console.error('[UnhandledError]', err)

  const fallbackEnvelope: StandardEnvelope<null> = {
    status: 'error',
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Hệ thống gặp lỗi không xác định. Vui lòng thử lại sau.',
    },
    meta: { requestId, timestamp },
  }
  return c.json(fallbackEnvelope, 500)
}
