import { useEffect, useState } from 'react'
import { teamMembersAPI } from '../api/client.js'

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await teamMembersAPI.list(true)
        if (res.success) setTeamMembers(res.data)
      } catch (e) {
        console.error('Failed to load team members', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="team-members">
      <div className="container">
        <div className="team-header">
          <span className="team-subtitle">TEAM MEMBERS</span>
          <h2 className="team-title">Professional Stuffs Ready to Help Your Business</h2>
          <div className="team-underline"></div>
        </div>

        {loading ? (
          <div className="team-grid"><div className="team-card">Loading...</div></div>
        ) : (
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member._id} className="team-card">
                <div className="member-image">
                  <div className="image-placeholder">
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="member-photo"
                        style={{
                          objectPosition: member.photoAdjustment 
                            ? `${50 + (member.photoAdjustment.x || 0)}% ${50 + (member.photoAdjustment.y || 0)}%`
                            : 'center center',
                          transform: member.photoAdjustment 
                            ? `scale(${(member.photoAdjustment.scale || 100) / 100})`
                            : 'none'
                        }}
                      />
                    ) : (
                      <div className="member-avatar">👤</div>
                    )}
                    <div className="image-background"></div>
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-designation">{member.designation}</p>
                  {member.bio && <p className="member-description">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
