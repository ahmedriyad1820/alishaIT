import { useEffect, useState } from 'react'
import { blogAPI } from '../api/client.js'

export default function BlogPage({ onNavigate }) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await blogAPI.list(true)
        if (res.success) setBlogs(res.data || [])
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

  return (
    <div className="blog-list-page">
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Blog</h1>
        </div>
      </section>

      <section className="blog-list-content" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 16, paddingRight: 16 }}>
          <div className="blog-header" style={{ marginBottom: 24 }}>
            <span className="blog-subtitle">LATEST BLOG</span>
            <h2 className="blog-title">Read The Latest Articles from Our Blog Post</h2>
            <div className="blog-underline">
              <div className="underline-line"></div>
              <div className="underline-line short"></div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No posts yet.</div>
          ) : (
            <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
              {blogs.map(post => (
                <article key={post._id} className="blog-card" style={{ cursor: 'pointer', marginBottom: 24 }} onClick={() => onNavigate(`blog-details?slug=${post.slug}`)}>
                  <div className="blog-image" style={{ width: '100%', height: 220, overflow: 'hidden', borderRadius: 12 }}>
                    {post.coverImage ? (
                      <img src={`http://localhost:3001${post.coverImage}`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div className="image-placeholder"><div className="blog-icon">📝</div><div className="image-background"></div></div>
                    )}
                    {post.category && <div className="category-tag">{post.category}</div>}
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <div className="meta-item"><span className="meta-icon">👤</span><span className="meta-text">{post.author || 'Admin'}</span></div>
                      <div className="meta-item"><span className="meta-icon">📅</span><span className="meta-text">{formatDate(post.publishedAt || post.createdAt)}</span></div>
                    </div>
                    <h3 className="blog-post-title">{post.title}</h3>
                    <p className="blog-description">{post.excerpt || post.content?.slice(0, 100)}{post.content?.length > 100 && '...'}</p>
                    <button className="read-more-link">READ MORE →</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


