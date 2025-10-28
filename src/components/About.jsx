import { useContent } from '../contexts/ContentContext'

export default function About({ onNavigate }) {
  const { content } = useContent()
  const aboutContent = content.home?.about || {}

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <span className="about-subtitle">
              {aboutContent.subtitle || 'ABOUT US'}
            </span>
            <h2 className="about-title">
              {aboutContent.title || 'The Best IT Solution With 10 Years of Experience'}
            </h2>
            <div className="about-underline"></div>
            
            <p className="about-description">
              {aboutContent.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
            </p>
            
            <button 
              className="see-more-btn" 
              onClick={() => onNavigate('about')}
            >
              {aboutContent.readMoreButton || 'Read More'}
            </button>
          </div>
          
          <div className="about-image">
            <div className="image-placeholder">
              {aboutContent.image ? (
                <img src={aboutContent.image} alt="About Us" className="about-img" />
              ) : (
                <div className="professional-image">
                  <div className="person-icon">👨‍💼</div>
                  <div className="office-background"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}