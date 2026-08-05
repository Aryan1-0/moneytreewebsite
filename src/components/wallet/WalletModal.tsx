import { useEffect } from 'react'
import { createPortal } from 'react-dom'
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* centres the modal, but lets it scroll on short viewports */}
          <div className="relative flex min-h-full items-center justify-center p-4">
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-moss-400/60 bg-[#010304] shadow-[0_0_0_1px_rgba(142,230,90,0.25),0_0_60px_-6px_rgba(142,230,90,0.55)]"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-modal="true"
          >
            {/* Two soft green glows — top-left & bottom-left — blurred so they
                melt smoothly into the near-black card. */}
            <div
              className="pointer-events-none absolute -left-16 -top-16 z-0 h-72 w-72 rounded-full bg-moss-500/[0.16] blur-[110px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 z-0 h-72 w-72 rounded-full bg-moss-500/[0.13] blur-[110px]"
              aria-hidden
            />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/30 text-slate-300 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2">
              {/* Left */}
              <div>
                <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
                  Connect
                  <br />
                  <span className="text-gradient">Your Wallet</span>
                </h2>
                <p className="mt-4 text-lg font-semibold text-moss-300">
                  Secure. Simple. Green Impact.
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                  Connect your wallet to start growing trees, earn rewards, and make a
                  real-world impact on our planet.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {feats.map((f) => (
                    <div key={f.l1}>
                      <f.icon className="h-7 w-7 text-moss-400" />
                      <div className="mt-2.5 text-sm font-semibold text-white">{f.l1}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{f.l2}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-moss-400" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      We never store your private keys
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
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
                  className="tree-blend w-full max-w-[29rem] select-none"
                  draggable={false}
                />
                <button
                  disabled
                  className="mt-5 w-full max-w-[29rem] cursor-not-allowed rounded-xl border border-moss-400/35 bg-gradient-to-b from-moss-500/[0.22] to-moss-500/[0.06] py-3.5 text-[15px] font-semibold text-moss-200 shadow-[0_0_34px_-12px_rgba(142,230,90,0.5)]"
                >
                  Coming Soon
                </button>
                <p className="mt-4 text-center text-sm text-slate-400">
                  Wallet connection will be available soon.
                  <br />
                  <span className="font-semibold text-moss-400">Stay tuned!</span>
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
