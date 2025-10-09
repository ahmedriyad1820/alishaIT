import { useState } from 'react'
import { getContent, saveContent, defaultContent, defaultProducts } from '../content'

export default function Admin() {
  const [data, setData] = useState(getContent())
  const [saved, setSaved] = useState(false)

  function updateHero(e) {
    const { name, value } = e.target
    setData({ ...data, hero: { ...data.hero, [name]: value } })
  }

  function updateService(idx, key, value) {
    const next = data.services.map((s, i) => i === idx ? { ...s, [key]: value } : s)
    setData({ ...data, services: next })
  }

  function addService() {
    setData({ ...data, services: [...data.services, { title: 'New Service', desc: 'Description' }] })
  }

  function removeService(idx) {
    setData({ ...data, services: data.services.filter((_, i) => i !== idx) })
  }

  function resetAll() {
    setData(defaultContent)
  }

  function handleSave(e) {
    e.preventDefault()
    if (saveContent(data)) {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className="h2">Admin Panel</h2>
        <p className="subhead">Edit content shown on the homepage. Changes are saved in your browser.</p>

        <form className="form" onSubmit={handleSave}>
          <h3 className="h3">Hero</h3>
          <input name="headline" value={data.hero.headline} onChange={updateHero} />
          <input name="subhead" value={data.hero.subhead} onChange={updateHero} />

          <h3 className="h3">Hero Background Slider</h3>
          <label>Interval (ms)
            <input type="number" value={data.hero.slider?.intervalMs || 30000}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, slider: { ...data.hero.slider, intervalMs: Number(e.target.value) } } })} />
          </label>
          {(data.hero.slider?.images || []).map((url, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
              <input value={url} onChange={(e) => {
                const images = [...(data.hero.slider?.images || [])]
                images[i] = e.target.value
                setData({ ...data, hero: { ...data.hero, slider: { ...data.hero.slider, images } } })
              }} />
              <button type="button" className="btn btn-outline" onClick={() => {
                const images = (data.hero.slider?.images || []).filter((_, idx) => idx !== i)
                setData({ ...data, hero: { ...data.hero, slider: { ...data.hero.slider, images } } })
              }}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={() => {
            const images = [...(data.hero.slider?.images || []), '']
            setData({ ...data, hero: { ...data.hero, slider: { ...data.hero.slider, images } } })
          }}>Add Image</button>

          <h3 className="h3">Services</h3>
          {data.services.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, alignItems: 'center' }}>
              <input value={s.title} onChange={(e) => updateService(i, 'title', e.target.value)} />
              <input value={s.desc} onChange={(e) => updateService(i, 'desc', e.target.value)} />
              <button type="button" className="btn btn-outline" onClick={() => removeService(i)}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-outline" onClick={addService}>Add Service</button>
            <button type="button" className="btn btn-outline" onClick={resetAll}>Reset</button>
            <button type="submit" className="btn">Save</button>
          </div>
          {saved && <span className="success">Saved</span>}
        </form>

        <div style={{ marginTop: 24 }}>
          <h3 className="h3">Products</h3>
          {(data.products || []).map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
              <input value={p.title} onChange={(e)=>{
                const products = [...(data.products||[])]
                products[i] = { ...products[i], title: e.target.value }
                setData({ ...data, products })
              }} placeholder="Title" />
              <input value={p.features?.join(', ') || ''} onChange={(e)=>{
                const products = [...(data.products||[])]
                products[i] = { ...products[i], features: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) }
                setData({ ...data, products })
              }} placeholder="Features (comma separated)" />
              <input type="number" value={p.price ?? ''} onChange={(e)=>{
                const products = [...(data.products||[])]
                products[i] = { ...products[i], price: Number(e.target.value) }
                setData({ ...data, products })
              }} placeholder="Price" />
              <button type="button" className="btn btn-outline" onClick={()=>{
                const products = (data.products||[]).filter((_,idx)=>idx!==i)
                setData({ ...data, products })
              }}>Remove</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={()=>{
              const products = [...(data.products||[]), defaultProducts[0]]
              setData({ ...data, products })
            }}>Add Product</button>
            <button type="button" className="btn btn-outline" onClick={()=>{
              setData({ ...data, products: defaultProducts })
            }}>Reset Products</button>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <a className="nav-btn" href="#home">← Back to site</a>
        </div>
      </div>
    </section>
  )
}


