import { useCallback, useEffect, useRef, useState } from 'react'
import { sampleUrl, switches } from '../data/switches'

export function useKeyboardAudio() {
  const engine = useRef<{ context: AudioContext; gain: GainNode } | null>(null)
  const buffers = useRef(new Map<string, Promise<AudioBuffer>>())
  const alive = useRef(true)
  const settings = useRef({ volume: 0.65, muted: false })
  const [volume, setVolume] = useState(0.65)
  const [muted, setMuted] = useState(false)
  const [status, setStatus] = useState('Enable audio to load the sample library.')

  useEffect(() => {
    alive.current = true
    const cache = buffers.current
    return () => {
      alive.current = false
      void engine.current?.context.close()
      engine.current = null
      cache.clear()
    }
  }, [])

  const initialize = useCallback(() => {
    if (!engine.current) {
      const context = new AudioContext({ latencyHint: 'interactive' })
      const gain = context.createGain()
      gain.gain.value = settings.current.muted ? 0 : settings.current.volume
      gain.connect(context.destination)
      engine.current = { context, gain }
    }
    return engine.current
  }, [])

  const load = useCallback((id: string, context: AudioContext) => {
    let pending = buffers.current.get(id)
    if (!pending) {
      pending = fetch(sampleUrl(id))
        .then((response) => {
          if (!response.ok) throw new Error('Sample unavailable')
          return response.arrayBuffer()
        })
        .then((bytes) => context.decodeAudioData(bytes))
        .catch((error: unknown) => {
          buffers.current.delete(id)
          throw error
        })
      buffers.current.set(id, pending)
    }
    return pending
  }, [])

  const enable = useCallback(async () => {
    try {
      const { context } = initialize()
      await context.resume()
      if (alive.current) setStatus('Loading samples…')
      await Promise.all(switches.map((item) => load(item.id, context)))
      if (alive.current) setStatus('Audio ready · placeholder samples')
    } catch {
      if (alive.current)
        setStatus('Audio unavailable. Check your browser and try Enable audio again.')
    }
  }, [initialize, load])

  const play = useCallback(
    async (id: string) => {
      if (settings.current.muted || settings.current.volume === 0) return
      try {
        const current = initialize()
        await current.context.resume()
        const buffer = await load(id, current.context)
        if (!alive.current || engine.current !== current) return
        // A fresh source per stroke lets rapid keystrokes overlap naturally.
        const source = current.context.createBufferSource()
        source.buffer = buffer
        source.connect(current.gain)
        source.onended = () => source.disconnect()
        source.start()
        setStatus('Audio ready · placeholder samples')
      } catch {
        if (alive.current)
          setStatus('Audio unavailable. Check your browser and try Enable audio again.')
      }
    },
    [initialize, load],
  )

  const changeVolume = (value: number) => {
    settings.current.volume = value
    setVolume(value)
    if (engine.current)
      engine.current.gain.gain.value = settings.current.muted ? 0 : value
  }
  const toggleMute = () => {
    settings.current.muted = !settings.current.muted
    setMuted(settings.current.muted)
    if (engine.current)
      engine.current.gain.gain.value = settings.current.muted
        ? 0
        : settings.current.volume
  }
  return { play, enable, status, volume, changeVolume, muted, toggleMute }
}
