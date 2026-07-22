import { TreePine } from 'lucide-react'

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-moss-500/15 ring-1 ring-moss-400/30">
        <TreePine className="h-5 w-5 text-moss-400" strokeWidth={2.2} />
      </div>
      <div className="leading-none">
        <div className="text-lg font-bold tracking-tight text-white">TreeGrow</div>
        {!compact && (
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-moss-400/80">
            Plant Today, A Greener Tomorrow
          </div>
        )}
      </div>
    </div>
  )
}
