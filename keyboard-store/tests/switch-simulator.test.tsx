import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import VirtualKeyboard from '../src/components/VirtualKeyboard'

describe('switch studio', () => {
  it('opens from navigation, changes switches, compares and adjusts audio controls', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Sound studio' }))
    expect(document.title).toContain('Switch Sound Simulator')
    expect(screen.getByRole('heading', { name: 'Cherry MX Red' })).toBeInTheDocument()
    expect(screen.getByText('Placeholder audio library')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Choose your switch'), {
      target: { value: 'box-jade' },
    })
    expect(screen.getByRole('heading', { name: 'Kailh BOX Jade' })).toBeInTheDocument()
    expect(screen.getByText('3.6 mm')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('slider', { name: 'Volume' }), {
      target: { value: '0.3' },
    })
    expect(screen.getByText('30%')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mute audio' }))
    expect(screen.getByRole('button', { name: 'Unmute audio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'A/B comparison' }))
    expect(screen.getByRole('heading', { name: 'Cherry MX Blue' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Listen to B' }))
    expect(screen.getByRole('button', { name: /Listen to B/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.change(screen.getByLabelText('Switch B'), { target: { value: 'boba-u4t' } })
    expect(screen.getByRole('heading', { name: 'Boba U4T' })).toBeInTheDocument()
  })

  it('maps physical keys, suppresses repeats, preserves editable controls and cleans up', () => {
    const play = vi.fn()
    const view = render(
      <>
        <VirtualKeyboard play={play} />
        <input aria-label="Typing field" />
      </>,
    )
    const keyboard = screen.getByRole('group', { name: 'Virtual keyboard' })
    const a = within(keyboard).getByRole('button', { name: 'Virtual keyboard: A' })
    fireEvent.keyDown(window, { code: 'KeyA' })
    expect(a).toHaveAttribute('data-pressed', 'true')
    fireEvent.keyDown(window, { code: 'KeyA', repeat: true })
    expect(play).toHaveBeenCalledTimes(1)
    fireEvent.keyUp(window, { code: 'KeyA' })
    expect(a).not.toHaveAttribute('data-pressed')
    fireEvent.keyDown(screen.getByLabelText('Typing field'), { code: 'KeyA' })
    fireEvent.keyDown(window, { code: 'KeyA', ctrlKey: true })
    fireEvent.keyDown(window, { code: 'Tab' })
    expect(play).toHaveBeenCalledTimes(1)
    fireEvent.click(a)
    expect(play).toHaveBeenCalledTimes(2)
    view.unmount()
    fireEvent.keyDown(window, { code: 'KeyA' })
    expect(play).toHaveBeenCalledTimes(2)
  })
})
