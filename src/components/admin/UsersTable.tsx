import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { users, type User } from '../../lib/mockData'

const statusStyles: Record<User['status'], string> = {
  active: 'bg-moss-500/10 text-moss-300 ring-moss-400/20',
  idle: 'bg-amber-500/10 text-amber-300 ring-amber-400/20',
  new: 'bg-sky-500/10 text-sky-300 ring-sky-400/20',
}

type SortKey = 'trees' | 'stakedUsd' | 'joined'

export default function UsersTable({ pageSize = 8 }: { pageSize?: number }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | User['status']>('all')
  const [sort, setSort] = useState<SortKey>('trees')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users
      .filter((u) => (status === 'all' ? true : u.status === status))
      .filter(
        (u) =>
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        sort === 'joined'
          ? b.joined.localeCompare(a.joined)
          : (b[sort] as number) - (a[sort] as number),
      )
  }, [query, status, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages - 1)
  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize)

  return (
    <div>
      {/* controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-night-900/60 px-4 py-2.5 sm:w-72">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search name, city, ID…"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {(['all', 'active', 'idle', 'new'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s)
                setPage(0)
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                status === s
                  ? 'bg-moss-500/15 text-moss-300 ring-1 ring-moss-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 pl-2 font-medium">User</th>
              <th className="py-3 font-medium">Location</th>
              <th className="py-3 font-medium">
                <button
                  onClick={() => setSort('trees')}
                  className={`inline-flex items-center gap-1 ${sort === 'trees' ? 'text-moss-300' : ''}`}
                >
                  Trees <ChevronDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 font-medium">
                <button
                  onClick={() => setSort('stakedUsd')}
                  className={`inline-flex items-center gap-1 ${sort === 'stakedUsd' ? 'text-moss-300' : ''}`}
                >
                  Staked <ChevronDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 pr-2 font-medium">
                <button
                  onClick={() => setSort('joined')}
                  className={`inline-flex items-center gap-1 ${sort === 'joined' ? 'text-moss-300' : ''}`}
                >
                  Joined <ChevronDown className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-night-950"
                      style={{
                        background: `linear-gradient(135deg, hsl(${u.avatarHue} 65% 60%), hsl(${(u.avatarHue + 40) % 360} 65% 45%))`,
                      }}
                    >
                      {u.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </span>
                    <div>
                      <div className="font-medium text-white">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-300">
                  {u.city}, <span className="text-slate-500">{u.country}</span>
                </td>
                <td className="py-3 font-medium text-white">{u.trees}</td>
                <td className="py-3 text-slate-300">${u.stakedUsd.toLocaleString()}</td>
                <td className="py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${statusStyles[u.status]}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="py-3 pr-2 text-slate-400">{u.joined}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>
          {filtered.length} user{filtered.length !== 1 && 's'} · page {current + 1} of{' '}
          {pages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={current >= pages - 1}
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
