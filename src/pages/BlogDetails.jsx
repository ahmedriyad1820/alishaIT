import { useState } from 'react'

export default function BlogDetails() {
  const [searchKeyword, setSearchKeyword] = useState('')

  const categories = [
    "Web Design",
    "Web Development", 
    "Keyword Research",
    "Email Marketing"
  ]

  const recentPosts = [
    {
      image: "👥",
      title: "Lorem ipsum dolor sit amet adipis elit."
    },
    {
      image: "👥",
      title: "Lorem ipsum dolor sit amet adipis elit."
    },
    {
      image: "👥",
      title: "Lorem ipsum dolor sit amet adipis elit."
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchKeyword)
  }

  return (
    <div className="blog-details-page">
      {/* Blog Details Hero Section */}
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Blog Details</h1>
        </div>
      </section>

      {/* Blog Details Content */}
      <section className="blog-details-content">
        <div className="container">
          <div className="blog-layout">
            <div className="main-content">
              <div className="blog-image">
                <div className="image-placeholder">
                  <div className="business-meeting">
                    <div className="person-1">👨‍💼</div>
                    <div className="person-2">👩‍💼</div>
                    <div className="handshake">🤝</div>
                    <div className="table">📋</div>
                    <div className="document">📊</div>
                    <div className="phone">📱</div>
                  </div>
                  <div className="office-background"></div>
                </div>
              </div>

              <div className="blog-info">
                <h2 className="blog-title">Diam dolor est labore duo ipsum clita sed et lorem tempor duo</h2>
                <p className="blog-description">
                  Sadipscing labore amet rebum est et justo gubergren. Et eirmod voluptua at voluptua sit amet, lorem at sit diam voluptua. Dolores et duo stet lorem sed diam stet. Diam duo stet lorem sed diam stet. Et eirmod voluptua at voluptua sit amet, lorem at sit diam voluptua. Dolores et duo stet lorem sed diam stet.
                </p>
                <p className="blog-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="blog-description">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            <div className="sidebar">
              <div className="search-section">
                <form className="search-form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Keyword"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    🔍
                  </button>
                </form>
              </div>

              <div className="categories-section">
                <h3 className="sidebar-title">Categories</h3>
                <div className="sidebar-underline"></div>
                <ul className="categories-list">
                  {categories.map((category, index) => (
                    <li key={index} className="category-item">
                      <span className="category-arrow">→</span>
                      <span className="category-name">{category}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="recent-posts-section">
                <h3 className="sidebar-title">Recent Post</h3>
                <div className="sidebar-underline"></div>
                <div className="recent-posts-list">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="recent-post-item">
                      <div className="post-thumbnail">
                        <div className="thumbnail-image">
                          <span className="thumbnail-icon">{post.image}</span>
                        </div>
                      </div>
                      <div className="post-content">
                        <h4 className="post-title">{post.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
