let audioContext: AudioContext | null = null

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

    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    const startAt = context.currentTime

    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(880, startAt)
    oscillator.frequency.exponentialRampToValueAtTime(660, startAt + 0.24)

    gainNode.gain.setValueAtTime(0.0001, startAt)
    gainNode.gain.exponentialRampToValueAtTime(0.15, startAt + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.38)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + 0.4)
  } catch {
    // SCAFFOLD: Completion sound should never block the app if the browser rejects playback.
  }
}
