import Panel from '../components/admin/Panel'
import WorldMap from '../components/admin/WorldMap'
import { geoNodes, kpis } from '../lib/mockData'

export default function AdminMap() {
  const ranked = [...geoNodes].sort((a, b) => b.users - a.users)
  const total = geoNodes.reduce((s, n) => s + n.users, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Live Map</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time geographic distribution of the TreeGrow user base across{' '}
          {kpis.countries} countries.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Panel
          title="Global Activity"
          subtitle="Hover a hub to see live user counts"
          action={
            <span className="flex items-center gap-1.5 text-xs font-medium text-moss-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-moss-400" />
              Streaming
            </span>
          }
        >
          <WorldMap height={520} />
        </Panel>

        <Panel title="Top Regions" subtitle="By active users">
          <ul className="space-y-3">
            {ranked.map((n, i) => (
              <li key={n.city}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-4 text-xs text-slate-500">{i + 1}</span>
                    <span className="font-medium text-white">{n.city}</span>
                    <span className="text-xs text-slate-500">{n.country}</span>
                  </span>
                  <span className="font-medium text-slate-300">
                    {n.users.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-moss-600 to-moss-300"
                    style={{ width: `${(n.users / ranked[0].users) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mapped users</span>
              <span className="font-semibold text-white">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
