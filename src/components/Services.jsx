import { useReveal } from '../hooks/useReveal'
import { getContent } from '../content'

export default function Services() {
  const ref = useReveal()
  const content = getContent()
  return (
    <section id="services" ref={ref} className="section reveal">
      <div className="container">
        <h2 className="h2">Services</h2>
        <div className="grid cards">
          {content.services.map((s) => (
            <article key={s.title} className="card">
              <h3 className="h3">{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


