import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Sprout, TreePine, Globe2, ShieldCheck } from 'lucide-react'

const feats = [
  { icon: Sprout, l1: 'Secure', l2: 'Your Data' },
  { icon: TreePine, l1: 'Real Impact', l2: 'Every Tree' },
  { icon: Globe2, l1: 'A Greener', l2: 'Tomorrow' },
]

export default function WalletModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-moss-400/40 bg-[#040906] shadow-[0_0_70px_-12px_rgba(142,230,90,0.45)]"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/30 text-slate-300 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid items-center gap-6 p-7 sm:p-9 lg:grid-cols-2">
              {/* Left */}
              <div>
                <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white">
                  Connect
                  <br />
                  <span className="text-gradient">Your Wallet</span>
                </h2>
                <p className="mt-3 text-lg font-semibold text-moss-300">
                  Secure. Simple. Green Impact.
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                  Connect your wallet to start growing trees, earn rewards, and make a
                  real-world impact on our planet.
                </p>

                <div className="mt-7 grid max-w-xs grid-cols-3 gap-3">
                  {feats.map((f) => (
                    <div key={f.l1}>
                      <f.icon className="h-6 w-6 text-moss-400" />
                      <div className="mt-2 text-xs font-semibold text-white">{f.l1}</div>
                      <div className="text-[11px] text-slate-400">{f.l2}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-moss-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      We never store your private keys
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Your wallet, your control.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-center">
                <img
                  src="/wallet.png"
                  alt="A leather wallet with the TreeGrow leaf"
                  className="tree-blend w-full max-w-sm select-none"
                  draggable={false}
                />
                <button
                  disabled
                  className="mt-3 w-full max-w-sm cursor-not-allowed rounded-xl border border-moss-400/25 bg-moss-500/[0.08] py-3 text-sm font-semibold text-moss-300/80"
                >
                  Coming Soon
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">
                  Wallet connection will be available soon.
                  <br />
                  <span className="font-semibold text-moss-400">Stay tuned!</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
