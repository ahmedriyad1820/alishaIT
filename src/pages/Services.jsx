import { useState } from 'react'

export default function Services({ onNavigate }) {
  const [selectedService, setSelectedService] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const services = [
    {
      title: "Cyber Security",
      description: "Amet justo dolor lorem kasd amet magna sea stet eos vero lorem ipsum dolore sed",
      icon: "🛡️",
      details: "Protect your business with advanced security solutions and threat monitoring systems. Our comprehensive cybersecurity services include network security, data protection, and 24/7 monitoring."
    },
    {
      title: "Data Analytics", 
      description: "Amet justo dolor lorem kasd amet magna sea stet eos vero lorem ipsum dolore sed",
      icon: "📊",
      details: "Transform your data into actionable insights with our comprehensive analytics solutions. We help you make data-driven decisions that drive business growth and efficiency."
    },
    {
      title: "Web Development",
      description: "Amet justo dolor lorem kasd amet magna sea stet eos vero lorem ipsum dolore sed", 
      icon: "</>",
      details: "Create stunning, responsive websites that drive engagement and conversions. Our web development services include custom websites, e-commerce solutions, and web applications."
    },
    {
      title: "Apps Development",
      description: "Amet justo dolor lorem kasd amet magna sea stet eos vero lorem ipsum dolore sed",
      icon: "🤖",
      details: "Build powerful mobile applications for iOS and Android platforms. Our app development services cover everything from concept to deployment and maintenance."
    },
    {
      title: "SEO Optimization",
      description: "Amet justo dolor lorem kasd amet magna sea stet eos vero lorem ipsum dolore sed",
      icon: "🔍",
      details: "Improve your search engine rankings and drive organic traffic to your website. Our SEO services include keyword research, on-page optimization, and content strategy."
    }
  ]

  const allServices = [
    "Cyber Security",
    "Data Analytics", 
    "Keyword Research",
    "Digital Marketing",
    "Web Design",
    "Web Development",
    "SEO Optimization"
  ]

  const handleServiceClick = (service) => {
    setSelectedService(service)
    setShowDetails(true)
  }

  const handleSidebarServiceClick = (serviceName) => {
    const service = services.find(s => s.title === serviceName)
    if (service) {
      setSelectedService(service)
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
              <h1 className="hero-title">Service</h1>
            </div>
          </section>

          {/* Services Content Section */}
          <section className="services-content-section">
            <div className="container">
              <div className="services-header">
                <span className="services-subtitle">OUR SERVICES</span>
                <h2 className="services-title">Custom IT Solutions for Your Successful Business</h2>
                <div className="services-underline">
                  <div className="underline-line"></div>
                  <div className="underline-dot"></div>
                  <div className="underline-line"></div>
                </div>
              </div>

              <div className="services-grid">
                {services.map((service, index) => (
                  <div key={index} className="service-card" onClick={() => handleServiceClick(service)}>
                    <div className="service-icon">
                      <div className="icon-diamond">
                        <span className="icon-symbol">{service.icon}</span>
                      </div>
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                  </div>
                ))}
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
                  <div className="service-image">
                    <div className="image-placeholder">
                      <div className="business-meeting">
                        <div className="person-1">👨‍💼</div>
                        <div className="person-2">👩‍💼</div>
                        <div className="handshake">🤝</div>
                        <div className="table">📋</div>
                      </div>
                      <div className="office-background"></div>
                    </div>
                  </div>

                  <div className="service-info">
                    <h2 className="service-title">{selectedService?.title}</h2>
                    <p className="service-description">
                      {selectedService?.details}
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
