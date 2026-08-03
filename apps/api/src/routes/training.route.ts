import { Hono } from 'hono'
import type { StandardEnvelope, TrainingSession } from '@iis/core'
import { trainingAgent } from '@iis/agents'
import { db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const trainingRouter = new Hono<ApiEnv>()

// POST /v1/training/sessions
trainingRouter.post('/sessions', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const body = await c.req.json().catch(() => ({}))
  const difficulty = body.difficulty || 'medium'

  const session = await trainingAgent.generateSession(uid, difficulty)
  await db.collection('training_sessions').doc(session.sessionId).set(session)

  const envelope: StandardEnvelope<TrainingSession> = {
    status: 'success',
    data: session,
    error: null,
    meta: { requestId, timestamp: new Date().toISOString() },
  }

  return c.json(envelope, 200)
})

// POST /v1/training/sessions/:sessionId/submit
trainingRouter.post('/sessions/:sessionId/submit', async (c) => {
  const sessionId = c.req.param('sessionId')
  const requestId = c.get('requestId')
  const body = await c.req.json().catch(() => null)

  if (!body || !Array.isArray(body.userAnswers) || body.userAnswers.length !== 3) {
    throw new AppError('INVALID_INPUT', 'userAnswers must be an array of 3 numbers', 400)
  }

  const doc = await db.collection('training_sessions').doc(sessionId).get()
  if (!doc.exists) {
    throw new AppError('NOT_FOUND', `Training session ${sessionId} not found`, 404)
  }

  const session = doc.data() as TrainingSession
  if (session.status === 'completed') {
    throw new AppError('INVALID_INPUT', 'Session already completed', 400)
  }

  let correctCount = 0
  session.questions.forEach((q, idx) => {
    if (body.userAnswers[idx] === q.correctIndex) {
      correctCount++
    }
  })

  const score = Math.round((correctCount / 3) * 100)
  const trustScoreDelta = score >= 66 ? 10 : 0
  const completedAt = new Date().toISOString()

  await db.collection('training_sessions').doc(sessionId).update({
    userAnswers: body.userAnswers,
    score,
    status: 'completed',
    completedAt,
  })

  const resultData = {
    sessionId,
    score,
    correctAnswers: correctCount,
    totalQuestions: 3,
    trustScoreDelta,
    completedAt,
  }

  const envelope: StandardEnvelope<typeof resultData> = {
    status: 'success',
    data: resultData,
    error: null,
    meta: { requestId, timestamp: completedAt },
  }

  return c.json(envelope, 200)
})
