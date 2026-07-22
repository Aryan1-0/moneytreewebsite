import { Users, UserPlus, Coins, MapPin } from 'lucide-react'
import Panel from '../components/admin/Panel'
import UsersTable from '../components/admin/UsersTable'
import { users, kpis, geoNodes } from '../lib/mockData'

const quick = [
  {
    icon: Users,
    label: 'Total Users',
    value: kpis.totalUsers.toLocaleString(),
  },
  {
    icon: UserPlus,
    label: 'New this month',
    value: (kpis.totalUsers - 5010).toLocaleString(),
  },
  {
    icon: Coins,
    label: 'Avg. staked',
    value: `$${Math.round(users.reduce((s, u) => s + u.stakedUsd, 0) / users.length).toLocaleString()}`,
  },
  {
    icon: MapPin,
    label: 'Active cities',
    value: geoNodes.length.toString(),
  },
]

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          Explore the community — search, filter and sort by impact and activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quick.map((q) => (
          <div key={q.label} className="glass-strong flex items-center gap-4 p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-moss-500/10 ring-1 ring-moss-400/20">
              <q.icon className="h-5 w-5 text-moss-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{q.value}</div>
              <div className="text-sm text-slate-400">{q.label}</div>
            </div>
          </div>
        ))}
      </div>

      <Panel title="All Users" subtitle="A live sample of the TreeGrow community">
        <UsersTable />
      </Panel>
    </div>
  )
}
