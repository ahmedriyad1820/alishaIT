export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <span className="about-subtitle">ABOUT US</span>
            <h2 className="about-title">The Best IT Solution With 10 Years of Experience</h2>
            <div className="about-underline"></div>
            
            <p className="about-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Award Winning</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Professional Staff</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>24/7 Support</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Fair Prices</span>
              </div>
            </div>
            
            <div className="contact-info">
              <div className="phone-section">
                <div className="phone-icon">📞</div>
                <div className="phone-text">
                  <p>Call to ask any question</p>
                  <span className="phone-number">+012 345 6789</span>
                </div>
              </div>
              <button className="quote-btn">Request A Quote</button>
            </div>
          </div>
          
          <div className="about-image">
            <div className="image-placeholder">
              <div className="professional-image">
                <div className="person-icon">👨‍💼</div>
                <div className="office-background"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}