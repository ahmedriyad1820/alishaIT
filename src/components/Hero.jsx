import { useEffect, useMemo, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { getContent } from '../content'

export default function Hero() {
  const ref = useReveal()
  const content = getContent()
  const images = useMemo(() => (content.hero.slider?.images || []).filter(Boolean), [content])
  const intervalMs = content.hero.slider?.intervalMs || 30000
  const [idx, setIdx] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!images.length) return
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [images.length, intervalMs])
  return (
    <section id="home" ref={ref} className="section hero reveal">
      <div className="hero-bg">
        {images.map((src, i) => (
          <div key={i} className={`bg-slide${i === idx ? ' is-active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
      <div className="container hero-grid">
        <div>
          <h1 className="headline">{content.hero.headline}</h1>
          <p className="subhead">{content.hero.subhead}</p>
          <div className="cta">
            <a href="#services" className="btn">Explore Services</a>
            <a href="#contact" className="btn btn-outline">Get a Quote</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="blob" />
          <div className="orbs">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}


