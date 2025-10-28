import { useState, useEffect } from 'react'
import { projectItemsAPI } from '../api/client.js'

export default function Project() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const result = await projectItemsAPI.list()
      if (result.success) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleBackToProjects = () => {
    setShowDetails(false)
    setSelectedProject(null)
  }

  return (
    <div className="project-page">
      {!showDetails ? (
        <>
          {/* Projects Hero Section */}
          <section className="projects-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Our Projects</h1>
            </div>
          </section>

          {/* Projects Content Section */}
          <section className="projects-content-section">
            <div className="container">
              <div className="projects-header">
                <span className="projects-subtitle">OUR PROJECTS</span>
                <h2 className="projects-title">Recent Work & Portfolio</h2>
                <div className="projects-underline">
                  <div className="underline-line"></div>
                  <div className="underline-dot"></div>
                  <div className="underline-line"></div>
                </div>
              </div>

              {loading ? (
                <div className="loading">Loading projects...</div>
              ) : (
                <div className="projects-grid">
                  {projects.map((project, index) => (
                    <div key={project._id || index} className="project-card" onClick={() => handleProjectClick(project)}>
                      <div className="project-icon">
                        <div className="icon-diamond">
                          <span className="icon-symbol">{project.icon}</span>
                        </div>
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      <div className="project-rating">
                        {[...Array(project.rating)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Project Details Hero Section */}
          <section className="project-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Project Details</h1>
            </div>
          </section>

          {/* Project Details Content */}
          <section className="project-details-content">
            <div className="container">
              <div className="project-layout">
                <div className="main-content">
                  <div className="project-image">
                    <div className="image-placeholder">
                      <div className="business-meeting">
                        <div className="person-1">👨‍💼</div>
                        <div className="person-2">👩‍💼</div>
                        <div className="handshake">🤝</div>
                        <div className="table">📋</div>
                        <div className="document">📊</div>
                      </div>
                      <div className="office-background"></div>
                    </div>
                  </div>

                  <div className="project-info">
                    <h2 className="project-title">{selectedProject?.title}</h2>
                    <p className="project-description">
                      {selectedProject?.description}
                    </p>
                    <p className="project-description">
                      Our team of experienced professionals is dedicated to delivering high-quality solutions that meet your specific business requirements. We use the latest technologies and industry best practices to ensure your project's success.
                    </p>
                  </div>
                </div>

                <div className="sidebar">
                  <div className="project-information-box">
                    <h3 className="info-title">Project Information</h3>
                  </div>

                  <div className="project-details-list">
                    <div className="detail-row">
                      <span className="detail-label">Project Name:</span>
                      <span className="detail-value">{selectedProject?.title}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Manager Name:</span>
                      <span className="detail-value">{selectedProject?.manager}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Project URL:</span>
                      <span className="detail-value">{selectedProject?.url}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Complete Date:</span>
                      <span className="detail-value">{selectedProject?.date ? new Date(selectedProject.date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Client Name:</span>
                      <span className="detail-value">{selectedProject?.client}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Project Rating:</span>
                      <div className="rating-stars">
                        {[...Array(selectedProject?.rating || 5)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="smaller-image">
                    <div className="image-placeholder-small">
                      <div className="developer-coding">
                        <div className="person-coding">👨‍💻</div>
                        <div className="laptop-screen">💻</div>
                        <div className="code-lines">📝</div>
                      </div>
                    </div>
                  </div>

                  <div className="project-name-card">
                    <div className="card-header">
                      <span className="folder-icon">📁</span>
                      <h4 className="card-title">Project Name</h4>
                    </div>
                    <div className="card-content">
                      <span className="project-tag">{selectedProject?.title.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Back to Projects Button */}
      {showDetails && (
        <div className="back-to-projects">
          <button className="back-btn" onClick={handleBackToProjects}>
            ← Back to Projects
          </button>
        </div>
      )}
    </div>
  )
}
