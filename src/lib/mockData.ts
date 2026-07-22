/**
 * Demo dataset for the investor-facing admin panel.
 *
 * All figures here are simulated. In production these would come from the
 * TreeGrow API / analytics warehouse. Kept in one module so it's trivial to
 * find and replace with real endpoints later.
 */

export const kpis = {
  treesPlanted: 12_450,
  totalUsers: 5_230,
  co2OffsetTons: 2_350_000, // 2.35M kg reported as tons on the site copy
  countries: 18,
  monthlyRevenueUsd: 486_200,
  activeStakedUsd: 8_940_000,
  dailyActiveUsers: 1_842,
  retention30d: 0.63,
}

export type TimePoint = { month: string; users: number; trees: number; revenue: number }

// 12 months of steady, believable growth.
export const growth: TimePoint[] = [
  { month: 'Aug', users: 1120, trees: 2100, revenue: 82_000 },
  { month: 'Sep', users: 1580, trees: 3050, revenue: 118_000 },
  { month: 'Oct', users: 2010, trees: 3980, revenue: 154_000 },
  { month: 'Nov', users: 2460, trees: 5120, revenue: 197_000 },
  { month: 'Dec', users: 2980, trees: 6340, revenue: 241_000 },
  { month: 'Jan', users: 3390, trees: 7480, revenue: 288_000 },
  { month: 'Feb', users: 3720, trees: 8390, revenue: 322_000 },
  { month: 'Mar', users: 4080, trees: 9260, revenue: 361_000 },
  { month: 'Apr', users: 4410, trees: 10_240, revenue: 402_000 },
  { month: 'May', users: 4720, trees: 11_180, revenue: 438_000 },
  { month: 'Jun', users: 5010, trees: 11_920, revenue: 467_000 },
  { month: 'Jul', users: 5230, trees: 12_450, revenue: 486_200 },
]

export const treeSpecies = [
  { name: 'Oak', value: 3120, color: '#22c55e' },
  { name: 'Mango', value: 2680, color: '#4ade80' },
  { name: 'Neem', value: 2240, color: '#16a34a' },
  { name: 'Pine', value: 1890, color: '#86efac' },
  { name: 'Bamboo', value: 1420, color: '#f5b544' },
  { name: 'Other', value: 1100, color: '#0ea5a3' },
]

export const acquisition = [
  { source: 'Organic', value: 38 },
  { source: 'Referral', value: 27 },
  { source: 'Social', value: 19 },
  { source: 'Paid', value: 11 },
  { source: 'Partners', value: 5 },
]

export type GeoNode = {
  city: string
  country: string
  lat: number
  lng: number
  users: number
}

export const geoNodes: GeoNode[] = [
  { city: 'Bengaluru', country: 'India', lat: 12.97, lng: 77.59, users: 812 },
  { city: 'Mumbai', country: 'India', lat: 19.08, lng: 72.88, users: 604 },
  { city: 'London', country: 'UK', lat: 51.51, lng: -0.13, users: 498 },
  { city: 'New York', country: 'USA', lat: 40.71, lng: -74.01, users: 731 },
  { city: 'San Francisco', country: 'USA', lat: 37.77, lng: -122.42, users: 442 },
  { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.4, users: 318 },
  { city: 'Singapore', country: 'Singapore', lat: 1.35, lng: 103.82, users: 386 },
  { city: 'Sydney', country: 'Australia', lat: -33.87, lng: 151.21, users: 274 },
  { city: 'São Paulo', country: 'Brazil', lat: -23.55, lng: -46.63, users: 351 },
  { city: 'Lagos', country: 'Nigeria', lat: 6.52, lng: 3.38, users: 229 },
  { city: 'Dubai', country: 'UAE', lat: 25.2, lng: 55.27, users: 263 },
  { city: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, users: 298 },
  { city: 'Tokyo', country: 'Japan', lat: 35.68, lng: 139.69, users: 341 },
  { city: 'Nairobi', country: 'Kenya', lat: -1.29, lng: 36.82, users: 187 },
  { city: 'Jakarta', country: 'Indonesia', lat: -6.21, lng: 106.85, users: 205 },
]

export type User = {
  id: string
  name: string
  email: string
  country: string
  city: string
  trees: number
  stakedUsd: number
  status: 'active' | 'idle' | 'new'
  joined: string
  avatarHue: number
}

const firstNames = [
  'Aarav', 'Maya', 'Liam', 'Sofia', 'Noah', 'Aisha', 'Lucas', 'Priya',
  'Ethan', 'Chloe', 'Kai', 'Ananya', 'Diego', 'Hana', 'Omar', 'Zara',
  'Leo', 'Ines', 'Yuki', 'Nadia',
]
const lastNames = [
  'Sharma', 'Okafor', 'Silva', 'Chen', 'Patel', 'Müller', 'Kim', 'Rossi',
  'Nguyen', 'Haddad', 'Johnson', 'Costa', 'Ahmed', 'Weber', 'Tan', 'Reyes',
]

// Deterministic pseudo-random so the table is stable between renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const users: User[] = (() => {
  const rand = mulberry32(42)
  const statuses: User['status'][] = ['active', 'active', 'active', 'idle', 'new']
  return Array.from({ length: 48 }, (_, i) => {
    const node = geoNodes[Math.floor(rand() * geoNodes.length)]
    const fn = firstNames[Math.floor(rand() * firstNames.length)]
    const ln = lastNames[Math.floor(rand() * lastNames.length)]
    const trees = Math.floor(rand() * 240) + 3
    const daysAgo = Math.floor(rand() * 420)
    const joined = new Date(2026, 6, 22)
    joined.setDate(joined.getDate() - daysAgo)
    return {
      id: `TG-${(10234 + i).toString()}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@mail.com`,
      country: node.country,
      city: node.city,
      trees,
      stakedUsd: Math.floor(rand() * 9000) + 120,
      status: statuses[Math.floor(rand() * statuses.length)],
      joined: joined.toISOString().slice(0, 10),
      avatarHue: Math.floor(rand() * 360),
    }
  })
})()

// Templates for the simulated live activity feed.
export const activityTemplates: Array<(n: string, c: string) => string> = [
  (n, c) => `${n} planted an Oak in ${c}`,
  (n) => `${n} staked $${(Math.floor(Math.random() * 40) * 25 + 50).toLocaleString()} TREE`,
  (n, c) => `${n} from ${c} joined TreeGrow`,
  (n, c) => `${n} claimed a carbon reward in ${c}`,
  (n) => `${n} planted a Mango sapling`,
  (n) => `${n} reached a 30-day streak`,
]
