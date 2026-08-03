import { Hono } from 'hono'
import type { StandardEnvelope, UserProfile } from '@iis/core'
import { adminAuth, db } from '../services/firebase-admin.service.js'
import { AppError } from '../middleware/error-handler.middleware.js'
import type { ApiEnv } from '../middleware/request-id.middleware.js'

export const authRouter = new Hono<ApiEnv>()

authRouter.post('/verify', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', 'Missing or invalid Authorization header', 401)
  }

  const token = authHeader.split('Bearer ')[1]
  const requestId = c.get('requestId')
  const now = new Date().toISOString()

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid
    const email = decodedToken.email || ''
    const displayName = decodedToken.name || email.split('@')[0] || 'User'
    const photoURL = decodedToken.picture || null

    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    let userProfile: UserProfile

    if (!userDoc.exists) {
      userProfile = {
        uid,
        email,
        displayName,
        photoURL,
        trustScore: 50,
        antibodyLevel: 3,
        badges: ['first_login_v1'],
        totalScans: 0,
        threatsBlocked: 0,
        settings: {
          autoBlock: true,
          sensitivity: 'balanced',
          language: 'vi',
          trustedDomains: [],
        },
        createdAt: now,
        lastActive: now,
      }
      await userRef.set(userProfile)
    } else {
      userProfile = userDoc.data() as UserProfile
      userProfile.lastActive = now
      await userRef.update({ lastActive: now })
    }

    const envelope: StandardEnvelope<UserProfile> = {
      status: 'success',
      data: userProfile,
      error: null,
      meta: {
        requestId,
        timestamp: now,
      },
    }

    return c.json(envelope, 200)
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError('UNAUTHORIZED', 'Failed to verify Firebase ID token', 401, error.message)
  }
})
