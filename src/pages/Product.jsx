import { useState, useEffect } from 'react'
import { orderAPI, productItemsAPI } from '../api/client.js'

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: '', email: '', quantity: 1, message: '' })
  const [orderSent, setOrderSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      const result = await productItemsAPI.list()
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setProductsLoading(false)
    }
  }

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

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const orderData = {
        ...orderForm,
        product: selectedProduct?.title,
        amount: selectedProduct?.price ? parseInt(selectedProduct.price.replace('$', '')) * orderForm.quantity : 0
      }
      
      const result = await orderAPI.create(orderData)
      
      if (result.success) {
        setOrderSent(true)
        setOrderForm({ name: '', email: '', quantity: 1, message: '' })
        setTimeout(() => setOrderSent(false), 3000)
        console.log('Order saved to MongoDB:', result.data)
      } else {
        setError(result.error || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error submitting order:', err)
    } finally {
      setLoading(false)
    }
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
                {productsLoading ? (
                  <div className="loading">Loading products...</div>
                ) : (
                  products.map((product, index) => (
                    <div key={product._id || index} className="product-card" onClick={() => handleProductClick(product)}>
                      {product.image && (
                        <div className="product-image" style={{ width: '100%', height: 220, overflow: 'hidden', borderRadius: 12 }}>
                          <img 
                            src={`http://localhost:3001${product.image}`} 
                            alt={product.title} 
                            className="product-main-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      )}
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-price">{product.price || 'Contact for Price'}</div>
                      <div className="product-rating">
                        {[...Array(product.rating)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
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
                  <div className="product-image" style={{
                    width: '100%',
                    borderRadius: 12,
                    background: '#0b1220',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    maxHeight: '70vh'
                  }}>
                    {selectedProduct?.image ? (
                      <img 
                        src={`http://localhost:3001${selectedProduct.image}`} 
                        alt={selectedProduct.title} 
                        className="product-main-image"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
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
                    )}
                  </div>

                  <div className="product-info">
                    <h2 className="product-title">{selectedProduct?.title}</h2>
                    <div className="product-price-large">{selectedProduct?.price || 'Contact for Price'}</div>
                    <p className="product-description">
                      {selectedProduct?.description}
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
                      <span className="detail-value">{selectedProduct?.price || 'Contact for Price'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{selectedProduct?.category || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Availability:</span>
                      <span className="detail-value">{selectedProduct?.availability || 'In Stock'}</span>
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

                  {selectedProduct?.features && selectedProduct.features.length > 0 && (
                    <div className="product-features">
                      <h4 className="features-title">Features Included:</h4>
                      <ul className="features-list">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="feature-item">✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProduct?.specifications && (
                    <div className="product-specifications">
                      <h4 className="specifications-title">Specifications:</h4>
                      <p className="specifications-text">{selectedProduct.specifications}</p>
                    </div>
                  )}

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
                      <button type="submit" className="order-btn" disabled={loading}>
                        {loading ? 'PLACING ORDER...' : 'Place Order'}
                      </button>
                      {error && <p className="error-message">{error}</p>}
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
