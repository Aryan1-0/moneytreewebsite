import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { lazy, Suspense } from 'react'
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

export default function App() {
  return (
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
  )
}
