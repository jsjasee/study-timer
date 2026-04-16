let audioContext: AudioContext | null = null

type BellPartial = {
  frequency: number
  gain: number
  decay: number
  detune?: number
}

function getAudioContext() {
  if (typeof window === "undefined") {
    return null
  }

  const AudioContextConstructor = window.AudioContext

  if (!AudioContextConstructor) {
    return null
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor()
  }

  return audioContext
}

// SCAFFOLD: Audio is isolated so the timer flow can fail silently if playback is unavailable.
export function primeChime() {
  getAudioContext()
}

export async function playCompletionChime(soundEnabled: boolean) {
  if (!soundEnabled) {
    return
  }

  const context = getAudioContext()

  if (!context) {
    return
  }

  try {
    if (context.state === "suspended") {
      await context.resume()
    }

    const startAt = context.currentTime
    const masterGain = context.createGain()
    const partials: BellPartial[] = [
      { frequency: 1046.5, gain: 0.12, decay: 1.8 },
      { frequency: 1318.5, gain: 0.09, decay: 1.45, detune: 4 },
      { frequency: 1568, gain: 0.06, decay: 1.15, detune: -6 },
      { frequency: 2093, gain: 0.035, decay: 0.95, detune: 3 },
    ]

    masterGain.gain.setValueAtTime(0.0001, startAt)
    masterGain.gain.exponentialRampToValueAtTime(0.55, startAt + 0.01)
    masterGain.gain.exponentialRampToValueAtTime(0.22, startAt + 0.18)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 2)
    masterGain.connect(context.destination)

    for (const partial of partials) {
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(partial.frequency, startAt)

      if (partial.detune) {
        oscillator.detune.setValueAtTime(partial.detune, startAt)
      }

      gainNode.gain.setValueAtTime(0.0001, startAt)
      gainNode.gain.exponentialRampToValueAtTime(partial.gain, startAt + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        startAt + partial.decay
      )

      oscillator.connect(gainNode)
      gainNode.connect(masterGain)
      oscillator.start(startAt)
      oscillator.stop(startAt + partial.decay + 0.08)
    }
  } catch {
    // SCAFFOLD: Completion sound should never block the app if the browser rejects playback.
  }
}
