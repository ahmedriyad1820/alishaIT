export default function TeamMembers() {
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
    <section className="team-members">
      <div className="container">
        <div className="team-header">
          <span className="team-subtitle">TEAM MEMBERS</span>
          <h2 className="team-title">Professional Stuffs Ready to Help Your Business</h2>
          <div className="team-underline"></div>
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
                <p className="member-description">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
