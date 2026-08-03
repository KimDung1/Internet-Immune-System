import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { StandardEnvelope } from '@iis/core'
import { requestIdMiddleware, type ApiEnv } from './middleware/request-id.middleware.js'
import { errorHandlerMiddleware } from './middleware/error-handler.middleware.js'
import { authRouter } from './routes/auth.route.js'
import { scansRouter } from './routes/scans.route.js'
import { simulationsRouter } from './routes/simulations.route.js'
import { trainingRouter } from './routes/training.route.js'
import { reportsRouter } from './routes/reports.route.js'
import { usersRouter } from './routes/users.route.js'
import { vaccinationRouter } from './routes/vaccination.route.js'

const app = new Hono<ApiEnv>()

// Global Middlewares
app.use('*', requestIdMiddleware)
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://immune-system.vn'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-User-ID'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Routes
app.route('/v1/auth', authRouter)
app.route('/v1/users', usersRouter)
app.route('/v1/scans', scansRouter)
app.route('/v1/training', trainingRouter)
app.route('/v1/reports', reportsRouter)
app.route('/v1/vaccine', vaccinationRouter)
app.route('/v1', simulationsRouter)

// Error Handler
app.onError(errorHandlerMiddleware)

// Health Endpoint
app.get('/v1/health', (c) => {
  const requestId = c.get('requestId')
  const response: StandardEnvelope<{ status: string; version: string }> = {
    status: 'success',
    data: {
      status: 'healthy',
      version: '1.0.0',
    },
    error: null,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  }
  return c.json(response, 200)
})

const port = Number(process.env.PORT) || 8080
console.log(`Server running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
