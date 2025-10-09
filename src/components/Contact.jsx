import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const ref = useReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 2500)
  }

  return (
    <section id="contact" ref={ref} className="section reveal">
      <div className="container contact">
        <div>
          <h2 className="h2">Get in touch</h2>
          <p>Tell us about your project. We typically reply within one business day.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          <textarea name="message" rows="5" placeholder="Project details" value={form.message} onChange={handleChange} required />
          <button className="btn" type="submit">Send Message</button>
          {sent && <p className="success">Thanks! We’ll be in touch.</p>}
        </form>
      </div>
    </section>
  )
}


