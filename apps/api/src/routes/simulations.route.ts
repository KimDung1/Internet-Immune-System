import { Hono } from 'hono'
import type { StandardEnvelope, ConsequenceOutput, ThreatResult } from '@iis/core'
import { simulationAgent } from '@iis/agents'
import { db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const simulationsRouter = new Hono<ApiEnv>()

// POST /v1/scans/:scanId/simulate
simulationsRouter.post('/scans/:scanId/simulate', async (c) => {
  const scanId = c.req.param('scanId')
  const requestId = c.get('requestId')
  const now = new Date().toISOString()

  // Idempotency check: check if simulation already exists
  const existingSnap = await db.collection('simulations').where('scanId', '==', scanId).limit(1).get()
  if (!existingSnap.empty) {
    const existingSim = existingSnap.docs[0]!.data() as ConsequenceOutput
    const envelope: StandardEnvelope<ConsequenceOutput> = {
      status: 'success',
      data: existingSim,
      error: null,
      meta: { requestId, timestamp: now },
    }
    return c.json(envelope, 200)
  }

  // Read scan result
  const scanDoc = await db.collection('scan_results').doc(scanId).get()
  if (!scanDoc.exists) {
    throw new AppError('NOT_FOUND', `Scan result with ID ${scanId} not found`, 404)
  }

  const scanResult = scanDoc.data() as ThreatResult
  if (scanResult.classification === 'safe') {
    throw new AppError('INVALID_INPUT', 'Cannot generate consequence simulation for safe content', 400)
  }

  // Generate simulation
  const consequence = await simulationAgent.executeConsequence(scanResult, scanId)

  // Save to simulations collection & update scan_result
  await db.collection('simulations').doc(consequence.simulationId).set(consequence)
  await db.collection('scan_results').doc(scanId).update({ simulationId: consequence.simulationId }).catch(() => {})

  const envelope: StandardEnvelope<ConsequenceOutput> = {
    status: 'success',
    data: consequence,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})
