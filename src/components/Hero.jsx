import { useContent } from '../contexts/ContentContext'

export default function Hero({ onNavigate }) {
  const { content } = useContent()
  const heroContent = content.home?.hero || {}

  return (
    <section id="home" className="hero">
      <div className="hero-background">
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
      <div className="hero-navigation">
        <button className="nav-arrow nav-arrow-left">‹</button>
        <button className="nav-arrow nav-arrow-right">›</button>
      </div>
    </section>
  )
}


