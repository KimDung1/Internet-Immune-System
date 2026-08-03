import { Hono } from 'hono'
import type { StandardEnvelope } from '@iis/core'
import { communityAgent } from '@iis/agents'
import { db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const reportsRouter = new Hono<ApiEnv>()

// POST /v1/reports
reportsRouter.post('/', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const body = await c.req.json().catch(() => null)

  if (!body || !body.description) {
    throw new AppError('INVALID_INPUT', 'Missing description in fraud report', 400)
  }

  const analysis = await communityAgent.analyzeReport(body.description, body.url)
  const reportId = `rep_${crypto.randomUUID().slice(0, 8)}`
  const now = new Date().toISOString()

  const reportDoc = {
    reportId,
    uid,
    url: body.url || null,
    description: body.description,
    status: analysis.isSpam ? 'rejected' : 'pending',
    analysis,
    createdAt: now,
  }

  await db.collection('fraud_reports').doc(reportId).set(reportDoc)

  const envelope: StandardEnvelope<typeof reportDoc> = {
    status: 'success',
    data: reportDoc,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 201)
})

// GET /v1/reports
reportsRouter.get('/', async (c) => {
  const requestId = c.get('requestId')
  const now = new Date().toISOString()

  const snap = await db.collection('fraud_reports').orderBy('createdAt', 'desc').limit(20).get()
  const reports = snap.docs.map((doc) => doc.data())

  const envelope: StandardEnvelope<typeof reports> = {
    status: 'success',
    data: reports,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})
