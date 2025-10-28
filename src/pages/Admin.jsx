import { useState, useEffect } from 'react'
import AdminLogin from '../components/AdminLogin'
import { contactAPI, quoteAPI, orderAPI, adminAPI, pageContentAPI, imageUploadAPI } from '../api/client.js'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalQuotes: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [contacts, setContacts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Page content state management
  const [pageContent, setPageContent] = useState({})
  const [editingPage, setEditingPage] = useState(null)
  const [publishStatus, setPublishStatus] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [])

  // Load page content when switching to edit mode
  useEffect(() => {
    if (activeTab === 'edit-home') {
      loadPageContent('home')
    } else if (activeTab === 'edit-about') {
      loadPageContent('about')
    } else if (activeTab === 'edit-services') {
      loadPageContent('services')
    } else if (activeTab === 'edit-contact') {
      loadPageContent('contact')
    } else if (activeTab === 'edit-products') {
      loadPageContent('products')
    } else if (activeTab === 'edit-projects') {
      loadPageContent('projects')
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsResult, contactsResult, quotesResult, ordersResult] = await Promise.all([
        adminAPI.getStats(),
        contactAPI.getAll(),
        quoteAPI.getAll(),
        orderAPI.getAll()
      ])

      if (statsResult.success) {
        setStats(statsResult.data)
      }
      if (contactsResult.success) {
        setContacts(contactsResult.data)
      }
      if (quotesResult.success) {
        setQuotes(quotesResult.data)
      }
      if (ordersResult.success) {
        setOrders(ordersResult.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (success) => {
    if (success) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      await loadDashboardData()
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    setActiveTab('dashboard')
    setStats({ totalContacts: 0, totalQuotes: 0, totalOrders: 0, totalRevenue: 0 })
    setContacts([])
    setQuotes([])
    setOrders([])
    setPageContent({})
    setEditingPage(null)
    setPublishStatus('')
  }

  // Load page content when editing a page
  const loadPageContent = async (pageName) => {
    try {
      const result = await pageContentAPI.get(pageName)
      if (result.success) {
        setPageContent(result.data.sections || {})
        setEditingPage(pageName)
      }
    } catch (error) {
      console.error('Error loading page content:', error)
    }
  }

  // Handle content changes
  const handleContentChange = (section, field, value) => {
    console.log('Content change:', { section, field, value })
    setPageContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Handle image upload
  const handleImageUpload = async (file, section, field) => {
    try {
      const result = await imageUploadAPI.upload(file)
      if (result.success) {
        handleContentChange(section, field, result.data.url)
        return result.data.url
      }
    } catch (error) {
      console.error('Image upload error:', error)
    }
    return null
  }

  // Publish page content
  const publishPageContent = async () => {
    if (!editingPage) return
    
    console.log('Publishing page content:', { editingPage, pageContent })
    setIsPublishing(true)
    setPublishStatus('')
    
    try {
      const result = await pageContentAPI.update(editingPage, pageContent, true)
      console.log('Publish result:', result)
      if (result.success) {
        setPublishStatus('success')
        // Refresh the content context to show changes on the public site
        window.dispatchEvent(new CustomEvent('contentRefresh'))
        setTimeout(() => setPublishStatus(''), 3000)
      } else {
        setPublishStatus('error')
        setTimeout(() => setPublishStatus(''), 3000)
      }
    } catch (error) {
      console.error('Publish error:', error)
      setPublishStatus('error')
      setTimeout(() => setPublishStatus(''), 3000)
    } finally {
      setIsPublishing(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
      case 'pending':
        return '#ffc107'
      case 'read':
      case 'processing':
        return '#17a2b8'
      case 'replied':
      case 'quoted':
        return '#28a745'
      case 'accepted':
      case 'delivered':
        return '#007bff'
      case 'rejected':
      case 'cancelled':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  return (
    <div className="admin-page">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <>
          <div className="admin-layout">
            <div className="admin-sidebar">
              <div className="sidebar-header">
                <img 
                  src="/logo2.png" 
                  alt="Alisha IT Solutions" 
                  className="admin-logo"
                />
                <h2>Admin Panel</h2>
              </div>
              <nav className="sidebar-nav">
                <button 
                  className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <span className="sidebar-icon">📊</span>
                  <span className="sidebar-text">Dashboard</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'contacts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contacts')}
                >
                  <span className="sidebar-icon">📞</span>
                  <span className="sidebar-text">Contacts</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'quotes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quotes')}
                >
                  <span className="sidebar-icon">💰</span>
                  <span className="sidebar-text">Quotes</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <span className="sidebar-icon">📦</span>
                  <span className="sidebar-text">Orders</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'pages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pages')}
                >
                  <span className="sidebar-icon">📄</span>
                  <span className="sidebar-text">Pages</span>
                </button>
              </nav>
              <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                  <span className="sidebar-icon">🚪</span>
                  <span className="sidebar-text">Logout</span>
                </button>
              </div>
            </div>

            <div className="admin-main">
              <div className="admin-content">
            {activeTab === 'dashboard' && (
              <div className="dashboard">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📞</div>
                    <div className="stat-info">
                      <h3>{stats.totalContacts}</h3>
                      <p>Total Contacts</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>{stats.totalQuotes}</h3>
                      <p>Quote Requests</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>{stats.totalOrders}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💵</div>
                    <div className="stat-info">
                      <h3>${stats.totalRevenue.toLocaleString()}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-charts">
                  <div className="chart-card">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">📞</div>
                        <div className="activity-content">
                          <p>New contact from John Doe</p>
                          <span>2 hours ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">💰</div>
                        <div className="activity-content">
                          <p>Quote request for Web Development</p>
                          <span>4 hours ago</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-content">
                          <p>New order: Mobile App Development</p>
                          <span>6 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                      <button className="action-btn">
                        <span className="action-icon">📊</span>
                        View Reports
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">⚙️</span>
                        Settings
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">👥</span>
                        Manage Users
                      </button>
                      <button className="action-btn">
                        <span className="action-icon">📧</span>
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="contacts-section">
                <div className="section-header">
                  <h2>Contact Messages</h2>
                  <button className="btn-primary">Export Data</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading contacts...
                          </td>
                        </tr>
                      ) : contacts.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                            No contacts found
                          </td>
                        </tr>
                      ) : (
                        contacts.map(contact => (
                          <tr key={contact._id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.subject}</td>
                            <td>{formatDate(contact.createdAt)}</td>
                            <td>
                              <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(contact.status) }}
                              >
                                {contact.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-sm">View</button>
                              <button className="btn-sm">Reply</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="quotes-section">
                <div className="section-header">
                  <h2>Quote Requests</h2>
                  <button className="btn-primary">Create Quote</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading quotes...
                          </td>
                        </tr>
                      ) : quotes.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                            No quotes found
                          </td>
                        </tr>
                      ) : (
                        quotes.map(quote => (
                          <tr key={quote._id}>
                            <td>{quote.name}</td>
                            <td>{quote.email}</td>
                            <td>{quote.service}</td>
                            <td>${quote.quotedAmount || 0}</td>
                            <td>{formatDate(quote.createdAt)}</td>
                            <td>
                              <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(quote.status) }}
                              >
                                {quote.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-sm">View</button>
                              <button className="btn-sm">Update</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <div className="section-header">
                  <h2>Product Orders</h2>
                  <button className="btn-primary">Add Order</button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading orders...
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order._id}>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>${order.amount}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(order.status) }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-sm">View</button>
                              <button className="btn-sm">Update</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'pages' && (
              <div className="pages-section">
                <div className="section-header">
                  <h2>Page Management</h2>
                  <button className="btn-primary">Add New Page</button>
                </div>
                
                <div className="pages-grid">
                  <div className="page-card" onClick={() => setActiveTab('edit-home')}>
                    <div className="page-icon">🏠</div>
                    <h3>Home Page</h3>
                    <p>Edit hero section, about content, and homepage layout</p>
                    <div className="page-status">Published</div>
                  </div>
                  
                  <div className="page-card" onClick={() => setActiveTab('edit-about')}>
                    <div className="page-icon">ℹ️</div>
                    <h3>About Page</h3>
                    <p>Manage company information, team, and story content</p>
                    <div className="page-status">Published</div>
                  </div>
                  
                  <div className="page-card" onClick={() => setActiveTab('edit-services')}>
                    <div className="page-icon">⚙️</div>
                    <h3>Services Page</h3>
                    <p>Edit service descriptions, pricing, and process details</p>
                    <div className="page-status">Published</div>
                  </div>
                  
                  <div className="page-card" onClick={() => setActiveTab('edit-contact')}>
                    <div className="page-icon">📞</div>
                    <h3>Contact Page</h3>
                    <p>Update contact information and form settings</p>
                    <div className="page-status">Published</div>
                  </div>
                  
                  <div className="page-card" onClick={() => setActiveTab('edit-products')}>
                    <div className="page-icon">📦</div>
                    <h3>Products Page</h3>
                    <p>Manage product catalog and pricing information</p>
                    <div className="page-status">Published</div>
                  </div>
                  
                  <div className="page-card" onClick={() => setActiveTab('edit-projects')}>
                    <div className="page-icon">🚀</div>
                    <h3>Projects Page</h3>
                    <p>Showcase portfolio and project case studies</p>
                    <div className="page-status">Published</div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Editor Sections */}
            {activeTab === 'edit-home' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - Home Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success" 
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  {/* Live Homepage Display */}
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* Hero Section - Editable */}
                      <section className="hero editable-section" data-section="hero">
                        <div className="hero-background">
                          <div className="hero-overlay"></div>
                        </div>
                        <div className="hero-content">
                          <div className="hero-text">
                            <div 
                              className="company-name editable-text" 
                              data-field="company-name"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('hero', 'companyName', e.target.textContent)}
                            >
                              {pageContent.hero?.companyName || 'ALISHA IT SOLUTION\'S'}
                            </div>
                            <h1 
                              className="hero-title editable-text" 
                              data-field="hero-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('hero', 'title', e.target.textContent)}
                            >
                              {pageContent.hero?.title || 'Creative & Innovative\nDigital Solution'}
                            </h1>
                            <div className="hero-buttons">
                              <button 
                                className="btn-primary editable-text" 
                                data-field="primary-button"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('hero', 'primaryButton', e.target.textContent)}
                              >
                                {pageContent.hero?.primaryButton || 'Free Quote'}
                              </button>
                              <button 
                                className="btn-secondary editable-text" 
                                data-field="secondary-button"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('hero', 'secondaryButton', e.target.textContent)}
                              >
                                {pageContent.hero?.secondaryButton || 'Contact Us'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* About Section - Editable */}
                      <section className="about editable-section" data-section="about">
                        <div className="container">
                          <div className="about-content">
                            <div className="about-text">
                              <span 
                                className="about-subtitle editable-text" 
                                data-field="about-subtitle"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('about', 'subtitle', e.target.textContent)}
                              >
                                {pageContent.about?.subtitle || 'ABOUT US'}
                              </span>
                              <h2 
                                className="about-title editable-text" 
                                data-field="about-title"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('about', 'title', e.target.textContent)}
                              >
                                {pageContent.about?.title || 'The Best IT Solution With 10 Years of Experience'}
                              </h2>
                              <div className="about-underline"></div>
                              
                              <p 
                                className="about-description editable-text" 
                                data-field="about-description"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('about', 'description', e.target.textContent)}
                              >
                                {pageContent.about?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                              </p>
                              
                              <button 
                                className="see-more-btn editable-text" 
                                data-field="read-more-button"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('about', 'readMoreButton', e.target.textContent)}
                              >
                                {pageContent.about?.readMoreButton || 'Read More'}
                              </button>
                            </div>
                            
                            <div className="about-image">
                              <div className="image-upload-container">
                                <div className="image-placeholder editable-image" data-field="about-image">
                                  <div className="professional-image">
                                    <div className="person-icon">👨‍💼</div>
                                    <div className="office-background"></div>
                                  </div>
                                  <div className="image-upload-overlay">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="image-upload-input" 
                                      data-field="about-image"
                                    />
                                    <button className="upload-btn">📷 Upload Image</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Services Section - Editable */}
                      <section className="services editable-section" data-section="services">
                        <div className="container">
                          <div className="services-header">
                            <span 
                              className="services-subtitle editable-text" 
                              data-field="services-subtitle"
                              contentEditable="true"
                            >
                              OUR SERVICES
                            </span>
                            <h2 
                              className="services-title editable-text" 
                              data-field="services-title"
                              contentEditable="true"
                            >
                              We Provide The Best Service For You
                            </h2>
                            <div className="services-underline"></div>
                            <p 
                              className="services-description editable-text" 
                              data-field="services-description"
                              contentEditable="true"
                            >
                              We offer comprehensive IT solutions tailored to your business needs. Our expert team delivers cutting-edge technology services.
                            </p>
                          </div>
                          
                          <div className="services-grid">
                            <div className="service-card editable-card" data-field="service-1">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">💻</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Web Development</h3>
                              <p className="service-description editable-text" contentEditable="true">Custom websites and web applications built with modern technologies.</p>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-2">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">📱</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Mobile App Development</h3>
                              <p className="service-description editable-text" contentEditable="true">Native and cross-platform mobile applications for iOS and Android.</p>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-3">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">🔍</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">SEO Optimization</h3>
                              <p className="service-description editable-text" contentEditable="true">Improve your website's visibility and ranking in search engines.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Request Quote Section - Editable */}
                      <section className="request-quote editable-section" data-section="quote">
                        <div className="container">
                          <div className="quote-content">
                            <div className="quote-info">
                              <span 
                                className="quote-subtitle editable-text" 
                                data-field="quote-subtitle"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('quote', 'subtitle', e.target.textContent)}
                              >
                                {pageContent.quote?.subtitle || 'REQUEST A QUOTE'}
                              </span>
                              <h2 
                                className="quote-title editable-text" 
                                data-field="quote-title"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('quote', 'title', e.target.textContent)}
                              >
                                {pageContent.quote?.title || 'Need A Free Quote? Please Feel Free to Contact Us'}
                              </h2>
                              <div className="quote-underline">
                                <div className="underline-line"></div>
                                <div className="underline-line short"></div>
                              </div>

                              <p 
                                className="quote-description editable-text" 
                                data-field="quote-description"
                                contentEditable="true"
                              >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                              </p>

                              <div className="quote-contact">
                                <button className="phone-btn">
                                  <div className="phone-icon">📞</div>
                                </button>
                                <div className="contact-text">
                                  <p>Call to ask any question</p>
                                  <span 
                                    className="phone-number editable-text" 
                                    data-field="phone-number"
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('quote', 'phoneNumber', e.target.textContent)}
                                  >
                                    {pageContent.quote?.phoneNumber || '+012 345 6789'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="quote-form-section">
                              <form className="quote-form">
                                <input name="name" placeholder="Your Name" />
                                <input name="email" type="email" placeholder="Your Email" />
                                <select name="service">
                                  <option>Select A Service</option>
                                  <option>Web Development</option>
                                  <option>Mobile App Development</option>
                                  <option>SEO Optimization</option>
                                </select>
                                <textarea name="message" placeholder="Message" rows="4"></textarea>
                                <button className="submit-btn" type="submit">Request A Quote</button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-about' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - About Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success"
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* About Hero Section */}
                      <section className="about-hero editable-section" data-section="about-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                          <h1 
                            className="hero-title editable-text" 
                            data-field="about-hero-title"
                            contentEditable="true"
                            onBlur={(e) => handleContentChange('hero', 'title', e.target.textContent)}
                          >
                            About Us
                          </h1>
                        </div>
                      </section>

                      {/* About Content Section */}
                      <section className="about-content-section editable-section" data-section="about-content">
                        <div className="container">
                          <div className="about-layout">
                            <div className="about-text">
                              <span 
                                className="about-subtitle editable-text" 
                                data-field="about-subtitle"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('content', 'subtitle', e.target.textContent)}
                              >
                                ABOUT US
                              </span>
                              <h2 
                                className="about-title editable-text" 
                                data-field="about-title"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('content', 'title', e.target.textContent)}
                              >
                                The Best IT Solution With 10 Years of Experience
                              </h2>
                              <div className="about-underline"></div>
                              
                              <p 
                                className="about-description editable-text" 
                                data-field="about-description"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('content', 'description', e.target.textContent)}
                              >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                              </p>
                              
                              <div className="about-features">
                                <div className="feature-item editable-card" data-field="feature-1">
                                  <div className="feature-icon">✓</div>
                                  <span className="feature-text editable-text" contentEditable="true">Professional Team</span>
                                </div>
                                <div className="feature-item editable-card" data-field="feature-2">
                                  <div className="feature-icon">✓</div>
                                  <span className="feature-text editable-text" contentEditable="true">24/7 Support</span>
                                </div>
                                <div className="feature-item editable-card" data-field="feature-3">
                                  <div className="feature-icon">✓</div>
                                  <span className="feature-text editable-text" contentEditable="true">Quality Service</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="about-image">
                              <div className="image-upload-container">
                                <div className="image-placeholder editable-image" data-field="about-image">
                                  <div className="professional-image">
                                    <div className="person-icon">👨‍💼</div>
                                    <div className="office-background"></div>
                                  </div>
                                  <div className="image-upload-overlay">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="image-upload-input" 
                                      data-field="about-image"
                                    />
                                    <button className="upload-btn">📷 Upload Image</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Statistics Section */}
                      <section className="statistics editable-section" data-section="statistics">
                        <div className="container">
                          <div className="stats-grid">
                            <div className="stat-item editable-card" data-field="stat-1">
                              <div className="stat-number editable-text" contentEditable="true">500+</div>
                              <div className="stat-label editable-text" contentEditable="true">Projects Completed</div>
                            </div>
                            <div className="stat-item editable-card" data-field="stat-2">
                              <div className="stat-number editable-text" contentEditable="true">200+</div>
                              <div className="stat-label editable-text" contentEditable="true">Happy Clients</div>
                            </div>
                            <div className="stat-item editable-card" data-field="stat-3">
                              <div className="stat-number editable-text" contentEditable="true">10+</div>
                              <div className="stat-label editable-text" contentEditable="true">Years Experience</div>
                            </div>
                            <div className="stat-item editable-card" data-field="stat-4">
                              <div className="stat-number editable-text" contentEditable="true">50+</div>
                              <div className="stat-label editable-text" contentEditable="true">Team Members</div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Our Story Timeline */}
                      <section className="our-story editable-section" data-section="our-story">
                        <div className="container">
                          <div className="story-header">
                            <span 
                              className="story-subtitle editable-text" 
                              data-field="story-subtitle"
                              contentEditable="true"
                            >
                              OUR STORY
                            </span>
                            <h2 
                              className="story-title editable-text" 
                              data-field="story-title"
                              contentEditable="true"
                            >
                              Our Journey Through The Years
                            </h2>
                            <div className="story-underline"></div>
                          </div>
                          
                          <div className="timeline">
                            <div className="timeline-item editable-card" data-field="timeline-1">
                              <div className="timeline-year editable-text" contentEditable="true">2014</div>
                              <div className="timeline-content">
                                <h3 className="timeline-title editable-text" contentEditable="true">Company Founded</h3>
                                <p className="timeline-description editable-text" contentEditable="true">Started as a small IT consulting firm with big dreams.</p>
                              </div>
                            </div>
                            
                            <div className="timeline-item editable-card" data-field="timeline-2">
                              <div className="timeline-year editable-text" contentEditable="true">2018</div>
                              <div className="timeline-content">
                                <h3 className="timeline-title editable-text" contentEditable="true">Expansion</h3>
                                <p className="timeline-description editable-text" contentEditable="true">Expanded our services to include web development and mobile apps.</p>
                              </div>
                            </div>
                            
                            <div className="timeline-item editable-card" data-field="timeline-3">
                              <div className="timeline-year editable-text" contentEditable="true">2022</div>
                              <div className="timeline-content">
                                <h3 className="timeline-title editable-text" contentEditable="true">Global Reach</h3>
                                <p className="timeline-description editable-text" contentEditable="true">Reached clients worldwide with our innovative solutions.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Team Members */}
                      <section className="team-members editable-section" data-section="team">
                        <div className="container">
                          <div className="team-header">
                            <span 
                              className="team-subtitle editable-text" 
                              data-field="team-subtitle"
                              contentEditable="true"
                            >
                              OUR TEAM
                            </span>
                            <h2 
                              className="team-title editable-text" 
                              data-field="team-title"
                              contentEditable="true"
                            >
                              Meet Our Expert Team Members
                            </h2>
                            <div className="team-underline"></div>
                          </div>
                          
                          <div className="team-grid">
                            <div className="team-card editable-card" data-field="team-member-1">
                              <div className="team-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="team-image-1">
                                    <div className="person-avatar">👨‍💼</div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="team-image-1"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h3 className="team-name editable-text" contentEditable="true">John Doe</h3>
                              <p className="team-position editable-text" contentEditable="true">CEO & Founder</p>
                              <p className="team-description editable-text" contentEditable="true">Visionary leader with 15+ years in IT industry.</p>
                            </div>
                            
                            <div className="team-card editable-card" data-field="team-member-2">
                              <div className="team-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="team-image-2">
                                    <div className="person-avatar">👩‍💼</div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="team-image-2"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h3 className="team-name editable-text" contentEditable="true">Jane Smith</h3>
                              <p className="team-position editable-text" contentEditable="true">CTO</p>
                              <p className="team-description editable-text" contentEditable="true">Technical expert specializing in modern technologies.</p>
                            </div>
                            
                            <div className="team-card editable-card" data-field="team-member-3">
                              <div className="team-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="team-image-3">
                                    <div className="person-avatar">👨‍💻</div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="team-image-3"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h3 className="team-name editable-text" contentEditable="true">Mike Johnson</h3>
                              <p className="team-position editable-text" contentEditable="true">Lead Developer</p>
                              <p className="team-description editable-text" contentEditable="true">Full-stack developer with expertise in React and Node.js.</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-services' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - Services Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success"
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* Services Hero Section */}
                      <section className="services-hero editable-section" data-section="services-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                          <h1 
                            className="hero-title editable-text" 
                            data-field="services-hero-title"
                            contentEditable="true"
                          >
                            Our Services
                          </h1>
                        </div>
                      </section>

                      {/* Services Content Section */}
                      <section className="services-content-section editable-section" data-section="services-content">
                        <div className="container">
                          <div className="services-header">
                            <span 
                              className="services-subtitle editable-text" 
                              data-field="services-subtitle"
                              contentEditable="true"
                            >
                              OUR SERVICES
                            </span>
                            <h2 
                              className="services-title editable-text" 
                              data-field="services-title"
                              contentEditable="true"
                            >
                              We Provide The Best Service For You
                            </h2>
                            <div className="services-underline"></div>
                            <p 
                              className="services-description editable-text" 
                              data-field="services-description"
                              contentEditable="true"
                            >
                              We offer comprehensive IT solutions tailored to your business needs. Our expert team delivers cutting-edge technology services.
                            </p>
                          </div>
                          
                          <div className="services-grid">
                            <div className="service-card editable-card" data-field="service-1">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">💻</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Web Development</h3>
                              <p className="service-description editable-text" contentEditable="true">Custom websites and web applications built with modern technologies.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $999</div>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-2">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">📱</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Mobile App Development</h3>
                              <p className="service-description editable-text" contentEditable="true">Native and cross-platform mobile applications for iOS and Android.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $1999</div>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-3">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">🔍</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">SEO Optimization</h3>
                              <p className="service-description editable-text" contentEditable="true">Improve your website's visibility and ranking in search engines.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $499</div>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-4">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">📊</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Digital Marketing</h3>
                              <p className="service-description editable-text" contentEditable="true">Comprehensive digital marketing strategies to grow your business.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $799</div>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-5">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">☁️</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Cloud Solutions</h3>
                              <p className="service-description editable-text" contentEditable="true">Scalable cloud infrastructure and migration services.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $1299</div>
                            </div>
                            
                            <div className="service-card editable-card" data-field="service-6">
                              <div className="service-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">🛡️</span>
                                </div>
                              </div>
                              <h3 className="service-title editable-text" contentEditable="true">Cybersecurity</h3>
                              <p className="service-description editable-text" contentEditable="true">Protect your business with advanced security solutions.</p>
                              <div className="service-price editable-text" contentEditable="true">Starting from $899</div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Services Process Section */}
                      <section className="services-process editable-section" data-section="services-process">
                        <div className="container">
                          <div className="process-header">
                            <span 
                              className="process-subtitle editable-text" 
                              data-field="process-subtitle"
                              contentEditable="true"
                            >
                              OUR PROCESS
                            </span>
                            <h2 
                              className="process-title editable-text" 
                              data-field="process-title"
                              contentEditable="true"
                            >
                              How We Work
                            </h2>
                            <div className="process-underline"></div>
                          </div>
                          
                          <div className="process-steps">
                            <div className="process-step editable-card" data-field="step-1">
                              <div className="step-number editable-text" contentEditable="true">01</div>
                              <h3 className="step-title editable-text" contentEditable="true">Consultation</h3>
                              <p className="step-description editable-text" contentEditable="true">We discuss your requirements and understand your business goals.</p>
                            </div>
                            
                            <div className="process-step editable-card" data-field="step-2">
                              <div className="step-number editable-text" contentEditable="true">02</div>
                              <h3 className="step-title editable-text" contentEditable="true">Planning</h3>
                              <p className="step-description editable-text" contentEditable="true">We create a detailed project plan and timeline for your project.</p>
                            </div>
                            
                            <div className="process-step editable-card" data-field="step-3">
                              <div className="step-number editable-text" contentEditable="true">03</div>
                              <h3 className="step-title editable-text" contentEditable="true">Development</h3>
                              <p className="step-description editable-text" contentEditable="true">Our team develops your solution using the latest technologies.</p>
                            </div>
                            
                            <div className="process-step editable-card" data-field="step-4">
                              <div className="step-number editable-text" contentEditable="true">04</div>
                              <h3 className="step-title editable-text" contentEditable="true">Delivery</h3>
                              <p className="step-description editable-text" contentEditable="true">We deliver your project and provide ongoing support.</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-contact' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - Contact Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success"
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* Contact Hero Section */}
                      <section className="contact-hero editable-section" data-section="contact-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                          <h1 
                            className="hero-title editable-text" 
                            data-field="contact-hero-title"
                            contentEditable="true"
                          >
                            If You Have Any Query, Feel Free To Contact Us
                          </h1>
                        </div>
                      </section>

                      {/* Contact Form and Map Section */}
                      <section className="contact-form-section editable-section" data-section="contact-form">
                        <div className="container">
                          <div className="contact-layout">
                            <div className="contact-form-container">
                              <div className="form-header">
                                <h2 
                                  className="form-title editable-text" 
                                  data-field="form-title"
                                  contentEditable="true"
                                >
                                  Send Us A Message
                                </h2>
                                <p 
                                  className="form-description editable-text" 
                                  data-field="form-description"
                                  contentEditable="true"
                                >
                                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                </p>
                              </div>
                              
                              <form className="contact-form">
                                <div className="form-row">
                                  <div className="form-group half">
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Your Name"
                                    />
                                  </div>
                                  <div className="form-group half">
                                    <input
                                      type="email"
                                      name="email"
                                      placeholder="Your Email"
                                    />
                                  </div>
                                </div>
                                
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <textarea
                                    name="message"
                                    placeholder="Message"
                                    rows="5"
                                  ></textarea>
                                </div>
                                
                                <button type="submit" className="submit-btn">
                                  <span className="btn-text editable-text" contentEditable="true">SEND MESSAGE</span>
                                </button>
                              </form>
                            </div>

                            <div className="contact-map-container">
                              <div className="map-header">
                                <h3 
                                  className="map-title editable-text" 
                                  data-field="map-title"
                                  contentEditable="true"
                                >
                                  Find Us Here
                                </h3>
                                <p 
                                  className="map-description editable-text" 
                                  data-field="map-description"
                                  contentEditable="true"
                                >
                                  Visit our office or get directions to our location.
                                </p>
                              </div>
                              
                              <div className="map-wrapper">
                                <div className="map-placeholder editable-image" data-field="map-image">
                                  <div className="map-content">
                                    <div className="map-location editable-text" contentEditable="true">📍 New York, United States</div>
                                    <div className="map-controls">
                                      <div className="zoom-controls">
                                        <button className="zoom-btn">+</button>
                                        <button className="zoom-btn">-</button>
                                      </div>
                                      <div className="directions-btn">🧭</div>
                                    </div>
                                    <div className="map-copyright editable-text" contentEditable="true">Map data ©2025 Google Terms</div>
                                  </div>
                                  <div className="image-upload-overlay">
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      className="image-upload-input" 
                                      data-field="map-image"
                                    />
                                    <button className="upload-btn">📷 Upload Map</button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="contact-info">
                                <div className="info-item editable-card" data-field="contact-phone">
                                  <div className="info-icon">📞</div>
                                  <div className="info-content">
                                    <h4 className="info-title editable-text" contentEditable="true">Phone</h4>
                                    <p className="info-value editable-text" contentEditable="true">+012 345 6789</p>
                                  </div>
                                </div>
                                
                                <div className="info-item editable-card" data-field="contact-email">
                                  <div className="info-icon">📧</div>
                                  <div className="info-content">
                                    <h4 className="info-title editable-text" contentEditable="true">Email</h4>
                                    <p className="info-value editable-text" contentEditable="true">info@alishait.com</p>
                                  </div>
                                </div>
                                
                                <div className="info-item editable-card" data-field="contact-address">
                                  <div className="info-icon">📍</div>
                                  <div className="info-content">
                                    <h4 className="info-title editable-text" contentEditable="true">Address</h4>
                                    <p className="info-value editable-text" contentEditable="true">123 Business Street, New York, NY 10001</p>
                                  </div>
                                </div>
                                
                                <div className="info-item editable-card" data-field="contact-hours">
                                  <div className="info-icon">🕒</div>
                                  <div className="info-content">
                                    <h4 className="info-title editable-text" contentEditable="true">Office Hours</h4>
                                    <p className="info-value editable-text" contentEditable="true">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-products' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - Products Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success" 
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* Products Hero Section */}
                      <section className="products-hero editable-section" data-section="products-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                          <h1 
                            className="hero-title editable-text" 
                            data-field="products-hero-title"
                            contentEditable="true"
                          >
                            Our Products
                          </h1>
                        </div>
                      </section>

                      {/* Products Content Section */}
                      <section className="products-content-section editable-section" data-section="products-content">
                        <div className="container">
                          <div className="products-header">
                            <span 
                              className="products-subtitle editable-text" 
                              data-field="products-subtitle"
                              contentEditable="true"
                            >
                              OUR PRODUCTS
                            </span>
                            <h2 
                              className="products-title editable-text" 
                              data-field="products-title"
                              contentEditable="true"
                            >
                              Innovative Solutions for Your Business
                            </h2>
                            <div className="products-underline">
                              <div className="underline-line"></div>
                              <div className="underline-dot"></div>
                              <div className="underline-line"></div>
                            </div>
                          </div>

                          <div className="products-grid">
                            <div className="product-card editable-card" data-field="product-1">
                              <div className="product-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">💻</span>
                                </div>
                              </div>
                              <h3 className="product-title editable-text" contentEditable="true">Web Development Package</h3>
                              <p className="product-description editable-text" contentEditable="true">Complete web development solution with modern design and responsive layout</p>
                              <div className="product-price editable-text" contentEditable="true">$999</div>
                              <div className="product-rating">
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                              </div>
                            </div>
                            
                            <div className="product-card editable-card" data-field="product-2">
                              <div className="product-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">📱</span>
                                </div>
                              </div>
                              <h3 className="product-title editable-text" contentEditable="true">Mobile App Development</h3>
                              <p className="product-description editable-text" contentEditable="true">Native and cross-platform mobile applications for iOS and Android</p>
                              <div className="product-price editable-text" contentEditable="true">$1999</div>
                              <div className="product-rating">
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                              </div>
                            </div>
                            
                            <div className="product-card editable-card" data-field="product-3">
                              <div className="product-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">🛒</span>
                                </div>
                              </div>
                              <h3 className="product-title editable-text" contentEditable="true">E-commerce Solutions</h3>
                              <p className="product-description editable-text" contentEditable="true">Advanced e-commerce platforms with secure payment gateways and inventory management</p>
                              <div className="product-price editable-text" contentEditable="true">$1499</div>
                              <div className="product-rating">
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                              </div>
                            </div>
                            
                            <div className="product-card editable-card" data-field="product-4">
                              <div className="product-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">☁️</span>
                                </div>
                              </div>
                              <h3 className="product-title editable-text" contentEditable="true">Cloud Infrastructure Setup</h3>
                              <p className="product-description editable-text" contentEditable="true">Scalable and secure cloud solutions for your business operations</p>
                              <div className="product-price editable-text" contentEditable="true">$2999</div>
                              <div className="product-rating">
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                              </div>
                            </div>
                            
                            <div className="product-card editable-card" data-field="product-5">
                              <div className="product-icon">
                                <div className="icon-diamond">
                                  <span className="icon-symbol editable-text" contentEditable="true">📊</span>
                                </div>
                              </div>
                              <h3 className="product-title editable-text" contentEditable="true">Data Analytics & BI</h3>
                              <p className="product-description editable-text" contentEditable="true">Transform raw data into actionable insights with powerful analytics tools</p>
                              <div className="product-price editable-text" contentEditable="true">$1799</div>
                              <div className="product-rating">
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                                <span className="star">⭐</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit-projects' && (
              <div className="live-page-editor">
                <div className="editor-header">
                  <button className="back-btn" onClick={() => setActiveTab('pages')}>← Back to Pages</button>
                  <h2>Live Page Editor - Projects Page</h2>
                  <div className="editor-tools">
                    <button className="btn-primary">Save Changes</button>
                    <button className="btn-secondary">Preview</button>
                    <button 
                      className="btn-success" 
                      onClick={publishPageContent}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                    {publishStatus === 'success' && <span className="success-message">✅ Published successfully!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Publish failed</span>}
                  </div>
                </div>
                
                <div className="live-editor-content">
                  <div className="live-page-container">
                    <div className="editable-page">
                      {/* Projects Hero Section */}
                      <section className="projects-hero editable-section" data-section="projects-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                          <h1 
                            className="hero-title editable-text" 
                            data-field="projects-hero-title"
                            contentEditable="true"
                          >
                            Our Projects
                          </h1>
                        </div>
                      </section>

                      {/* Projects Content Section */}
                      <section className="projects-content-section editable-section" data-section="projects-content">
                        <div className="container">
                          <div className="projects-header">
                            <span 
                              className="projects-subtitle editable-text" 
                              data-field="projects-subtitle"
                              contentEditable="true"
                            >
                              OUR PROJECTS
                            </span>
                            <h2 
                              className="projects-title editable-text" 
                              data-field="projects-title"
                              contentEditable="true"
                            >
                              Showcasing Our Latest Work
                            </h2>
                            <div className="projects-underline">
                              <div className="underline-line"></div>
                              <div className="underline-dot"></div>
                              <div className="underline-line"></div>
                            </div>
                            <p 
                              className="projects-description editable-text" 
                              data-field="projects-description"
                              contentEditable="true"
                            >
                              Explore our portfolio of successful projects and see how we've helped businesses achieve their goals.
                            </p>
                          </div>

                          <div className="projects-grid">
                            <div className="project-card editable-card" data-field="project-1">
                              <div className="project-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-image-1">
                                    <div className="project-preview">
                                      <div className="laptop-icon">💻</div>
                                      <div className="code-lines">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="line"></div>
                                      </div>
                                    </div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-image-1"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content">
                                <h3 className="project-title editable-text" contentEditable="true">E-commerce Platform</h3>
                                <p className="project-description editable-text" contentEditable="true">Modern e-commerce solution with advanced features and seamless user experience.</p>
                                <div className="project-tech editable-text" contentEditable="true">React, Node.js, MongoDB</div>
                                <div className="project-status editable-text" contentEditable="true">Completed</div>
                              </div>
                            </div>
                            
                            <div className="project-card editable-card" data-field="project-2">
                              <div className="project-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-image-2">
                                    <div className="project-preview">
                                      <div className="mobile-icon">📱</div>
                                      <div className="app-screens">
                                        <div className="screen"></div>
                                        <div className="screen"></div>
                                      </div>
                                    </div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-image-2"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content">
                                <h3 className="project-title editable-text" contentEditable="true">Mobile Banking App</h3>
                                <p className="project-description editable-text" contentEditable="true">Secure mobile banking application with biometric authentication.</p>
                                <div className="project-tech editable-text" contentEditable="true">React Native, Firebase</div>
                                <div className="project-status editable-text" contentEditable="true">In Progress</div>
                              </div>
                            </div>
                            
                            <div className="project-card editable-card" data-field="project-3">
                              <div className="project-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-image-3">
                                    <div className="project-preview">
                                      <div className="dashboard-icon">📊</div>
                                      <div className="charts">
                                        <div className="chart"></div>
                                        <div className="chart"></div>
                                      </div>
                                    </div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-image-3"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content">
                                <h3 className="project-title editable-text" contentEditable="true">Analytics Dashboard</h3>
                                <p className="project-description editable-text" contentEditable="true">Real-time analytics dashboard with interactive charts and reports.</p>
                                <div className="project-tech editable-text" contentEditable="true">Vue.js, D3.js, Python</div>
                                <div className="project-status editable-text" contentEditable="true">Completed</div>
                              </div>
                            </div>
                            
                            <div className="project-card editable-card" data-field="project-4">
                              <div className="project-image">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-image-4">
                                    <div className="project-preview">
                                      <div className="cloud-icon">☁️</div>
                                      <div className="cloud-services">
                                        <div className="service"></div>
                                        <div className="service"></div>
                                        <div className="service"></div>
                                      </div>
                                    </div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-image-4"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-content">
                                <h3 className="project-title editable-text" contentEditable="true">Cloud Migration</h3>
                                <p className="project-description editable-text" contentEditable="true">Complete cloud infrastructure migration for enterprise client.</p>
                                <div className="project-tech editable-text" contentEditable="true">AWS, Docker, Kubernetes</div>
                                <div className="project-status editable-text" contentEditable="true">Completed</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Project Details Section */}
                      <section className="project-details editable-section" data-section="project-details">
                        <div className="container">
                          <div className="project-details-layout">
                            <div className="main-content">
                              <div className="project-image-large">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-large-image">
                                    <div className="business-meeting">
                                      <div className="person-1">👨‍💼</div>
                                      <div className="person-2">👩‍💼</div>
                                      <div className="handshake">🤝</div>
                                      <div className="table">📋</div>
                                      <div className="document">📊</div>
                                    </div>
                                    <div className="office-background"></div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-large-image"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="project-info">
                                <h2 
                                  className="project-title-large editable-text" 
                                  data-field="project-title-large"
                                  contentEditable="true"
                                >
                                  Featured Project
                                </h2>
                                <p 
                                  className="project-description-large editable-text" 
                                  data-field="project-description-large"
                                  contentEditable="true"
                                >
                                  This project showcases our expertise in modern web development and demonstrates our commitment to delivering high-quality solutions that meet our clients' needs.
                                </p>
                                <p 
                                  className="project-details-text editable-text" 
                                  data-field="project-details-text"
                                  contentEditable="true"
                                >
                                  Our team worked closely with the client to understand their requirements and deliver a solution that exceeded their expectations. The project involved complex integrations and custom development.
                                </p>
                              </div>
                            </div>

                            <div className="sidebar">
                              <div className="project-information-box">
                                <h3 
                                  className="info-title editable-text" 
                                  data-field="info-title"
                                  contentEditable="true"
                                >
                                  Project Information
                                </h3>
                              </div>

                              <div className="project-details-list">
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">Project Name:</span>
                                  <span className="detail-value editable-text" contentEditable="true">E-commerce Platform</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">Manager:</span>
                                  <span className="detail-value editable-text" contentEditable="true">John Doe</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">URL:</span>
                                  <span className="detail-value editable-text" contentEditable="true">www.example.com</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">Date:</span>
                                  <span className="detail-value editable-text" contentEditable="true">2024</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">Client:</span>
                                  <span className="detail-value editable-text" contentEditable="true">ABC Company</span>
                                </div>
                                <div className="detail-row">
                                  <span className="detail-label editable-text" contentEditable="true">Rating:</span>
                                  <div className="rating-stars">
                                    <span className="star">⭐</span>
                                    <span className="star">⭐</span>
                                    <span className="star">⭐</span>
                                    <span className="star">⭐</span>
                                    <span className="star">⭐</span>
                                  </div>
                                </div>
                              </div>

                              <div className="project-image-small">
                                <div className="image-upload-container">
                                  <div className="image-placeholder editable-image" data-field="project-small-image">
                                    <div className="small-project-preview">
                                      <div className="project-icon">🚀</div>
                                    </div>
                                    <div className="image-upload-overlay">
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="image-upload-input" 
                                        data-field="project-small-image"
                                      />
                                      <button className="upload-btn">📷 Upload</button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="project-name-card">
                                <h3 
                                  className="project-name editable-text" 
                                  data-field="project-name"
                                  contentEditable="true"
                                >
                                  Project Name
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}