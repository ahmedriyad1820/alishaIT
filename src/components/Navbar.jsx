import { useState, useEffect } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onHashChange = () => setOpen(false)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <header className={`nav${open ? ' nav-open' : ''}`}>
      <div className="container">
        <a href="#home" className="brand brand-row" aria-label="Alisha IT home">
          <img src="/logo.png" alt="Alisha IT logo" className="logo-img" />
        </a>

        <nav className="links">
          <a href="#home" className="nav-btn">Home</a>
          <a href="#about" className="nav-btn">About</a>
          <a href="#services" className="nav-btn">Services</a>
          <a href="#product" className="nav-btn">Product</a>
          <a href="#contact" className="btn">Contact</a>
        </nav>

        <button className={`hamburger${open ? ' is-active' : ''}`} aria-label="Toggle menu" aria-expanded={open}
          onClick={() => setOpen(!open)} type="button">
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="mobile-menu">
        <a href="#home" className="nav-item" onClick={() => setOpen(false)}>Home</a>
        <a href="#about" className="nav-item" onClick={() => setOpen(false)}>About</a>
        <a href="#services" className="nav-item" onClick={() => setOpen(false)}>Services</a>
        <a href="#product" className="nav-item" onClick={() => setOpen(false)}>Product</a>
        <a href="#contact" className="nav-item primary" onClick={() => setOpen(false)}>Contact</a>
      </div>
    </header>
  )
}


