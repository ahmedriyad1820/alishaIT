import { useState } from 'react'

export default function Navbar({ onNavigate, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (page) => {
    onNavigate(page)
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <button onClick={() => handleNavClick('home')}>
            <img 
              src="/logo2.png" 
              alt="Alisha IT Solutions" 
              className="company-logo"
            />
          </button>
        </div>

            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <button 
                onClick={() => handleNavClick('home')} 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('about')} 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('services')} 
                className={`nav-link ${currentPage === 'services' ? 'active' : ''}`}
              >
                Services
              </button>
              <button 
                onClick={() => handleNavClick('project')} 
                className={`nav-link ${currentPage === 'project' ? 'active' : ''}`}
              >
                Project
              </button>
              <button 
                onClick={() => handleNavClick('blog')} 
                className={`nav-link ${currentPage === 'blog' ? 'active' : ''}`}
              >
                Blog
              </button>
              <button 
                onClick={() => handleNavClick('product')} 
                className={`nav-link ${currentPage === 'product' ? 'active' : ''}`}
              >
                Product
              </button>
              <button 
                onClick={() => handleNavClick('contact')} 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              >
                Contact
              </button>
            </div>


        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}


