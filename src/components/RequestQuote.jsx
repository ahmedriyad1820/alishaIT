import { useState } from 'react'

export default function RequestQuote() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    service: '', 
    message: '' 
  })
  const [sent, setSent] = useState(false)

  const services = [
    'Select A Service',
    'Web Development',
    'Mobile App Development',
    'SEO Optimization',
    'Digital Marketing',
    'IT Consulting'
  ]

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className="request-quote">
      <div className="container">
        <div className="quote-content">
          <div className="quote-info">
            <span className="quote-subtitle">REQUEST A QUOTE</span>
            <h2 className="quote-title">Need A Free Quote? Please Feel Free to Contact Us</h2>
            <div className="quote-underline">
              <div className="underline-line"></div>
              <div className="underline-line short"></div>
            </div>

            <div className="quote-features">
              <div className="feature-item">
                <div className="feature-icon">↶</div>
                <span>Reply within 24 hours</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📞</div>
                <span>24 hrs telephone support</span>
              </div>
            </div>

            <p className="quote-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <div className="quote-contact">
              <button className="phone-btn">
                <div className="phone-icon">📞</div>
              </button>
              <div className="contact-text">
                <p>Call to ask any question</p>
                <span className="phone-number">+012 345 6789</span>
              </div>
            </div>
          </div>

          <div className="quote-form-section">
            <form className="quote-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
              >
                {services.map((service, index) => (
                  <option key={index} value={service} disabled={index === 0}>
                    {service}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
              />
              <button className="submit-btn" type="submit">
                Request A Quote
              </button>
              {sent && <p className="success-message">Thanks! We'll be in touch.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
