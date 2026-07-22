import { Users, Trees, DollarSign, Cloud, Activity, Globe2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/admin/StatCard'
import Panel from '../components/admin/Panel'
import {
  UserGrowthChart,
  RevenueChart,
  SpeciesChart,
  AcquisitionChart,
} from '../components/admin/Charts'
import WorldMap from '../components/admin/WorldMap'
import ActivityFeed from '../components/admin/ActivityFeed'
import { kpis } from '../lib/mockData'

const cards = [
  {
    icon: Users,
    label: 'Total Users',
    value: kpis.totalUsers.toLocaleString(),
    delta: 12.4,
    spark: [12, 18, 16, 24, 28, 34, 40, 52],
  },
  {
    icon: Trees,
    label: 'Trees Planted',
    value: kpis.treesPlanted.toLocaleString(),
    delta: 8.9,
    spark: [20, 28, 26, 34, 40, 44, 50, 58],
  },
  {
    icon: DollarSign,
    label: 'Monthly Revenue',
    value: `$${(kpis.monthlyRevenueUsd / 1000).toFixed(1)}k`,
    delta: 6.2,
    spark: [30, 32, 40, 38, 46, 50, 55, 62],
  },
  {
    icon: Cloud,
    label: 'CO₂ Offset',
    value: `${(kpis.co2OffsetTons / 1_000_000).toFixed(2)}M t`,
    delta: 15.1,
    spark: [10, 14, 22, 26, 30, 42, 48, 60],
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time growth, impact and revenue across the TreeGrow network.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="rounded-lg border border-white/10 bg-night-900/60 px-3 py-1.5">
            Last 12 months
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Growth + species */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="User & Tree Growth"
          subtitle="Cumulative users vs. trees planted"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-moss-400" /> Users
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-ember" /> Trees
              </span>
            </div>
          }
        >
          <UserGrowthChart />
        </Panel>

        <Panel title="Tree Species" subtitle="Distribution of planted trees">
          <SpeciesChart />
        </Panel>
      </div>

      {/* Revenue + activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Monthly Revenue"
          subtitle="Platform fees + staking spread (USD)"
          className="lg:col-span-2"
        >
          <RevenueChart />
        </Panel>

        <Panel
          title="Live Activity"
          subtitle="Real-time network events"
          action={
            <span className="flex items-center gap-1.5 text-xs font-medium text-moss-300">
              <Activity className="h-3.5 w-3.5" /> Live
            </span>
          }
        >
          <ActivityFeed />
        </Panel>
      </div>

      {/* Map + acquisition */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Global User Distribution"
          subtitle="Live location of active user hubs"
          className="lg:col-span-2"
          action={
            <Link
              to="/admin/map"
              className="flex items-center gap-1.5 text-xs font-medium text-moss-300 hover:text-moss-200"
            >
              <Globe2 className="h-3.5 w-3.5" /> Full map
            </Link>
          }
        >
          <WorldMap height={360} />
        </Panel>

        <Panel title="Acquisition" subtitle="Where new users come from">
          <AcquisitionChart />
          <div className="mt-4 rounded-xl bg-white/[0.03] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">30-day retention</span>
              <span className="font-semibold text-white">
                {Math.round(kpis.retention30d * 100)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-moss-500 to-moss-300"
                style={{ width: `${kpis.retention30d * 100}%` }}
              />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
