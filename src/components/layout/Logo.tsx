export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/logo.png"
      alt="Green World"
      draggable={false}
      className={`w-auto select-none ${compact ? 'h-8' : 'h-11'}`}
    />
  )
}
