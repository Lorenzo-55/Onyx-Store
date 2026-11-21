import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { useKeyboardAudio } from '../src/hooks/useKeyboardAudio'
import { switches } from '../src/data/switches'

function mockAudio() {
  const sources: {
    buffer: unknown
    connect: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
    start: ReturnType<typeof vi.fn>
    onended: (() => void) | null
  }[] = []
  const gain = { gain: { value: 1 }, connect: vi.fn() }
  const context = {
    destination: {},
    createGain: vi.fn(() => gain),
    resume: vi.fn(async () => undefined),
    close: vi.fn(async () => undefined),
    decodeAudioData: vi.fn(async () => ({ duration: 0.3 })),
    createBufferSource: vi.fn(() => {
      const source = {
        buffer: null as unknown,
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        onended: null as (() => void) | null,
      }
      sources.push(source)
      return source
    }),
  }
  vi.stubGlobal(
    'AudioContext',
    class {
      constructor() {
        return context
      }
    },
  )
  const fetchSample = vi.fn(async () => ({
    ok: true,
    arrayBuffer: async () => new ArrayBuffer(10),
  }))
  vi.stubGlobal('fetch', fetchSample)
  return { sources, gain, context, fetchSample }
}

describe('switch audio engine', () => {
  it('preloads seven decoded buffers and overlaps strokes without fetching again', async () => {
    const { context, sources, fetchSample, gain } = mockAudio()
    const hook = renderHook(useKeyboardAudio)
    await act(() => hook.result.current.enable())
    expect(fetchSample).toHaveBeenCalledTimes(7)
    expect(context.decodeAudioData).toHaveBeenCalledTimes(7)
    await act(async () => {
      await Promise.all([
        hook.result.current.play('mx-red'),
        hook.result.current.play('mx-red'),
        hook.result.current.play('mx-blue'),
      ])
    })
    expect(fetchSample).toHaveBeenCalledTimes(7)
    expect(sources).toHaveLength(3)
    sources.forEach((source) => expect(source.start).toHaveBeenCalledOnce())
    sources[0].onended?.()
    expect(sources[0].disconnect).toHaveBeenCalledOnce()
    act(() => hook.result.current.changeVolume(0.25))
    expect(gain.gain.value).toBe(0.25)
    act(() => hook.result.current.toggleMute())
    expect(gain.gain.value).toBe(0)
    await act(() => hook.result.current.play('mx-red'))
    expect(sources).toHaveLength(3)
    act(() => hook.result.current.toggleMute())
    expect(gain.gain.value).toBe(0.25)
    hook.unmount()
    expect(context.close).toHaveBeenCalledOnce()
  })

  it('reports failed loads and allows retry instead of caching a rejected buffer', async () => {
    const { fetchSample, sources } = mockAudio()
    fetchSample.mockRejectedValueOnce(new Error('offline'))
    const hook = renderHook(useKeyboardAudio)
    await act(() => hook.result.current.play('mx-red'))
    expect(hook.result.current.status).toMatch(/Audio unavailable/)
    await act(() => hook.result.current.play('mx-red'))
    expect(sources).toHaveLength(1)
    expect(hook.result.current.status).toMatch(/Audio ready/)
  })

  it('ships seven distinct, valid local PCM samples', () => {
    const assets = switches.map(({ id }) =>
      readFileSync(`public/audio/switches/${id}.wav`),
    )
    expect(new Set(assets.map((asset) => asset.toString('base64'))).size).toBe(7)
    assets.forEach((asset) => {
      expect(asset.toString('ascii', 0, 4)).toBe('RIFF')
      expect(asset.toString('ascii', 8, 12)).toBe('WAVE')
      expect(asset.readUInt32LE(24)).toBe(44100)
      expect(asset.readUInt32LE(40)).toBe(asset.length - 44)
    })
  })
})
