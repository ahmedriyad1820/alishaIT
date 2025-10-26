import { useState } from 'react'

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: '', email: '', quantity: 1, message: '' })
  const [orderSent, setOrderSent] = useState(false)

  const products = [
    {
      title: "Web Development Package",
      description: "Complete web development solution with modern design and responsive layout",
      icon: "</>",
      details: "Our comprehensive web development package includes custom website design, responsive development, content management system, and ongoing support. Perfect for businesses looking to establish a strong online presence.",
      price: "$999",
      features: ["Custom Design", "Responsive Layout", "CMS Integration", "SEO Optimization", "6 Months Support"],
      manager: "John Doe",
      category: "Web Development",
      rating: 5
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      icon: "📱",
      details: "Professional mobile app development services including native iOS and Android apps, cross-platform solutions, UI/UX design, and app store deployment.",
      price: "$1999",
      features: ["Native Development", "Cross-Platform", "UI/UX Design", "App Store Deployment", "1 Year Support"],
      manager: "Jane Smith",
      category: "Mobile Development",
      rating: 5
    },
    {
      title: "E-commerce Solution",
      description: "Complete e-commerce platform with payment integration and inventory management",
      icon: "🛒",
      details: "Full-featured e-commerce solution with secure payment processing, inventory management, order tracking, and customer management system.",
      price: "$1499",
      features: ["Payment Integration", "Inventory Management", "Order Tracking", "Customer Portal", "Analytics Dashboard"],
      manager: "Mike Johnson",
      category: "E-commerce",
      rating: 4
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud solutions with security and performance optimization",
      icon: "☁️",
      details: "Enterprise-grade cloud infrastructure setup with AWS, Azure, or Google Cloud, including security configurations, monitoring, and backup solutions.",
      price: "$799",
      features: ["Cloud Setup", "Security Configuration", "Monitoring", "Backup Solutions", "24/7 Support"],
      manager: "Sarah Wilson",
      category: "Cloud Services",
      rating: 5
    },
    {
      title: "Data Analytics Dashboard",
      description: "Business intelligence and data visualization solutions",
      icon: "📊",
      details: "Advanced data analytics dashboard with real-time reporting, data visualization, and business intelligence tools to help you make data-driven decisions.",
      price: "$1299",
      features: ["Real-time Reporting", "Data Visualization", "Business Intelligence", "Custom Reports", "API Integration"],
      manager: "David Brown",
      category: "Data Analytics",
      rating: 4
    }
  ]

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowDetails(true)
  }

  const handleBackToProducts = () => {
    setShowDetails(false)
    setSelectedProduct(null)
  }

  const handleOrderChange = (e) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value })
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    console.log('Order submitted:', { product: selectedProduct?.title, ...orderForm })
    setOrderSent(true)
    setOrderForm({ name: '', email: '', quantity: 1, message: '' })
    setTimeout(() => setOrderSent(false), 3000)
  }

  return (
    <div className="product-page">
      {!showDetails ? (
        <>
          {/* Products Hero Section */}
          <section className="products-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Our Products</h1>
            </div>
          </section>

          {/* Products Content Section */}
          <section className="products-content-section">
            <div className="container">
              <div className="products-header">
                <span className="products-subtitle">OUR PRODUCTS</span>
                <h2 className="products-title">Digital Solutions & Products</h2>
                <div className="products-underline">
                  <div className="underline-line"></div>
                  <div className="underline-dot"></div>
                  <div className="underline-line"></div>
                </div>
              </div>

              <div className="products-grid">
                {products.map((product, index) => (
                  <div key={index} className="product-card" onClick={() => handleProductClick(product)}>
                    <div className="product-icon">
                      <div className="icon-diamond">
                        <span className="icon-symbol">{product.icon}</span>
                      </div>
                    </div>
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">{product.price}</div>
                    <div className="product-rating">
                      {[...Array(product.rating)].map((_, i) => (
                        <span key={i} className="star">⭐</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Product Details Hero Section */}
          <section className="product-hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Product Details</h1>
            </div>
          </section>

          {/* Product Details Content */}
          <section className="product-details-content">
            <div className="container">
              <div className="product-layout">
                <div className="main-content">
                  <div className="product-image">
                    <div className="image-placeholder">
                      <div className="business-meeting">
                        <div className="person-1">👨‍💼</div>
                        <div className="person-2">👩‍💼</div>
                        <div className="handshake">🤝</div>
                        <div className="table">📋</div>
                        <div className="document">📊</div>
                      </div>
                      <div className="office-background"></div>
                    </div>
                  </div>

                  <div className="product-info">
                    <h2 className="product-title">{selectedProduct?.title}</h2>
                    <div className="product-price-large">{selectedProduct?.price}</div>
                    <p className="product-description">
                      {selectedProduct?.details}
                    </p>
                    <p className="product-description">
                      Our team of experienced professionals is dedicated to delivering high-quality solutions that meet your specific business requirements. We use the latest technologies and industry best practices to ensure your project's success.
                    </p>
                  </div>
                </div>

                <div className="sidebar">
                  <div className="product-information-box">
                    <h3 className="info-title">Product Information</h3>
                  </div>

                  <div className="product-details-list">
                    <div className="detail-row">
                      <span className="detail-label">Product Name:</span>
                      <span className="detail-value">{selectedProduct?.title}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">{selectedProduct?.price}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedProduct?.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Manager:</span>
                      <span className="detail-value">{selectedProduct?.manager}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Rating:</span>
                      <div className="rating-stars">
                        {[...Array(selectedProduct?.rating || 5)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="product-features">
                    <h4 className="features-title">Features Included:</h4>
                    <ul className="features-list">
                      {selectedProduct?.features.map((feature, index) => (
                        <li key={index} className="feature-item">✓ {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-section">
                    <h4 className="order-title">Place Your Order</h4>
                    <form className="order-form" onSubmit={handleOrderSubmit}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={orderForm.name}
                        onChange={handleOrderChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={orderForm.email}
                        onChange={handleOrderChange}
                        required
                      />
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={orderForm.quantity}
                        onChange={handleOrderChange}
                        min="1"
                        required
                      />
                      <textarea
                        name="message"
                        placeholder="Additional Requirements"
                        rows="3"
                        value={orderForm.message}
                        onChange={handleOrderChange}
                      ></textarea>
                      <button type="submit" className="order-btn">
                        Place Order
                      </button>
                      {orderSent && <p className="success-message">Your order has been placed successfully!</p>}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Back to Products Button */}
      {showDetails && (
        <div className="back-to-products">
          <button className="back-btn" onClick={handleBackToProducts}>
            ← Back to Products
          </button>
        </div>
      )}
    </div>
  )
}
