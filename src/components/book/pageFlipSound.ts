/**
 * Page-flip sound — a real recording (SoundJay.com "page-flip-01a", free to
 * use), the same one the reference book slider uses.
 *
 * It is decoded once into an AudioBuffer and played through the Web Audio
 * API, so flips start instantly and can overlap while riffling through
 * chapters. Browsers only allow audio after a user gesture — every page turn
 * comes from a click, tap or key press, so the first turn unlocks it.
 */

const SRC = '/sounds/page-flip.mp3'

let ctx: AudioContext | null = null
let buffer: AudioBuffer | null = null
let loading: Promise<void> | null = null

function context() {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

/** Fetch + decode the sound ahead of the first turn. Safe to call repeatedly. */
export function preloadPageFlip() {
  const ac = context()
  if (!ac) return Promise.resolve()
  loading ??= fetch(SRC)
    .then((r) => r.arrayBuffer())
    .then((data) => ac.decodeAudioData(data))
    .then((b) => {
      buffer = b
    })
    .catch(() => {
      loading = null // try again next time
    })
  return loading
}

/** Play one page flip. `strength` < 1 for quick riffles through many pages. */
export function playPageFlip(strength = 1) {
  const ac = context()
  if (!ac) return
  if (ac.state === 'suspended') void ac.resume()
  const play = () => {
    if (!buffer) return
    const src = ac.createBufferSource()
    src.buffer = buffer
    src.playbackRate.value = 0.96 + Math.random() * 0.08 // subtle variety
    const gain = ac.createGain()
    gain.gain.value = 0.8 * strength
    src.connect(gain).connect(ac.destination)
    src.start()
  }
  if (buffer) play()
  else void preloadPageFlip().then(play)
}
