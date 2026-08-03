import type { MiddlewareHandler } from 'hono'

export type ApiEnv = {
  Variables: {
    requestId: string
  }
}

export const requestIdMiddleware: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const existingId = c.req.header('X-Request-ID')
  const requestId = existingId || crypto.randomUUID()
  c.set('requestId', requestId)
  c.header('X-Request-ID', requestId)
  await next()
}
