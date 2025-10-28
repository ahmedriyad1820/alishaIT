import { useContent } from '../contexts/ContentContext'

export default function WhyChooseUs() {
  const { content } = useContent()
  const why = content.home?.whyChooseUs || {}
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
            <div className="feature-box">
              <div className="feature-icon">
                <div className="icon-gear">⚙️</div>
              </div>
              <h3>Best In Industry</h3>
              <p>Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <div className="icon-award">🏆</div>
              </div>
              <h3>Award Winning</h3>
              <p>Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor</p>
            </div>
          </div>
          
          <div className="central-image">
            <div className="team-image">
              <div className="team-discussion">
                <div className="person-1">👩‍💼</div>
                <div className="person-2">👨‍💼</div>
                <div className="laptop">💻</div>
                <div className="person-3">✋</div>
              </div>
            </div>
          </div>
          
          <div className="feature-column right-column">
            <div className="feature-box">
              <div className="feature-icon">
                <div className="icon-staff">👥</div>
              </div>
              <h3>Professional Staff</h3>
              <p>Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor</p>
            </div>
            
            <div className="feature-box">
              <div className="feature-icon">
                <div className="icon-support">📞</div>
              </div>
              <h3>24/7 Support</h3>
              <p>Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
