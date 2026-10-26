/**
 * Page-flip sound, synthesised with the Web Audio API (no audio file):
 * a burst of paper-rustle noise swept through a band-pass filter, then a
 * soft "slap" as the page lands.
 *
 * Browsers only allow audio after a user gesture — every page turn comes
 * from a click, tap or key press, so the first turn unlocks it.
 */

let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null
let master: GainNode | null = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
    // 1s of white noise, reused by every flip
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function burst(
  ac: AudioContext,
  at: number,
  dur: number,
  peak: number,
  filter: (f: BiquadFilterNode, t: number) => void,
  type: BiquadFilterType,
) {
  const src = ac.createBufferSource()
  src.buffer = noise
  src.playbackRate.value = 0.9 + Math.random() * 0.2 // no two flips identical
  const f = ac.createBiquadFilter()
  f.type = type
  filter(f, at)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(peak, at + Math.min(0.04, dur / 4))
  g.gain.exponentialRampToValueAtTime(peak * 0.45, at + dur * 0.5)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  src.connect(f).connect(g).connect(master!)
  src.start(at, Math.random() * 0.5)
  src.stop(at + dur + 0.05)
}

/** Play one page flip. `strength` < 1 for quick riffles through many pages. */
export function playPageFlip(strength = 1) {
  const ac = audio()
  if (!ac || !noise || !master) return
  const t = ac.currentTime + 0.01
  // the rustle as the page lifts and sweeps across
  burst(
    ac,
    t,
    0.38,
    0.6 * strength,
    (f, at) => {
      f.Q.value = 0.9
      f.frequency.setValueAtTime(700, at)
      f.frequency.exponentialRampToValueAtTime(2800, at + 0.16)
      f.frequency.exponentialRampToValueAtTime(1300, at + 0.38)
    },
    'bandpass',
  )
  // the soft slap as it lands
  burst(
    ac,
    t + 0.27,
    0.09,
    0.45 * strength,
    (f) => {
      f.frequency.value = 1600
    },
    'highpass',
  )
}
