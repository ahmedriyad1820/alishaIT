import { useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const items = [
  { quote: 'They delivered on time with exceptional quality.', author: 'A. Khan, CTO' },
  { quote: 'Our KPIs improved across the board.', author: 'S. Roy, Product Lead' },
  { quote: 'Reliable partner for long-term roadmap.', author: 'M. Das, Founder' },
]

export default function Testimonials() {
  const ref = useReveal()
  const scroller = useRef(null)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf
    let x = 0
    const run = () => {
      x -= 0.3
      el.style.transform = `translateX(${x}px)`
      if (Math.abs(x) > el.scrollWidth / 3) x = 0
      raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="testimonials" ref={ref} className="section reveal">
      <div className="container">
        <h2 className="h2">What clients say</h2>
      </div>
      <div className="ticker">
        <div className="track" ref={scroller}>
          {[...items, ...items, ...items].map((t, i) => (
            <blockquote key={i} className="quote">
              <p>“{t.quote}”</p>
              <cite>— {t.author}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}


