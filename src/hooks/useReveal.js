import { useEffect, useRef } from 'react'

export function useReveal(options = {}) {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return elementRef
}


