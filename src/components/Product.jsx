import { useEffect, useMemo, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { getContent } from '../content'

export default function Product() {
  const ref = useReveal()
  // tabs removed per user request
  const content = getContent()
  const products = useMemo(() => content.products && content.products.length ? content.products : [{ title: 'AURA CONNECT X1', features: ['Ultra-High Bandwidth','Global Mesh Network','AI Optimization'], price: 1499 }], [content])
  const [detailIdx, setDetailIdx] = useState(() => {
    const hash = window.location.hash
    const m = hash.match(/^#product\/(\d+)/)
    return m ? Number(m[1]) : null
  })
  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/^#product\/(\d+)/)
      setDetailIdx(m ? Number(m[1]) : null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const activeIdx = (Number.isInteger(detailIdx) && detailIdx >= 0 && detailIdx < products.length) ? detailIdx : null
  return (
    <section id="product" ref={ref} className="section reveal">
      <div className="container">
        {activeIdx === null ? (
        <>
          <h2 className="h2">Our Products</h2>
          <div className="products-grid">
            {products.map((p, i) => (
              <article key={i} className="product-card" onClick={() => { window.location.hash = `#product/${i}` }}>
                <div className="product-card-art" />
                <h3 className="h3">{p.title}</h3>
                <p className="muted">Starting at ${p.price}</p>
                <ul className="feature-list small">
                  {(p.features||[]).slice(0,3).map((f)=> <li key={f}>{f}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </>
        ) : (
        <div className="product-hero">
          <div className="product-copy">
            <h2 className="h2">{products[activeIdx].title} — The Future of Connectivity</h2>
            <ul className="feature-list">
              {(products[activeIdx].features||[]).map((f)=> <li key={f}>{f}</li>)}
            </ul>
            <div className="price-row">
              <span>Starting at ${products[activeIdx].price}</span>
              <a href="#contact" className="btn">Buy Now</a>
            </div>
          </div>
          <div className="product-art" aria-hidden />
          <div style={{ marginTop: 12 }}>
            <a className="nav-btn" href="#product">← Back to products</a>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}


