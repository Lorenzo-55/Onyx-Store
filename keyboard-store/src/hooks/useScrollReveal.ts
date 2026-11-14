import { useEffect, type RefObject } from 'react'

// Progressive enhancement: content stays visible without observer support.
export function useScrollReveal(root: RefObject<HTMLElement | null>, route: string) {
 useEffect(() => {
  const element = root.current
  if (!element || typeof IntersectionObserver === 'undefined') return
  const preference = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
  let observer: IntersectionObserver | undefined
  const sections = [...element.querySelectorAll<HTMLElement>('.section, .philosophy')]
  const reset = () => {
   observer?.disconnect()
   sections.forEach(section => section.removeAttribute('data-scroll-reveal'))
  }
  const prepare = () => {
   reset()
   if (preference?.matches) return
   observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      entry.target.setAttribute('data-scroll-reveal', 'visible')
      observer?.unobserve(entry.target)
     }
    })
   }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' })
   sections.forEach(section => {
    if (section.getBoundingClientRect().top >= window.innerHeight) {
     section.setAttribute('data-scroll-reveal', 'pending')
     observer!.observe(section)
    }
   })
  }
  prepare()
  preference?.addEventListener?.('change', prepare)
  return () => {
   reset()
   preference?.removeEventListener?.('change', prepare)
  }
 }, [root, route])
}
