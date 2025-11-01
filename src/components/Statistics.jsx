import { useContent } from '../contexts/ContentContext'

export default function Statistics() {
  const { content } = useContent()
  const stats = content.home?.statistics || {}
  
  const statsItems = stats.items || [
    { icon: '👥', label: 'Happy Clients', number: '12345' },
    { icon: '✓', label: 'Projects Done', number: '12345' },
    { icon: '🏆', label: 'Win Awards', number: '12345' }
  ]

  return (
    <section className="statistics">
      <div className="container">
        <div className="stats-blocks">
          {statsItems.map((item, index) => (
            <div 
              key={index} 
              className={`stat-block ${index % 2 === 0 ? 'stat-block-blue' : 'stat-block-white'}`}
            >
              <div className={`stat-icon ${index % 2 === 1 ? 'stat-icon-blue' : ''}`}>
                {item.icon || '📊'}
              </div>
              <div className="stat-label">{item.label || 'Statistic'}</div>
              <div className="stat-number">{item.number || '0'}</div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </section>
  )
}
