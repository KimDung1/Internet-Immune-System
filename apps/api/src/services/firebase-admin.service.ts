import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKey) {
    try {
      const parsedKey = JSON.parse(serviceAccountKey)
      return initializeApp({ credential: cert(parsedKey) })
    } catch {
      console.warn('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON. Falling back to default app.')
    }
  }

  return initializeApp({
    projectId: process.env.GCP_PROJECT_ID || 'internet-immune-system',
  })
}

const adminApp = initFirebaseAdmin()
export const adminAuth = getAuth(adminApp)
export const db = getFirestore(adminApp)
