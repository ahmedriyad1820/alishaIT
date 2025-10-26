export default function LatestBlog({ onNavigate }) {
  const blogPosts = [
    {
      id: 1,
      image: "👥",
      category: "Web Design",
      author: "John Doe",
      date: "01 Jan, 2045",
      title: "How to build a website",
      description: "Dolor et eos labore stet justo sed est sed sed sed dolor stet amet",
      readMore: "READ MORE →"
    },
    {
      id: 2,
      image: "👥",
      category: "Web Design", 
      author: "John Doe",
      date: "01 Jan, 2045",
      title: "How to build a website",
      description: "Dolor et eos labore stet justo sed est sed sed sed dolor stet amet",
      readMore: "READ MORE →"
    },
    {
      id: 3,
      image: "👥",
      category: "Web Design",
      author: "John Doe", 
      date: "01 Jan, 2045",
      title: "How to build a website",
      description: "Dolor et eos labore stet justo sed est sed sed sed dolor stet amet",
      readMore: "READ MORE →"
    }
  ]

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
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <div className="image-placeholder">
                  <div className="blog-icon">{post.image}</div>
                  <div className="image-background"></div>
                </div>
                <div className="category-tag">{post.category}</div>
              </div>
              
              <div className="blog-content">
                <div className="blog-meta">
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span className="meta-text">{post.author}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">{post.date}</span>
                  </div>
                </div>
                
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-description">{post.description}</p>
                
                <button 
                  className="read-more-link" 
                  onClick={() => onNavigate('blog-details')}
                >
                  {post.readMore}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
