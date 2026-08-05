export default function Logo({ compact = false }: { compact?: boolean }) {
  // The image is scaled up 2x with a transform so it looks bigger WITHOUT
  // enlarging its layout box — the nav/footer keep their original size.
  return (
    <img
      src="/logo.png"
      alt="Green World"
      draggable={false}
      className={`w-auto origin-left scale-[2] select-none ${compact ? 'h-8' : 'h-11'}`}
    />
  )
}
