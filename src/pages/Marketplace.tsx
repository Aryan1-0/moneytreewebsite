import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WalletModal from '../components/wallet/WalletModal'
import MarketChart from '../components/market/MarketChart'
import MarketItems from '../components/market/MarketItems'

export default function Marketplace() {
  // Buying needs a wallet — Buy Now opens the (coming soon) wallet popup.
  const [walletOpen, setWalletOpen] = useState(false)

  return (
    <div className="min-h-screen text-slate-200">
      <Navbar />
      <main className="container-page pb-6 pt-[104px]">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Track the GWT token live, and collect NFTs, fruit season passes and garden specials.
          </p>
        </motion.div>

        <MarketChart />

        <div className="mt-12">
          <MarketItems onBuy={() => setWalletOpen(true)} />
        </div>
      </main>
      <Footer />
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </div>
  )
}
