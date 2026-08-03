import { Hono } from 'hono'
import type { StandardEnvelope, ThreatResult } from '@iis/core'
import { threatDetectionAgent, reasoningAgent } from '@iis/agents'
import { db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const scansRouter = new Hono<ApiEnv>()

// POST /v1/scans/analyze
scansRouter.post('/analyze', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body || !body.contentData) {
    throw new AppError('INVALID_INPUT', 'Missing required field: contentData', 400)
  }

  const requestId = c.get('requestId')
  const now = new Date().toISOString()
  const uid = c.req.header('X-User-ID') || 'anonymous'

  // Analyze content using ThreatDetectionAgent
  const threatResult: ThreatResult = await threatDetectionAgent.execute(
    body.contentData,
    body.contentType || 'url',
    body.url
  )

  const scanId = `sr_${crypto.randomUUID().slice(0, 8)}`
  const scanDoc = {
    scanId,
    uid,
    inputValue: body.contentData,
    inputType: body.contentType || 'url',
    url: body.url || null,
    ...threatResult,
    timestamp: now,
  }

  // Save scan result to Firestore (non-blocking)
  db.collection('scan_results').doc(scanId).set(scanDoc).catch((err) => {
    console.error('[ScansRouter] Firestore save failed:', err)
  })

  const envelope: StandardEnvelope<typeof scanDoc> = {
    status: 'success',
    data: scanDoc,
    error: null,
    meta: {
      requestId,
      timestamp: now,
      processingMs: threatResult.processingMs || 1200,
    },
  }

  return c.json(envelope, 200)
})

// GET /v1/scans/:scanId
scansRouter.get('/:scanId', async (c) => {
  const scanId = c.req.param('scanId')
  const requestId = c.get('requestId')
  const now = new Date().toISOString()

  const doc = await db.collection('scan_results').doc(scanId).get()
  if (!doc.exists) {
    throw new AppError('NOT_FOUND', `Scan result with ID ${scanId} not found`, 404)
  }

  const envelope: StandardEnvelope<any> = {
    status: 'success',
    data: doc.data(),
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})

// POST /v1/scans/:scanId/explain
scansRouter.post('/:scanId/explain', async (c) => {
  const scanId = c.req.param('scanId')
  const requestId = c.get('requestId')
  const now = new Date().toISOString()

  const doc = await db.collection('scan_results').doc(scanId).get()
  if (!doc.exists) {
    throw new AppError('NOT_FOUND', `Scan result with ID ${scanId} not found`, 404)
  }

  const scanData = doc.data() as ThreatResult
  const explanation = await reasoningAgent.execute(scanData)

  const envelope: StandardEnvelope<typeof explanation> = {
    status: 'success',
    data: explanation,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})
