import { Hono } from 'hono'
import type { StandardEnvelope } from '@iis/core'
import { memoryAgent } from '@iis/agents'
import { db } from '../services/firebase-admin.service.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const vaccinationRouter = new Hono<ApiEnv>()

// POST /v1/vaccine/immunize
vaccinationRouter.post('/immunize', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const body = await c.req.json().catch(() => ({}))
  const pattern = body.threatPattern || 'Phishing_Generic_v1'
  const now = new Date().toISOString()

  const vaccine = memoryAgent.generateVaccine(pattern, 87)
  const docData = { ...vaccine, uid, createdAt: now }

  await db.collection('vaccines').doc(vaccine.vaccineId).set(docData).catch(() => {})

  const envelope: StandardEnvelope<typeof docData> = {
    status: 'success',
    data: docData,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 201)
})

// GET /v1/vaccine/antibodies
vaccinationRouter.get('/antibodies', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const now = new Date().toISOString()

  const snap = await db.collection('vaccines').where('uid', '==', uid).get().catch(() => null)
  const vaccines = snap ? snap.docs.map((d) => d.data()) : []

  const envelope: StandardEnvelope<typeof vaccines> = {
    status: 'success',
    data: vaccines,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})
