import { useState } from 'react'

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(0)

  const timelineData = [
    {
      year: "Now",
      date: "01 Jun, 2021",
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    {
      year: "2021",
      date: "01 Jan, 2021", 
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    {
      year: "2020",
      date: "01 Jun, 2020",
      title: "Lorem ipsum dolor", 
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    {
      year: "2019",
      date: "01 Jan, 2019",
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    {
      year: "2018",
      date: "01 Jun, 2018",
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    }
  ]

  const teamMembers = [
    {
      name: "Full Name",
      designation: "DESIGNATION",
      avatar: "👨‍💼",
      description: "Professional team member with expertise in technology solutions."
    },
    {
      name: "Full Name", 
      designation: "DESIGNATION",
      avatar: "👩‍💼",
      description: "Experienced professional dedicated to delivering quality results."
    },
    {
      name: "Full Name",
      designation: "DESIGNATION", 
      avatar: "👨‍💼",
      description: "Skilled professional committed to client success and innovation."
    }
  ]

  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
        </div>
      </section>

      {/* About Content Section */}
      <section className="about-content-section">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-text">
              <span className="about-subtitle">ABOUT US</span>
              <h2 className="about-title">The Best IT Solution With 10 Years of Experience</h2>
              <div className="about-underline"></div>
              <p className="about-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <div className="professional-image">
                  <div className="person-icon">👨‍💼</div>
                  <div className="office-background"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item stat-left">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Happy Clients</h3>
                <span className="stat-number">12345</span>
              </div>
            </div>
            <div className="stat-item stat-center">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>Projects Done</h3>
                <span className="stat-number">12345</span>
              </div>
            </div>
            <div className="stat-item stat-right">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>Win Awards</h3>
                <span className="stat-number">12345</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="our-story">
        <div className="container">
          <div className="story-header">
            <span className="story-subtitle">OUR STORY</span>
            <h2 className="story-title">10 Years of Our Journey to Help Your Business</h2>
            <div className="story-underline"></div>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>
            {timelineData.map((item, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
                <div className="timeline-marker">
                  <div className="timeline-diamond"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-card">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="about-team">
        <div className="container">
          <div className="team-header">
            <span className="team-subtitle">TEAM MEMBERS</span>
            <h2 className="team-title">Professional Stuffs Ready to Help Your Business</h2>
            <div className="team-underline">
              <div className="underline-line"></div>
              <div className="underline-line short"></div>
            </div>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <div className="image-placeholder">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="image-background"></div>
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-designation">{member.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
