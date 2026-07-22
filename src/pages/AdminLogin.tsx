import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Button from '../components/ui/Button'
import { useAuth, DEMO_CREDENTIALS } from '../lib/auth'
import Fireflies from '../components/home/Fireflies'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (signIn(email, password)) {
      navigate('/admin')
    } else {
      setError('Invalid credentials. Try the pre-filled demo login.')
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <Fireflies count={18} />
      <div
        className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-moss-500/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="glass-strong p-8">
          <div className="flex items-center gap-2 text-moss-300">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Admin Console
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to view the TreeGrow investor dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Email
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-night-900/60 px-4 py-3 focus-within:border-moss-400/50">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  placeholder="admin@treegrow.io"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-night-900/60 px-4 py-3 focus-within:border-moss-400/50">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" size="lg" className="w-full">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-5 rounded-lg bg-white/[0.03] px-4 py-3 text-center text-xs text-slate-500">
            Demo access is pre-filled — just press{' '}
            <span className="text-slate-300">Sign in</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
