import { useSyncExternalStore } from 'react'

/**
 * Lightweight demo auth for the investor admin panel.
 *
 * This is intentionally client-only — there is no backend in this demo build.
 * Swap `signIn` for a real API call (and store a session token) when wiring
 * up production auth. The credentials below are for the demo login screen.
 */
const KEY = 'treegrow.admin.session'
export const DEMO_CREDENTIALS = { email: 'admin@treegrow.io', password: 'greener' }

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}

export function signIn(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  if (ok) {
    localStorage.setItem(KEY, '1')
    emit()
  }
  return ok
}

export function signOut() {
  localStorage.removeItem(KEY)
  emit()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

function getSnapshot() {
  return localStorage.getItem(KEY) === '1'
}

export function useAuth() {
  const isAuthed = useSyncExternalStore(subscribe, getSnapshot, () => false)
  return { isAuthed, signIn, signOut }
}
