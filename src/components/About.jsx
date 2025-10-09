import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useReveal()
  return (
    <section id="about" ref={ref} className="section reveal">
      <div className="container about">
        <div className="about-copy">
          <h2 className="h2">About Us</h2>
          <p>
            We are a team of engineers, product thinkers and designers helping startups and enterprises
            ship resilient software. From discovery to delivery, we own outcomes.
          </p>
        </div>
        <ul className="stats">
          <li><span className="num">7+</span><span>Years Experience</span></li>
          <li><span className="num">50+</span><span>Projects</span></li>
          <li><span className="num">15</span><span>Experts</span></li>
        </ul>
      </div>
    </section>
  )
}


