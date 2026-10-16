import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { lazy, Suspense, useLayoutEffect } from 'react'
import Community from './pages/Community'
import Marketplace from './pages/Marketplace'
import Token from './pages/Token'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminMap from './pages/AdminMap'
import AdminLayout from './components/admin/AdminLayout'
import { useAuth } from './lib/auth'

// three.js is heavy — only load it when someone opens the Garden page.
const Garden = lazy(() => import('./pages/Garden'))

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed } = useAuth()
  return isAuthed ? children : <Navigate to="/admin/login" replace />
}

// Client-side navigation keeps the old scroll position, so a new page would
// open at the same depth as the last one. Start every new page at the top
// (instantly — not with the page's smooth-scroll).
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/garden"
          element={
            <Suspense fallback={null}>
              <Garden />
            </Suspense>
          }
        />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/community" element={<Community />} />
        <Route path="/token" element={<Token />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="map" element={<AdminMap />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
