import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import ExploreNetwork from '../components/home/ExploreNetwork'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import Tokenomics from '../components/home/Tokenomics'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ExploreNetwork />
        <Features />
        <HowItWorks />
        <Tokenomics />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
