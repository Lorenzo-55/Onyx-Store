import { useState } from 'react'
import { Volume2, VolumeX, Headphones, ArrowUpRight } from 'lucide-react'
import { switches, type KeyboardSwitch } from '../data/switches'
import { useKeyboardAudio } from '../hooks/useKeyboardAudio'
import VirtualKeyboard from '../components/VirtualKeyboard'
import './SwitchSoundSimulator.css'

function SwitchSelector({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (value: string) => void
  label: string
}) {
  return (
    <label className="sound-selector">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {['Linear', 'Tactile', 'Clicky'].map((category) => (
          <optgroup key={category} label={category}>
            {switches
              .filter((item) => item.category === category)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}
function SwitchDetails({ item }: { item: KeyboardSwitch }) {
  return (
    <div className="sound-details">
      <span className="sound-category">{item.category}</span>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <dl>
        <div>
          <dt>Actuation force</dt>
          <dd>{item.force}</dd>
        </div>
        <div>
          <dt>Total travel</dt>
          <dd>{item.travel}</dd>
        </div>
      </dl>
      <a href={item.source} target="_blank" rel="noreferrer">
        Specification reference <ArrowUpRight size={13} />
      </a>
    </div>
  )
}
export default function SwitchSoundSimulator() {
  const [selected, setSelected] = useState('mx-red')
  const [compare, setCompare] = useState(false)
  const [right, setRight] = useState('mx-blue')
  const [side, setSide] = useState<'A' | 'B'>('A')
  const audio = useKeyboardAudio()
  const item = switches.find((item) => item.id === selected)!
  const other = switches.find((item) => item.id === right)!
  return (
    <section className="section sound-page">
      <div className="sound-heading">
        <p className="eyebrow">THE SWITCH STUDIO / 01</p>
        <h1>
          Find your
          <br />
          <em>kind of click.</em>
        </h1>
        <p>
          Seven switches. A different feeling with every stroke.
          <br />
          Click the keys or type on your keyboard to hear the difference.
        </p>
      </div>
      <div className="sound-toolbar">
        <div className="sound-modes" role="group" aria-label="Simulator mode">
          <button aria-pressed={!compare} onClick={() => setCompare(false)}>
            Explore switches
          </button>
          <button aria-pressed={compare} onClick={() => setCompare(true)}>
            A/B comparison
          </button>
        </div>
        <div className="sound-volume">
          <button
            onClick={audio.toggleMute}
            aria-label={audio.muted ? 'Unmute audio' : 'Mute audio'}
            aria-pressed={audio.muted}
          >
            {audio.muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>
          <label>
            Volume{' '}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audio.volume}
              onChange={(event) => audio.changeVolume(Number(event.target.value))}
            />
          </label>
          <span>{Math.round(audio.volume * 100)}%</span>
        </div>
      </div>
      <div className="sound-audio-status">
        <Headphones size={16} />
        <button onClick={() => void audio.enable()}>Enable audio</button>
        <span role="status">{audio.status}</span>
      </div>
      {!compare ? (
        <>
          <div className="sound-explore">
            <div>
              <SwitchSelector
                label="Choose your switch"
                value={selected}
                onChange={setSelected}
              />
              <SwitchDetails item={item} />
            </div>
            <div className="sound-note">
              <span>LISTEN CLOSELY</span>
              <p>
                Small details.
                <br />A whole different character.
              </p>
              <small>Headphones recommended · US ANSI layout</small>
            </div>
          </div>
          <div className="sound-board-stage">
            <div className="sound-board-label">
              <span>ØNYX / 75</span>
              <span>
                {item.name} · {item.category}
              </span>
              <span className="sound-live">● READY TO TYPE</span>
            </div>
            <VirtualKeyboard play={() => void audio.play(selected)} />
            <p className="sound-board-hint">Make some noise. There’s no wrong key.</p>
          </div>
        </>
      ) : (
        <>
          <p className="sound-compare-hint">
            Choose a side for physical typing, or click either keyboard directly.
          </p>
          <div className="sound-comparison">
            {(
              [
                { slot: 'A', value: selected, set: setSelected, item },
                { slot: 'B', value: right, set: setRight, item: other },
              ] as const
            ).map((panel) => (
              <div
                className={`sound-compare-panel ${side === panel.slot ? 'listening' : ''}`}
                key={panel.slot}
              >
                <button
                  className="sound-side"
                  aria-pressed={side === panel.slot}
                  onClick={() => setSide(panel.slot)}
                >
                  Listen to {panel.slot}{' '}
                  {side === panel.slot && '· Physical keyboard active'}
                </button>
                <SwitchSelector
                  label={`Switch ${panel.slot}`}
                  value={panel.value}
                  onChange={panel.set}
                />
                <SwitchDetails item={panel.item} />
                <VirtualKeyboard
                  compact
                  label={`Keyboard ${panel.slot}`}
                  active={side === panel.slot}
                  play={() => void audio.play(panel.value)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="sound-disclaimer">
        <strong>Placeholder audio library</strong>
        <p>
          These seven distinct, generated demo sounds are not recordings of the named
          switches and do not represent their authentic sound. Switch descriptions refer
          to the hardware, not these placeholder samples.
        </p>
        <p>
          Sound samples are for demonstration purposes. Actual sound may vary depending on
          your keyboard configuration.
        </p>
        <p>
          Case, keycaps, plate, mounting, lubrication and recording setup all shape the
          result. Specifications are nominal and can vary by version. Browser shortcuts
          are preserved; click modifier and function keys to test them.
        </p>
      </div>
    </section>
  )
}
