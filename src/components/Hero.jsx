import { useEffect, useMemo, useRef, useState } from 'react'
import { useContent } from '../contexts/ContentContext'
import { slidersAPI, sliderConfigAPI } from '../api/client'

export default function Hero({ onNavigate }) {
  const { content } = useContent()
  const heroContent = content.home?.hero || {}

  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [intervalMs, setIntervalMs] = useState(30000)
  const timerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [s, cfg] = await Promise.all([
        slidersAPI.list(true),
        sliderConfigAPI.get()
      ])
      if (!mounted) return
      if (s?.success) setSlides(Array.isArray(s.data) ? s.data : [])
      if (cfg?.success && cfg.data?.intervalMs) setIntervalMs(cfg.data.intervalMs)
    }
    load()
    return () => { mounted = false }
  }, [])

  const next = useMemo(() => () => setCurrent(c => (slides.length ? (c + 1) % slides.length : 0)), [slides.length])
  const prev = useMemo(() => () => setCurrent(c => (slides.length ? (c - 1 + slides.length) % slides.length : 0)), [slides.length])

  useEffect(() => {
    if (!slides.length) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, Math.max(3000, Number(intervalMs) || 30000))
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [slides, intervalMs])

  return (
    <section id="home" className="hero">
      <div className="hero-background" style={slides.length ? {
        backgroundImage: `url(${slides[current]?.image?.startsWith('/') ? 'http://localhost:3001' + slides[current].image : slides[current]?.image})`
      } : undefined}>
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="company-name">
            {heroContent.companyName || 'ALISHA IT SOLUTION\'S'}
          </div>
          <h1 className="hero-title">
            {heroContent.title ? heroContent.title.replace('\\n', '\n') : 'Creative & Innovative\nDigital Solution'}
          </h1>
          <div className="hero-buttons">
            <button 
              className="btn-primary" 
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  const element = document.querySelector('.request-quote');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              {heroContent.primaryButton || 'Free Quote'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => onNavigate('contact')}
            >
              {heroContent.secondaryButton || 'Contact Us'}
            </button>
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-navigation">
          <button className="nav-arrow nav-arrow-left" onClick={prev}>‹</button>
          <button className="nav-arrow nav-arrow-right" onClick={next}>›</button>
        </div>
      )}
    </section>
  )
}


