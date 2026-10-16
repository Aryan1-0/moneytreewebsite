import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import GardenGlobe from '../components/garden/GardenGlobe'

export default function Garden() {
  return (
    <div className="min-h-screen text-slate-200">
      <Navbar />
      <main>
        <GardenGlobe />
      </main>
      <Footer />
    </div>
  )
}
