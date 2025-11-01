import { useEffect, useState } from 'react'
import { useContent } from '../contexts/ContentContext'
import { teamMembersAPI } from '../api/client.js'

export default function About() {
  const { content } = useContent()
  const aboutPage = content.about || {}
  const hero = aboutPage.hero || {}
  const aboutSection = aboutPage.content || {}
  const stats = content.home?.statistics || {}
  const statsItems = stats.items || [
    { icon: '👥', label: 'Happy Clients', number: '12345' },
    { icon: '✓', label: 'Projects Done', number: '12345' },
    { icon: '🏆', label: 'Win Awards', number: '12345' }
  ]
  const [activeTimeline, setActiveTimeline] = useState(0)

  const timelineSection = aboutPage.timeline || {}
  const timelineData = [
    timelineSection.item1 || {
      date: "01 Jun, 2021",
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    timelineSection.item2 || {
      date: "01 Jan, 2021", 
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    },
    timelineSection.item3 || {
      date: "01 Jun, 2020",
      title: "Lorem ipsum dolor", 
      description: "Lorem ipsum dolor sit amet elit ornare velit non"
    }
  ]

  const [teamMembers, setTeamMembers] = useState([])
  const [loadingTeam, setLoadingTeam] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoadingTeam(true)
        const res = await teamMembersAPI.list(true)
        if (res.success) setTeamMembers(res.data)
      } catch (e) {
        console.error('Failed to load team members', e)
      } finally {
        setLoadingTeam(false)
      }
    })()
  }, [])

  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{hero.title || 'About Us'}</h1>
        </div>
      </section>

      {/* About Content Section */}
      <section className="about-content-section">
        <div className="container">
          <div className="about-content-grid">
            <div className="about-text">
              <span className="about-subtitle">{aboutSection.subtitle || 'ABOUT US'}</span>
              <h2 className="about-title">{aboutSection.title || 'The Best IT Solution With 10 Years of Experience'}</h2>
              <div className="about-underline"></div>
              <p className="about-description">{aboutSection.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}</p>
            </div>
            <div className="about-image">
              <div className="company-logo-animated">
                <div className="logo-container">
                  <div className="logo-front">
                    <img src="/logo.png" alt="Company Logo" className="logo-image" />
                  </div>
                  <div className="logo-back">
                    <img src="/logo2.png" alt="Company Logo" className="logo-image" />
                  </div>
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
            {statsItems.map((item, index) => {
              let statClass = 'stat-item'
              if (index === 0) statClass += ' stat-left'
              else if (index === 1) statClass += ' stat-center'
              else if (index === 2) statClass += ' stat-right'
              
              return (
                <div key={index} className={statClass}>
                  <div className="stat-icon">{item.icon || '📊'}</div>
                  <div className="stat-content">
                    <h3>{item.label || 'Statistic'}</h3>
                    <span className="stat-number">{item.number || '0'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="our-story">
        <div className="container">
          <div className="story-header">
            <span className="story-subtitle">{timelineSection.subtitle || 'OUR STORY'}</span>
            <h2 className="story-title">{timelineSection.title || '10 Years of Our Journey to Help Your Business'}</h2>
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

          {loadingTeam ? (
            <div className="team-grid"><div className="team-card">Loading...</div></div>
          ) : (
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member._id} className="team-card">
                  <div className="member-image">
                    <div className="image-placeholder">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="member-photo" />
                      ) : (
                        <div className="member-avatar">👤</div>
                      )}
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
          )}
        </div>
      </section>
    </div>
  )
}
