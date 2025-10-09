import { useMemo, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { getContent } from '../content'

export default function Product() {
  const ref = useReveal()
  const [tab, setTab] = useState('specs')
  const content = getContent()
  const products = useMemo(() => content.products && content.products.length ? content.products : [{ title: 'AURA CONNECT X1', features: ['Ultra-High Bandwidth','Global Mesh Network','AI Optimization'], price: 1499 }], [content])
  return (
    <section id="product" ref={ref} className="section reveal">
      <div className="container">
        <div className="product-hero">
          <div className="product-copy">
            <h2 className="h2">{products[0].title} — The Future of Connectivity</h2>
            <ul className="feature-list">
              {(products[0].features||[]).map((f)=> <li key={f}>{f}</li>)}
            </ul>
            <div className="price-row">
              <span>Starting at ${products[0].price}</span>
              <a href="#contact" className="btn">Buy Now</a>
            </div>
          </div>
          <div className="product-art" aria-hidden />
        </div>

        <div className="tabs">
          <button className={`tab${tab==='specs'?' is-active':''}`} onClick={()=>setTab('specs')}>Technical Specifications</button>
          <button className={`tab${tab==='reviews'?' is-active':''}`} onClick={()=>setTab('reviews')}>Customer Reviews</button>
          <button className={`tab${tab==='compare'?' is-active':''}`} onClick={()=>setTab('compare')}>Compare Models</button>
        </div>

        {tab==='specs' && (
          <div className="grid glow-cards">
            <article className="glow-card cyan">
              <h3 className="h3">AI Powered Insights</h3>
              <p>Adaptive routing based on predictive analytics.</p>
            </article>
            <article className="glow-card blue">
              <h3 className="h3">Global Network</h3>
              <p>Always-on multi-region coverage with redundancy.</p>
            </article>
            <article className="glow-card purple">
              <h3 className="h3">Secure & Reliable</h3>
              <p>End-to-end encryption and failover protection.</p>
            </article>
          </div>
        )}
        {tab==='reviews' && (
          <div className="grid glow-cards">
            <article className="glow-card">
              <p>“Changed how we operate. Rock-solid.” — A. Khan</p>
            </article>
            <article className="glow-card">
              <p>“Bandwidth doubled, latency down 40%.” — S. Roy</p>
            </article>
          </div>
        )}
        {tab==='compare' && (
          <div className="grid glow-cards">
            <article className="glow-card">
              <h3 className="h3">X1</h3>
              <p>Base model with excellent performance.</p>
            </article>
            <article className="glow-card">
              <h3 className="h3">X1 Pro</h3>
              <p>Upgraded CPU, AI accelerator, dual WAN.</p>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}


