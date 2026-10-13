import Navbar from '../components/layout/Navbar'
import GardenGlobe from '../components/garden/GardenGlobe'

export default function Garden() {
  return (
    <div className="min-h-screen text-slate-200">
      <Navbar />
      <main>
        <GardenGlobe />
      </main>
    </div>
  )
}
