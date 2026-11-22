// Firebase setup. Values come from .env locally (see .env.example), or from the
// hosting provider's environment variables (e.g. Vercel > Settings > Environment Variables).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// If the config is missing, don't crash the whole site: the game still works,
// only the leaderboard shows an error. db is null in that case.
export const db = (() => {
  if (!config.apiKey || !config.projectId) {
    console.error('Firebase config missing: set the VITE_FIREBASE_* environment variables.')
    return null
  }
  try {
    return getFirestore(initializeApp(config))
  } catch (err) {
    console.error('Firebase failed to start:', err)
    return null
  }
})()
