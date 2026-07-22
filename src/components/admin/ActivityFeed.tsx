import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { users, geoNodes, activityTemplates } from '../../lib/mockData'

type Item = { id: number; text: string; ago: string }

let counter = 0
function makeItem(): Item {
  const u = users[Math.floor(Math.random() * users.length)]
  const city = geoNodes[Math.floor(Math.random() * geoNodes.length)].city
  const tpl = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]
  return { id: counter++, text: tpl(u.name, city), ago: 'just now' }
}

export default function ActivityFeed() {
  const [items, setItems] = useState<Item[]>(() =>
    Array.from({ length: 6 }, makeItem),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => [makeItem(), ...prev].slice(0, 8))
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-moss-500/10 ring-1 ring-moss-400/20">
              <Activity className="h-4 w-4 text-moss-400" />
            </span>
            <p className="flex-1 text-sm text-slate-300">{item.text}</p>
            <span className="shrink-0 text-xs text-slate-500">
              {i === 0 ? 'just now' : `${i}m ago`}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
