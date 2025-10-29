import { useState, useEffect } from 'react'
import { blogAPI } from '../api/client.js'

export default function LatestBlog({ onNavigate }) {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const res = await blogAPI.list(true) // Get only published blogs
      if (res.success) {
        // Limit to 3 most recent published blogs
        const publishedBlogs = (res.data || [])
          .filter(blog => blog.isPublished)
          .slice(0, 3)
        setBlogPosts(publishedBlogs)
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    })
  }

  return (
    <section className="latest-blog">
      <div className="container">
        <div className="blog-header">
          <span className="blog-subtitle">LATEST BLOG</span>
          <h2 className="blog-title">Read The Latest Articles from Our Blog Post</h2>
          <div className="blog-underline">
            <div className="underline-line"></div>
            <div className="underline-line short"></div>
          </div>
        </div>

        <div className="blog-grid">
          {loading ? (
            <div className="loading-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>Loading blogs...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            blogPosts.map((post) => (
              <article key={post._id} className="blog-card">
                <div className="blog-image">
                  {post.coverImage ? (
                    <img 
                      src={`http://localhost:3001${post.coverImage}`} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <div className="blog-icon">📝</div>
                      <div className="image-background"></div>
                    </div>
                  )}
                  {post.category && <div className="category-tag">{post.category}</div>}
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <div className="meta-item">
                      <span className="meta-icon">👤</span>
                      <span className="meta-text">{post.author || 'Admin'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-text">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-description">
                    {post.excerpt || post.content?.substring(0, 100) || 'No description available'}
                    {post.content?.length > 100 && '...'}
                  </p>
                  
                  <button 
                    className="read-more-link" 
                    onClick={() => onNavigate(`blog-details?slug=${post.slug}`)}
                  >
                    READ MORE →
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
