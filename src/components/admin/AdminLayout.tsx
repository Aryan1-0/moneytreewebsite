import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Globe2,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import Logo from '../layout/Logo'
import { useAuth } from '../../lib/auth'

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/map', label: 'Live Map', icon: Globe2 },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleSignOut() {
    signOut()
    navigate('/admin/login')
  }

  const SidebarContent = (
    <>
      <div className="px-6 py-6">
        <Link to="/admin">
          <Logo compact />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Analytics
        </div>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-moss-500/15 text-moss-300 ring-1 ring-moss-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <Link
          to="/"
          className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/[0.06] bg-night-900/40 backdrop-blur-xl lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/[0.06] bg-night-900">
            <button
              className="absolute right-4 top-5 text-slate-400"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-night-950/70 px-5 backdrop-blur-xl sm:px-8">
          <button
            className="text-slate-300 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-night-900/60 px-4 py-2 sm:flex sm:w-72">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              placeholder="Search users, cities…"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-moss-500/10 px-3 py-1.5 text-xs font-medium text-moss-300 ring-1 ring-moss-400/20 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-moss-400" />
              Live
            </span>
            <button className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-ember" />
            </button>
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 py-1 pl-1 pr-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-moss-400 to-moss-600 text-xs font-bold text-night-950">
                AD
              </div>
              <span className="hidden text-sm font-medium text-slate-200 sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-7 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
