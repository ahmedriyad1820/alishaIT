export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            <div className="footer-left">
              <div className="footer-logo">
                <div className="logo-icon">👤</div>
                <span className="logo-text">Alisha IT</span>
              </div>
              <p className="footer-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
              <div className="newsletter-signup">
                <input type="email" placeholder="Your Email" className="newsletter-input" />
                <button className="newsletter-btn">Sign Up</button>
              </div>
            </div>

            <div className="footer-right">
              <div className="footer-section">
                <h3 className="footer-heading">Get In Touch</h3>
                <div className="footer-underline"></div>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>123 Street, New York, USA</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <span>info@example.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span>+012 345 6789</span>
                  </div>
                </div>
                <div className="social-links">
                  <a href="#" className="social-link">🐦</a>
                  <a href="#" className="social-link">📘</a>
                  <a href="#" className="social-link">💼</a>
                  <a href="#" className="social-link">📷</a>
                </div>
              </div>

              <div className="footer-section">
                <h3 className="footer-heading">Quick Links</h3>
                <div className="footer-underline"></div>
                <ul className="footer-links">
                  <li><a href="#home">→ Home</a></li>
                  <li><a href="#about">→ About Us</a></li>
                  <li><a href="#services">→ Our Services</a></li>
                  <li><a href="#team">→ Meet The Team</a></li>
                  <li><a href="#blog">→ Latest Blog</a></li>
                  <li><a href="#contact">→ Contact Us</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3 className="footer-heading">Popular Links</h3>
                <div className="footer-underline"></div>
                <ul className="footer-links">
                  <li><a href="#home">→ Home</a></li>
                  <li><a href="#about">→ About Us</a></li>
                  <li><a href="#services">→ Our Services</a></li>
                  <li><a href="#team">→ Meet The Team</a></li>
                  <li><a href="#blog">→ Latest Blog</a></li>
                  <li><a href="#contact">→ Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; Alisha IT. All Rights Reserved. Designed by HTML Codex</p>
            <button className="scroll-top-btn" onClick={scrollToTop}>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}


