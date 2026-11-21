import { useEffect, useRef } from 'react'

type Key = { code: string; label: string; width?: number }
const key = (code: string, label: string, width = 1): Key => ({ code, label, width })
const keyboardRows: Key[][] = [
  [
    key('Escape', 'esc'),
    ...Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`, `F${i + 1}`)),
    key('Delete', 'del'),
  ],
  [
    key('Backquote', '`'),
    ...'1234567890'.split('').map((n) => key(`Digit${n}`, n)),
    key('Minus', '−'),
    key('Equal', '='),
    key('Backspace', 'back', 2),
    key('Home', 'home'),
  ],
  [
    key('Tab', 'tab', 1.5),
    ...'QWERTYUIOP'.split('').map((n) => key(`Key${n}`, n)),
    key('BracketLeft', '['),
    key('BracketRight', ']'),
    key('Backslash', '\\', 1.5),
    key('PageUp', 'pg up'),
  ],
  [
    key('CapsLock', 'caps', 1.75),
    ...'ASDFGHJKL'.split('').map((n) => key(`Key${n}`, n)),
    key('Semicolon', ';'),
    key('Quote', "'"),
    key('Enter', 'enter', 2.25),
    key('PageDown', 'pg dn'),
  ],
  [
    key('ShiftLeft', 'shift', 2.25),
    ...'ZXCVBNM'.split('').map((n) => key(`Key${n}`, n)),
    key('Comma', ','),
    key('Period', '.'),
    key('Slash', '/'),
    key('ShiftRight', 'shift', 1.75),
    key('ArrowUp', '↑'),
    key('End', 'end'),
  ],
  [
    key('ControlLeft', 'ctrl', 1.25),
    key('MetaLeft', 'win', 1.25),
    key('AltLeft', 'alt', 1.25),
    key('Space', 'ØNYX', 6.25),
    key('AltRight', 'alt'),
    key('ControlRight', 'ctrl'),
    key('ArrowLeft', '←'),
    key('ArrowDown', '↓'),
    key('ArrowRight', '→'),
  ],
]
const isEditable = (target: EventTarget | null) =>
  target instanceof Element &&
  !!target.closest(
    'input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
  )

export default function VirtualKeyboard({
  play,
  compact = false,
  active = true,
  label = 'Virtual keyboard',
}: {
  play: () => void
  compact?: boolean
  active?: boolean
  label?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const playback = useRef(play)
  useEffect(() => {
    playback.current = play
  }, [play])
  useEffect(() => {
    if (!active) return
    const pressed = new Set<string>()
    const find = (code: string) =>
      root.current?.querySelector<HTMLButtonElement>(`[data-code="${code}"]`)
    const down = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.isComposing ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (isEditable(event.target) &&
          !(event.target instanceof Element && event.target.closest('.sound-key')))
      )
        return
      const button = find(event.code)
      if (!button || pressed.has(event.code)) return
      if (
        event.target instanceof Element &&
        event.target.closest('.sound-key') &&
        ['Enter', 'Space'].includes(event.code)
      )
        return
      // Preserve browser navigation and OS shortcuts; those keys remain clickable.
      if (
        [
          'Tab',
          'Escape',
          'MetaLeft',
          'ControlLeft',
          'ControlRight',
          'AltLeft',
          'AltRight',
        ].includes(event.code) ||
        /^F\d+$/.test(event.code)
      )
        return
      event.preventDefault()
      pressed.add(event.code)
      button.dataset.pressed = 'true'
      playback.current()
    }
    const up = (event: KeyboardEvent) => {
      pressed.delete(event.code)
      find(event.code)?.removeAttribute('data-pressed')
    }
    const reset = () => {
      pressed.clear()
      root.current
        ?.querySelectorAll('[data-pressed]')
        .forEach((button) => button.removeAttribute('data-pressed'))
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', reset)
      reset()
    }
  }, [active])
  const rows = compact
    ? [
        keyboardRows[2].slice(1, 11),
        keyboardRows[3].slice(1, 10),
        [key('Space', 'space', 6)],
      ]
    : keyboardRows
  return (
    <div
      ref={root}
      className={`sound-keyboard ${compact ? 'compact' : ''}`}
      role="group"
      aria-label={label}
    >
      {rows.map((row, i) => (
        <div className={`sound-key-row row-${i}`} key={i}>
          {row.map(({ code, label: legend, width }) => (
            <button
              key={code}
              type="button"
              className={`sound-key ${code === 'Escape' || code === 'Enter' ? 'accent-key' : ''}`}
              data-code={code}
              style={{ flex: width }}
              aria-label={`${label}: ${legend}`}
              onPointerDown={(event) => {
                if (event.button !== 0) return
                event.currentTarget.setPointerCapture(event.pointerId)
                event.currentTarget.dataset.pressed = 'true'
                play()
              }}
              onPointerUp={(event) => event.currentTarget.removeAttribute('data-pressed')}
              onPointerCancel={(event) =>
                event.currentTarget.removeAttribute('data-pressed')
              }
              onKeyDown={(event) => {
                if (event.repeat && ['Enter', 'Space'].includes(event.code))
                  event.preventDefault()
              }}
              onClick={(event) => {
                if (event.detail === 0) play()
              }}
            >
              {legend}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
