import { useContent } from '../contexts/ContentContext'

export default function WhyChooseUs() {
  const { content } = useContent()
  const why = content.home?.whyChooseUs || {}
  const features = why.features || [
    { icon: '⚙️', title: 'Best In Industry', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
    { icon: '🏆', title: 'Award Winning', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
    { icon: '👥', title: 'Professional Staff', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
    { icon: '📞', title: '24/7 Support', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' }
  ]
  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">{why.subtitle || 'WHY CHOOSE US'}</span>
          <h2 className="section-title">{why.title || 'We Are Here to Grow Your Business Exponentially'}</h2>
          <div className="section-underline"></div>
        </div>
        
        <div className="why-choose-content">
          <div className="feature-column left-column">
            {features.slice(0,2).map((f, idx) => (
              <div key={idx} className="feature-box">
                <div className="feature-icon"><div>{f.icon}</div></div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
          
          <div className="central-image">
            <img 
              src="/logo2.png" 
              alt="Company Logo"
              style={{ width: '80%', height: '80%', objectFit: 'contain', borderRadius: 16 }}
            />
          </div>
          
          <div className="feature-column right-column">
            {features.slice(2,4).map((f, idx) => (
              <div key={idx} className="feature-box">
                <div className="feature-icon"><div>{f.icon}</div></div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
