import { useState } from 'react'

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false)

  const testimonials = [
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👨‍💼"
    },
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👨‍💼"
    },
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👩‍💼"
    },
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👩‍💼"
    },
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👨‍💼"
    },
    {
      name: "Client Name",
      profession: "PROFESSION",
      quote: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
      avatar: "👩‍💼"
    }
  ]

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3)

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <span className="testimonials-subtitle">TESTIMONIAL</span>
          <h2 className="testimonials-title">What Our Clients Say About Our Digital Services</h2>
          <div className="testimonials-underline"></div>
        </div>
        
        <div className="testimonials-grid">
          {displayedTestimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-avatar">{testimonial.avatar}</div>
                <div className="client-info">
                  <h3 className="client-name">{testimonial.name}</h3>
                  <p className="client-profession">{testimonial.profession}</p>
                </div>
              </div>
              <div className="testimonial-content">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonials-actions">
          {!showAll ? (
            <button 
              className="see-all-btn"
              onClick={() => setShowAll(true)}
            >
              See All Testimonials
            </button>
          ) : (
            <button 
              className="minimize-btn"
              onClick={() => setShowAll(false)}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </section>
  )
}