import { useState, useEffect } from 'react'
import { useContent } from '../contexts/ContentContext'
import { servicesAPI } from '../api/client.js'

export default function Services({ onNavigate }) {
  const { content } = useContent()
  const servicesPage = content.services || {}
  const header = servicesPage.header || {}
  const [selectedService, setSelectedService] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await servicesAPI.list(true) // Get only active services
        if (res.success) {
          setServices(res.data || [])
        }
      } catch (_) {
        setServices([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Generate allServices list from fetched services for sidebar
  const allServices = services.map(s => s.title)

  const handleServiceClick = (service) => {
    setSelectedService(service)
    setShowDetails(true)
  }

  const handleSidebarServiceClick = (serviceName) => {
    const service = services.find(s => s.title === serviceName)
    if (service) {
      setSelectedService(service)
      setShowDetails(true)
    }
  }

  const handleBackToServices = () => {
    setShowDetails(false)
    setSelectedService(null)
  }

  return (
    <div className="services-page">
      {!showDetails ? (
        <>
          {/* Services Hero Section */}
          <section className="services-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">{header.heroTitle || 'Service'}</h1>
            </div>
          </section>

          {/* Services Content Section */}
          <section className="services-content-section">
            <div className="container">
              <div className="services-header">
                <span className="services-subtitle">{header.subtitle || 'OUR SERVICES'}</span>
                <h2 className="services-title">{header.title || 'Custom IT Solutions for Your Successful Business'}</h2>
                <div className="services-underline">
                  <div className="underline-line"></div>
                  <div className="underline-dot"></div>
                  <div className="underline-line"></div>
                </div>
              </div>

              <div className="services-grid">
                {loading ? (
                  <div className="service-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                    <p>Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="service-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                    <p>No services available yet.</p>
                  </div>
                ) : (
                  services.map((service) => (
                    <div key={service._id} className="service-card" onClick={() => handleServiceClick(service)}>
                      <div className="service-icon">
                        <div className="icon-diamond">
                          {service.iconImage ? (
                            <img 
                              key={`${service._id}-${service.iconImage}`}
                              src={`http://localhost:3001${service.iconImage}${service.iconImage.includes('?') ? '&' : '?'}v=${service.updatedAt ? new Date(service.updatedAt).getTime() : Date.now()}`} 
                              alt={service.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              onError={(e) => {
                                console.error('Icon image failed to load:', service.iconImage)
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="icon-symbol">{service.icon || '🛠️'}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Additional Services Content */}
          <section className="services-details">
            <div className="container">
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">🛡️</div>
                  <h3>Cyber Security</h3>
                  <p>Protect your business with advanced security solutions and threat monitoring systems.</p>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📊</div>
                  <h3>Data Analytics</h3>
                  <p>Transform your data into actionable insights with our comprehensive analytics solutions.</p>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🌐</div>
                  <h3>Web Development</h3>
                  <p>Create stunning, responsive websites that drive engagement and conversions.</p>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📱</div>
                  <h3>Mobile Apps</h3>
                  <p>Build powerful mobile applications for iOS and Android platforms.</p>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🔍</div>
                  <h3>SEO Services</h3>
                  <p>Improve your search engine rankings and drive organic traffic to your website.</p>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">☁️</div>
                  <h3>Cloud Solutions</h3>
                  <p>Migrate to the cloud with our secure, scalable cloud infrastructure services.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="services-process">
            <div className="container">
              <div className="process-header">
                <span className="process-subtitle">OUR PROCESS</span>
                <h2 className="process-title">How We Deliver Excellence</h2>
                <div className="process-underline"></div>
              </div>

              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">01</div>
                  <h3>Consultation</h3>
                  <p>We analyze your requirements and provide tailored solutions for your business needs.</p>
                </div>
                <div className="process-step">
                  <div className="step-number">02</div>
                  <h3>Planning</h3>
                  <p>Create detailed project plans with timelines and milestones for successful delivery.</p>
                </div>
                <div className="process-step">
                  <div className="step-number">03</div>
                  <h3>Development</h3>
                  <p>Implement solutions using cutting-edge technologies and best practices.</p>
                </div>
                <div className="process-step">
                  <div className="step-number">04</div>
                  <h3>Support</h3>
                  <p>Provide ongoing maintenance and support to ensure optimal performance.</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Service Details Hero Section */}
          <section className="service-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Service Details</h1>
            </div>
          </section>

          {/* Service Details Content */}
          <section className="service-details-content">
            <div className="container">
              <div className="details-layout">
                <div className="main-content">
                  <div 
                    className="service-image"
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      background: '#0b1220',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      maxHeight: '70vh',
                      marginBottom: '2rem'
                    }}
                  >
                    {selectedService?.image ? (
                      <img 
                        src={`http://localhost:3001${selectedService.image}`} 
                        alt={selectedService.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain', 
                          display: 'block',
                          borderRadius: '12px'
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <div className="business-meeting">
                          <div className="person-1">👨‍💼</div>
                          <div className="person-2">👩‍💼</div>
                          <div className="handshake">🤝</div>
                          <div className="table">📋</div>
                        </div>
                        <div className="office-background"></div>
                      </div>
                    )}
                  </div>

                  <div className="service-info">
                    <h2 className="service-title">{selectedService?.title}</h2>
                    <p className="service-description" style={{ whiteSpace: 'pre-line' }}>
                      {selectedService?.description}
                    </p>
                    <p className="service-description">
                      Our team of experienced professionals is dedicated to delivering high-quality solutions that meet your specific business requirements. We use the latest technologies and industry best practices to ensure your project's success.
                    </p>
                    <p className="service-description">
                      Contact us today to discuss your project requirements and get a free consultation. We're here to help you achieve your business goals with our expert services.
                    </p>
                  </div>
                </div>

                <div className="sidebar">
                  <div className="sidebar-section">
                    <h3 className="sidebar-title">Our Services</h3>
                    <div className="sidebar-underline"></div>
                    <ul className="services-list">
                      {allServices.map((service, index) => (
                        <li key={index} className={`service-item ${service === selectedService?.title ? "active" : ""}`} onClick={() => handleSidebarServiceClick(service)}>
                          <span className="service-name">{service}</span>
                          <span className="service-arrow">→</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Back to Services Button */}
      {showDetails && (
        <div className="back-to-services">
          <button className="back-btn" onClick={handleBackToServices}>
            ← Back to Services
          </button>
        </div>
      )}
    </div>
  )
}
