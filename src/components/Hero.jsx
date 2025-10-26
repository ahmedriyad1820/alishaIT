export default function Hero({ onNavigate }) {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="company-name">ALISHA IT SOLUTION'S</div>
          <h1 className="hero-title">
            Creative & Innovative<br />
            Digital Solution
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
              Free Quote
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => onNavigate('contact')}
            >
              Contact Us
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


