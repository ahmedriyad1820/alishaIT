import { useContent } from '../contexts/ContentContext'
import { useEffect, useState } from 'react'
import { servicesAPI } from '../api/client.js'

export default function Services() {
  const { content } = useContent()
  const servicesSection = content.home?.services || {}
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await servicesAPI.list(true)
        if (res.success) setServices(res.data || [])
      } catch (_) {
        setServices([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="services-header">
          <span className="services-subtitle">{servicesSection.subtitle || 'OUR SERVICES'}</span>
          <h2 className="services-title">{servicesSection.title || 'Custom IT Solutions for Your Successful Business'}</h2>
          <div className="services-underline"></div>
        </div>
        
        <div className="services-grid">
          {loading ? (
            <div className="service-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1.5rem' }}>Loading...</div>
          ) : services.length === 0 ? (
            <div className="service-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1.5rem' }}>No services yet.</div>
          ) : services.map((service, index) => (
            <div key={index} className="service-card">
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
          ))}
        </div>
      </div>
    </section>
  )
}


