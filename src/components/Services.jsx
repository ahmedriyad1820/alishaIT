import { useContent } from '../contexts/ContentContext'

export default function Services() {
  const { content } = useContent()
  const servicesSection = content.home?.services || {}
  const services = [
    {
      title: "Cyber Security",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "🛡️"
    },
    {
      title: "Data Analytics",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "📊"
    },
    {
      title: "Web Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "</>"
    },
    {
      title: "Apps Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "🤖"
    },
    {
      title: "SEO Optimization",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: "🔍"
    }
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="services-header">
          <span className="services-subtitle">{servicesSection.subtitle || 'OUR SERVICES'}</span>
          <h2 className="services-title">{servicesSection.title || 'Custom IT Solutions for Your Successful Business'}</h2>
          <div className="services-underline"></div>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
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
  )
}


