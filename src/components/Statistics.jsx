export default function Statistics() {
  return (
    <section className="statistics">
      <div className="container">
        <div className="stats-blocks">
          <div className="stat-block stat-block-blue">
            <div className="stat-icon">👥</div>
            <div className="stat-label">Happy Clients</div>
            <div className="stat-number">12345</div>
          </div>
          
          <div className="stat-block stat-block-white">
            <div className="stat-icon stat-icon-blue">✓</div>
            <div className="stat-label">Projects Done</div>
            <div className="stat-number">12345</div>
          </div>
          
          <div className="stat-block stat-block-blue">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Win Awards</div>
            <div className="stat-number">12345</div>
          </div>
        </div>
      </div>
      
      <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </section>
  )
}
