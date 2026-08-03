'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import type { UserProfile } from '@iis/core'
import { auth, googleProvider } from '@/lib/firebase-client'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken()
          const res = await fetch('http://localhost:8080/v1/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          if (res.ok) {
            const body = await res.json()
            setUserProfile(body.data)
          }
        } catch (err) {
          console.error('[AuthContext] Verification failed:', err)
        }
      } else {
        setUserProfile(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error('[AuthContext] Google sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
