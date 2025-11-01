import { useState, useEffect } from 'react'
import { quoteAPI, servicesAPI } from '../api/client.js'
import { useContent } from '../contexts/ContentContext'

export default function RequestQuote() {
  const { content } = useContent()
  const quoteContent = content.home?.quote || {}
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phoneNumber: '',
    service: '', 
    message: '' 
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)

  // Fetch active services from database
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true)
        const result = await servicesAPI.list(true) // Only active services
        if (result.success && result.data) {
          // Sort by order, then by creation date
          const sortedServices = [...result.data].sort((a, b) => {
            if (a.order !== b.order) return (a.order || 0) - (b.order || 0)
            return new Date(a.createdAt) - new Date(b.createdAt)
          })
          setServices(sortedServices)
        } else {
          console.error('Failed to load services:', result.error)
          setServices([])
        }
      } catch (err) {
        console.error('Error loading services:', err)
        setServices([])
      } finally {
        setLoadingServices(false)
      }
    }
    loadServices()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Validate service is selected
    if (!form.service || form.service.trim() === '') {
      setError('Please select a service')
      setLoading(false)
      return
    }
    
    try {
      const result = await quoteAPI.create(form)
      
      if (result.success) {
        setSent(true)
        setForm({ name: '', email: '', phoneNumber: '', service: '', message: '' })
        setTimeout(() => setSent(false), 3000)
        console.log('Quote request saved to MongoDB:', result.data)
      } else {
        setError(result.error || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error submitting quote request:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="request-quote">
      <div className="container">
        <div className="quote-content">
            <div className="quote-info">
              <span className="quote-subtitle">
                {quoteContent.subtitle || 'REQUEST A QUOTE'}
              </span>
              <h2 className="quote-title">
                {quoteContent.title || 'Need A Free Quote? Please Feel Free to Contact Us'}
              </h2>
              <div className="quote-underline">
                <div className="underline-line"></div>
                <div className="underline-line short"></div>
              </div>

              <p className="quote-description">
                {quoteContent.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}
              </p>

              <div className="quote-contact">
                <button className="phone-btn">
                  <div className="phone-icon">📞</div>
                </button>
                <div className="contact-text">
                  <p>Call to ask any question</p>
                  <span className="phone-number">
                    {quoteContent.phoneNumber || '+012 345 6789'}
                  </span>
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
              <input
                name="phoneNumber"
                type="tel"
                placeholder="Contact Number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                disabled={loadingServices}
              >
                <option value="" disabled>
                  {loadingServices ? 'Loading services...' : 'Select A Service'}
                </option>
                {services.map((service) => (
                  <option key={service._id} value={service.title}>
                    {service.title}
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
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'SUBMITTING...' : 'Request A Quote'}
              </button>
              {error && <p className="error-message">{error}</p>}
              {sent && <p className="success-message">Thanks! We'll be in touch.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
