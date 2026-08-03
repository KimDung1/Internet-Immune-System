import { Hono } from 'hono'
import type { StandardEnvelope, UserProfile } from '@iis/core'
import { db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const usersRouter = new Hono<ApiEnv>()

// GET /v1/users/me
usersRouter.get('/me', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const now = new Date().toISOString()

  const doc = await db.collection('users').doc(uid).get()
  const userProfile: UserProfile = doc.exists
    ? (doc.data() as UserProfile)
    : {
        uid,
        email: 'user@immune-system.vn',
        displayName: 'Người Dùng Kháng Thể',
        photoURL: null,
        trustScore: 87,
        antibodyLevel: 5,
        badges: ['early_adopter', 'phishing_shield'],
        totalScans: 24,
        threatsBlocked: 6,
        settings: {
          autoBlock: true,
          sensitivity: 'balanced',
          language: 'vi',
          trustedDomains: ['google.com', 'gov.vn'],
        },
        createdAt: now,
        lastActive: now,
      }

  const envelope: StandardEnvelope<UserProfile> = {
    status: 'success',
    data: userProfile,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})

// PATCH /v1/users/me/settings
usersRouter.patch('/me/settings', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const body = await c.req.json().catch(() => null)
  const now = new Date().toISOString()

  if (!body) {
    throw new AppError('INVALID_INPUT', 'Missing settings payload', 400)
  }

  await db.collection('users').doc(uid).set({ settings: body }, { merge: true }).catch(() => {})

  const envelope: StandardEnvelope<typeof body> = {
    status: 'success',
    data: body,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})

// GET /v1/users/me/history
usersRouter.get('/me/history', async (c) => {
  const requestId = c.get('requestId')
  const uid = c.req.header('X-User-ID') || 'anonymous'
  const now = new Date().toISOString()

  const snap = await db.collection('scan_results').where('uid', '==', uid).orderBy('timestamp', 'desc').limit(20).get().catch(() => null)
  const history = snap ? snap.docs.map((doc) => doc.data()) : []

  const envelope: StandardEnvelope<typeof history> = {
    status: 'success',
    data: history,
    error: null,
    meta: { requestId, timestamp: now },
  }

  return c.json(envelope, 200)
})
