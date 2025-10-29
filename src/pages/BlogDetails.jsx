import { useEffect, useState } from 'react'
import { blogAPI } from '../api/client.js'

export default function BlogDetails() {
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('slug')
    if (!slug) {
      setError('No blog selected')
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const res = await blogAPI.getBySlug(slug)
        if (res.success) {
          setBlog(res.data)
        } else {
          setError(res.error || 'Failed to load blog')
        }
      } catch (e) {
        setError('Network error')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="blog-details-page">
        <section className="blog-hero"><div className="hero-overlay"></div><div className="hero-content"><h1 className="hero-title">Loading...</h1></div></section>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="blog-details-page">
        <section className="blog-hero"><div className="hero-overlay"></div><div className="hero-content"><h1 className="hero-title">Blog not found</h1></div></section>
      </div>
    )
  }

  return (
    <div className="blog-details-page">
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{blog.title}</h1>
          <div style={{ marginTop: 8 }}>{blog.author || 'Admin'} • {formatDate(blog.publishedAt || blog.createdAt)} • {blog.category || ''}</div>
        </div>
      </section>

      <section className="blog-details-content">
        <div className="container">
          <div className="blog-layout">
            <div className="main-content">
              <div 
                className="blog-image"
                style={{
                  width: '100%',
                  borderRadius: 12,
                  background: '#0b1220',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  maxHeight: '70vh'
                }}
              >
                {blog.coverImage ? (
                  <img 
                    src={`http://localhost:3001${blog.coverImage}`} 
                    alt={blog.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                  />
                ) : (
                  <div className="image-placeholder"><div className="blog-icon">📝</div><div className="image-background"></div></div>
                )}
              </div>

              <div className="blog-info">
                {blog.excerpt && <p className="blog-description">{blog.excerpt}</p>}
                <p className="blog-description" style={{ whiteSpace: 'pre-line' }}>{blog.content}</p>
              </div>
            </div>

            <div className="sidebar">
              <div className="categories-section">
                <h3 className="sidebar-title">Category</h3>
                <div className="sidebar-underline"></div>
                <ul className="categories-list">
                  <li className="category-item">
                    <span className="category-arrow">→</span>
                    <span className="category-name">{blog.category || 'General'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
