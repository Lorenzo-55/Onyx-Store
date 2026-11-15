import { usePreferences } from '../context/preferences-context'

export default function Keyboard({ color = 'stone' }: { color?: string }) {
  const { t } = usePreferences()

  const rows = [
    'esc 1 2 3 4 5 6 7 8 9 0 − = back',
    'tab Q W E R T Y U I O P [ ]',
    'caps A S D F G H J K L ; enter',
    'shift Z X C V B N M , . / shift',
    'ctrl win alt space alt fn ← ↓ →',
  ]
  return (
    <div
      className={`keyboard ${color}`}
      role="img"
      aria-label={t('{color} mechanical keyboard illustration', { color: t(color) })}
    >
      <div className="board-label">
        <span>{t('Ø / SERIES 01')}</span>
        <i />
      </div>
      {rows.map((r, i) => (
        <div className="key-row" key={i}>
          {r.split(' ').map((k, j) => (
            <span
              key={j}
              className={`key ${k === 'space' ? 'space' : ''} ${k.length > 2 ? 'wide' : ''} ${k === 'esc' || k === 'enter' ? 'accent' : ''}`}
            >
              {k === 'space' ? '' : k}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
