export default function Services() {
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
          <span className="services-subtitle">OUR SERVICES</span>
          <h2 className="services-title">Custom IT Solutions for Your Successful Business</h2>
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
          
          <div className="quote-card">
            <h3 className="quote-title">Call Us For Quote</h3>
            <p className="quote-description">Clita ipsum magna kasd rebum at ipsum amet dolor justo dolor est magna stet eirmod</p>
            <div className="quote-phone">+012 345 6789</div>
          </div>
        </div>
      </div>
    </section>
  )
}


