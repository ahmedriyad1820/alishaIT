import { useState, useEffect } from 'react'
import { useContent } from '../contexts/ContentContext'
import { testimonialsAPI } from '../api/client.js'

export default function Testimonials() {
  const { content } = useContent()
  const testimonialsData = content.home?.testimonials || {}
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const res = await testimonialsAPI.list(true) // Only active testimonials
      if (res.success) {
        setTestimonials(res.data || [])
      }
    } catch (error) {
      console.error('Failed to load testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-advance slider
  useEffect(() => {
    if (testimonials.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Show 3 testimonials at a time (or all if less than 3)
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return []
    if (testimonials.length <= 3) return testimonials
    
    // Show 3 testimonials starting from currentIndex
    const visible = []
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % testimonials.length
      visible.push(testimonials[idx])
    }
    return visible
  }

  const nextSlide = () => {
    if (testimonials.length <= 3) return
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    if (testimonials.length <= 3) return
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const visibleTestimonials = getVisibleTestimonials()
  const showNavigation = testimonials.length > 3

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <span className="testimonials-subtitle">{testimonialsData.subtitle || 'TESTIMONIAL'}</span>
          <h2 className="testimonials-title">{testimonialsData.title || 'What Our Clients Say About Our Digital Services'}</h2>
          <div className="testimonials-underline"></div>
        </div>
        
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>Loading testimonials...</div>
        ) : visibleTestimonials.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>No testimonials available.</div>
        ) : (
          <>
            <div className="testimonials-slider-container">
              {showNavigation && (
                <button className="testimonial-nav-btn testimonial-nav-prev" onClick={prevSlide}>
                  ‹
                </button>
              )}
              
              <div className="testimonials-grid">
                {visibleTestimonials.map((testimonial, index) => (
                  <div key={testimonial._id || index} className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="client-avatar">
                        {testimonial.avatarImage ? (
                          <img 
                            src={`http://localhost:3001${testimonial.avatarImage}`} 
                            alt={testimonial.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '2rem' }}>{testimonial.avatar || '👤'}</span>
                        )}
                      </div>
                      <div className="client-info">
                        <h3 className="client-name">{testimonial.name}</h3>
                        <p className="client-profession">{testimonial.profession}</p>
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <p className="testimonial-quote">"{testimonial.quote}"</p>
                      {testimonial.rating && (
                        <div className="testimonial-rating">
                          {Array(testimonial.rating).fill(0).map((_, i) => (
                            <span key={i} style={{ color: '#FFD700' }}>⭐</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showNavigation && (
                <button className="testimonial-nav-btn testimonial-nav-next" onClick={nextSlide}>
                  ›
                </button>
              )}
            </div>

            {/* Slider indicators */}
            {showNavigation && testimonials.length > 3 && (
              <div className="testimonial-indicators">
                {Array(Math.ceil(testimonials.length / 3)).fill(0).map((_, i) => (
                  <button
                    key={i}
                    className={`testimonial-indicator ${Math.floor(currentIndex / 3) === i ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(i * 3)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}