import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="contact-page">
      {/* Contact Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">If You Have Any Query, Feel Free To Contact Us</h1>
          <div className="hero-underline"></div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">
                <span className="icon-phone">📞</span>
              </div>
              <div className="method-content">
                <p className="method-text">Call to ask any question</p>
                <span className="method-value">+012 345 6789</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <span className="icon-email">✉️</span>
              </div>
              <div className="method-content">
                <p className="method-text">Email to get free quote</p>
                <span className="method-value">info@example.com</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <span className="icon-location">📍</span>
              </div>
              <div className="method-content">
                <p className="method-text">Visit our office</p>
                <span className="method-value">123 Street, NY, USA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group half">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  SEND
                </button>
                
                {sent && <p className="success-message">Your message has been sent successfully!</p>}
              </form>
            </div>

            <div className="contact-map-container">
              <div className="map-wrapper">
                <div className="map-placeholder">
                  <div className="map-content">
                    <div className="map-location">📍 New York, United States</div>
                    <div className="map-controls">
                      <div className="zoom-controls">
                        <button className="zoom-btn">+</button>
                        <button className="zoom-btn">-</button>
                      </div>
                      <div className="directions-btn">🧭</div>
                    </div>
                    <div className="map-copyright">Map data ©2025 Google Terms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
