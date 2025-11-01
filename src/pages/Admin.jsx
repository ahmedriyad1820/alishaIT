import { useState, useEffect } from 'react'
import AdminLogin from '../components/AdminLogin'
import { contactAPI, quoteAPI, orderAPI, adminAPI, pageContentAPI, imageUploadAPI, projectItemsAPI, productItemsAPI, categoriesAPI, slidersAPI, sliderConfigAPI, teamMembersAPI, blogAPI, servicesAPI } from '../api/client.js'

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
  const [projectItems, setProjectItems] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Product management state
  const [productItems, setProductItems] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductEditModal, setShowProductEditModal] = useState(false)
  const [uploadingProductImage, setUploadingProductImage] = useState(false)
  
  // Service management state
  const [services, setServices] = useState([])
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false)

  // Category management state
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showCategoryEditModal, setShowCategoryEditModal] = useState(false)

  // Team management state
  const [teamMembers, setTeamMembers] = useState([])
  const [newTeam, setNewTeam] = useState({ name: '', designation: '', photo: '', bio: '', isActive: true, order: 0, socials: { facebook: '', twitter: '', linkedin: '' } })
  const [uploadingTeamPhoto, setUploadingTeamPhoto] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState(null)
  const [teamQuery, setTeamQuery] = useState('')

  

  // Slider management state
  const [sliders, setSliders] = useState([])
  const [sliderIntervalMs, setSliderIntervalMs] = useState(30000)
  const [uploadingSliderImage, setUploadingSliderImage] = useState(false)
  
  // Page content state management
  const [pageContent, setPageContent] = useState({})
  const [editingPage, setEditingPage] = useState(null)
  const [publishStatus, setPublishStatus] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Blog management state
  const [blogs, setBlogs] = useState([])
  const [editingBlog, setEditingBlog] = useState(null)
  const [showBlogEditModal, setShowBlogEditModal] = useState(false)
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false)

  // Check if user is already authenticated (via session cookie)
  useEffect(() => {
    (async () => {
      try {
        const res = await adminAPI.me()
        if (res.success) {
          setIsAuthenticated(true)
          loadDashboardData()
        } else {
          setIsAuthenticated(false)
        }
      } catch (_) {
        setIsAuthenticated(false)
      }
    })()
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
      await loadDashboardData()
    }
  }

  const handleLogout = async () => {
    try { await adminAPI.logout() } catch (_) {}
    setIsAuthenticated(false)
    setActiveTab('dashboard')
    setStats({ totalContacts: 0, totalQuotes: 0, totalOrders: 0, totalRevenue: 0 })
    setContacts([])
    setQuotes([])
    setOrders([])
    setProjectItems([])
    setPageContent({})
    setEditingPage(null)
    setPublishStatus('')
  }

  // Projects load/create helpers
  const loadProjects = async () => {
    try {
      const res = await projectItemsAPI.list()
      if (res.success) setProjectItems(res.data)
    } catch (e) { console.error('Load projects failed', e) }
  }

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await projectItemsAPI.delete(id)
      if (res.success) {
        await loadProjects()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error deleting project:', e)
    }
  }

  const editProject = (project) => {
    setEditingProject(project)
    setShowEditModal(true)
  }

  const createProject = async (item) => {
    try {
      console.log('Creating project:', item)
      const res = await projectItemsAPI.create(item)
      console.log('Create project response:', res)
      if (res.success) {
        await loadProjects()
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
        // Clear form
        document.getElementById('p-title').value = ''
        document.getElementById('p-manager').value = ''
        document.getElementById('p-client').value = ''
        document.getElementById('p-url').value = ''
        document.getElementById('p-icon').value = '🚀'
        document.getElementById('p-image').value = ''
        document.getElementById('p-image-url').value = ''
        document.getElementById('p-date').value = ''
        document.getElementById('p-rating').value = '5'
        document.getElementById('p-desc').value = ''
      } else {
        setPublishStatus('error')
        console.error('Failed to create project:', res.error)
        alert('Failed to create project: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error creating project:', e)
      alert('Error creating project: ' + e.message)
    }
  }

  const uploadProjectImage = async (file) => {
    try {
      setUploadingImage(true)
      const result = await imageUploadAPI.upload(file)
      if (result.success) {
        return result.data.url
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image: ' + error.message)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Team helpers
  const loadTeam = async () => {
    try {
      const res = await teamMembersAPI.list(false)
      if (res.success) setTeamMembers(res.data)
    } catch (e) { console.error('Load team failed', e) }
  }

  const uploadTeamImage = async (file) => {
    try {
      setUploadingTeamPhoto(true)
      const result = await imageUploadAPI.upload(file)
      if (result.success) return result.data.url
      throw new Error(result.error || 'Upload failed')
    } catch (e) {
      alert('Failed to upload image: ' + e.message)
      return ''
    } finally {
      setUploadingTeamPhoto(false)
    }
  }

  const createTeamMember = async () => {
    if (!newTeam.name || !newTeam.designation) {
      alert('Name and designation are required')
      return
    }
    const payload = { ...newTeam, order: Number(newTeam.order) || 0 }
    if (editingTeamId) {
      const res = await teamMembersAPI.update(editingTeamId, payload)
      if (!res.success) return alert(res.error || 'Failed to update team member')
    } else {
      const res = await teamMembersAPI.create(payload)
      if (!res.success) return alert(res.error || 'Failed to create team member')
    }
    setNewTeam({ name: '', designation: '', photo: '', bio: '', isActive: true, order: 0, socials: { facebook: '', twitter: '', linkedin: '' } })
    setEditingTeamId(null)
    await loadTeam()
  }

  const toggleTeamActive = async (member) => {
    const res = await teamMembersAPI.update(member._id, { isActive: !member.isActive })
    if (res.success) await loadTeam()
  }

  const changeOrder = async (member, delta) => {
    const newOrder = (member.order || 0) + delta
    const res = await teamMembersAPI.update(member._id, { order: newOrder })
    if (res.success) await loadTeam()
  }

  const deleteTeamMember = async (id) => {
    if (!confirm('Delete this team member?')) return
    const res = await teamMembersAPI.delete(id)
    if (res.success) await loadTeam()
  }

  const startEditTeam = (m) => {
    setEditingTeamId(m._id)
    setNewTeam({
      name: m.name || '',
      designation: m.designation || '',
      photo: m.photo || '',
      bio: m.bio || '',
      isActive: !!m.isActive,
      order: m.order || 0,
      socials: {
        facebook: m.socials?.facebook || '',
        twitter: m.socials?.twitter || '',
        linkedin: m.socials?.linkedin || ''
      }
    })
  }

  // Blogs management was removed per requirements

  const updateProject = async (updatedData) => {
    try {
      const res = await projectItemsAPI.update(editingProject._id, updatedData)
      if (res.success) {
        await loadProjects()
        setShowEditModal(false)
        setEditingProject(null)
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error updating project:', e)
    }
  }

  // Products load/create helpers
  const loadProducts = async () => {
    try {
      const res = await productItemsAPI.list()
      if (res.success) setProductItems(res.data)
    } catch (e) { console.error('Load products failed', e) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const res = await productItemsAPI.delete(id)
      if (res.success) {
        await loadProducts()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error deleting product:', e)
    }
  }

  // Services load/create/update/delete helpers
  const loadServices = async () => {
    try {
      const res = await servicesAPI.list()
      if (res.success) setServices(res.data)
    } catch (e) { console.error('Load services failed', e) }
  }

  const createService = async (item) => {
    try {
      console.log('Creating service:', item)
      const res = await servicesAPI.create(item)
      console.log('Create service response:', res)
      if (res.success) {
        await loadServices()
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
        console.error('Failed to create service:', res.error)
        alert('Failed to create service: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error creating service:', e)
      alert('Error creating service: ' + (e.message || 'Unknown error'))
    }
  }

  const updateService = async (id, item) => {
    try {
      const res = await servicesAPI.update(id, item)
      if (res.success) {
        // Update local state immediately for iconImage changes
        if (item.iconImage !== undefined) {
          setServices(prev => prev.map(s => s._id === id ? { ...s, ...item, updatedAt: new Date().toISOString() } : s))
        }
        // Reload from server to get all latest data
        await loadServices()
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error updating service:', e)
    }
  }

  const deleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      const res = await servicesAPI.delete(id)
      if (res.success) {
        await loadServices()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error deleting service:', e)
    }
  }

  const uploadServiceImage = async (file) => {
    try {
      setUploadingServiceImage(true)
      const res = await imageUploadAPI.upload(file)
      if (res.success) return res.data.url
    } catch (e) {
      console.error('Service image upload failed', e)
    } finally {
      setUploadingServiceImage(false)
    }
    return ''
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setShowProductEditModal(true)
  }

  const createProduct = async (item) => {
    try {
      console.log('Creating product:', item)
      const res = await productItemsAPI.create(item)
      console.log('Create product response:', res)
      if (res.success) {
        await loadProducts()
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
        // Clear form
        document.getElementById('prod-title').value = ''
        document.getElementById('prod-price').value = ''
        document.getElementById('prod-category').value = ''
        document.getElementById('prod-features').value = ''
        document.getElementById('prod-specifications').value = ''
        document.getElementById('prod-availability').value = 'In Stock'
        document.getElementById('prod-icon').value = '📦'
        document.getElementById('prod-image').value = ''
        document.getElementById('prod-image-url').value = ''
        document.getElementById('prod-rating').value = '5'
        document.getElementById('prod-desc').value = ''
      } else {
        setPublishStatus('error')
        console.error('Failed to create product:', res.error)
        alert('Failed to create product: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error creating product:', e)
      alert('Error creating product: ' + e.message)
    }
  }

  const uploadProductImage = async (file) => {
    try {
      setUploadingProductImage(true)
      const result = await imageUploadAPI.upload(file)
      if (result.success) {
        return result.data.url
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to upload image: ' + error.message)
      return null
    } finally {
      setUploadingProductImage(false)
    }
  }

  const updateProduct = async (updatedData) => {
    try {
      const res = await productItemsAPI.update(editingProduct._id, updatedData)
      if (res.success) {
        await loadProducts()
        setShowProductEditModal(false)
        setEditingProduct(null)
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error updating product:', e)
    }
  }

  // Categories load/create helpers
  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.listAll()
      if (res.success) setCategories(res.data)
    } catch (e) { console.error('Load categories failed', e) }
  }

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      const res = await categoriesAPI.delete(id)
      if (res.success) {
        await loadCategories()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
        alert(res.error || 'Failed to delete category')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error deleting category:', e)
    }
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setShowCategoryEditModal(true)
  }

  const createCategory = async (categoryData) => {
    try {
      console.log('Creating category:', categoryData)
      const res = await categoriesAPI.create(categoryData)
      console.log('Create category response:', res)
      if (res.success) {
        await loadCategories()
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
        // Clear form
        document.getElementById('cat-name').value = ''
        document.getElementById('cat-description').value = ''
        document.getElementById('cat-icon').value = '📁'
        document.getElementById('cat-color').value = '#3B82F6'
      } else {
        setPublishStatus('error')
        console.error('Failed to create category:', res.error)
        alert('Failed to create category: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error creating category:', e)
      alert('Error creating category: ' + e.message)
    }
  }

  const updateCategory = async (updatedData) => {
    try {
      const res = await categoriesAPI.update(editingCategory._id, updatedData)
      if (res.success) {
        await loadCategories()
        setShowCategoryEditModal(false)
        setEditingCategory(null)
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error updating category:', e)
    }
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

  // Utility: dash-case to camelCase
  const dashToCamel = (str) => str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

  // Capture current editable DOM into structured sections for the current page
  const capturePageEditsToState = () => {
    if (!editingPage) return {}
    const root = document.querySelector('.editable-page')
    if (!root) return {}

    const sections = {}
    root.querySelectorAll('.editable-section').forEach((sectionEl) => {
      const rawSection = sectionEl.getAttribute('data-section') || 'content'
      // normalize: strip page prefix like `about-hero` -> `hero`
      const sectionName = rawSection.startsWith(editingPage + '-')
        ? rawSection.substring(editingPage.length + 1)
        : rawSection
      const normalizedSection = sectionName.includes('-') ? dashToCamel(sectionName) : sectionName
      // Map sections to what public pages read
      let targetSection = normalizedSection
      if (['services', 'products', 'projects'].includes(editingPage)) {
        if (['hero', 'servicesContent', 'productsContent', 'projectsContent', 'content'].includes(normalizedSection)) {
          targetSection = 'header'
        }
      } else if (editingPage === 'contact') {
        if (normalizedSection.includes('info') || normalizedSection === 'content' || normalizedSection === 'contactContent') {
          targetSection = 'info'
        } else if (normalizedSection === 'hero') {
          targetSection = 'hero'
        }
      }

      sections[targetSection] = sections[targetSection] || {}
      // Preserve existing data for sections that have arrays/objects (like FAQ questions)
      if (pageContent[targetSection]) {
        Object.keys(pageContent[targetSection]).forEach(key => {
          if (Array.isArray(pageContent[targetSection][key]) || (typeof pageContent[targetSection][key] === 'object' && pageContent[targetSection][key] !== null)) {
            sections[targetSection][key] = pageContent[targetSection][key]
          }
        })
      }

      sectionEl.querySelectorAll('[data-field]').forEach((fieldEl) => {
        const rawField = fieldEl.getAttribute('data-field') || ''
        let key = rawField
        if (key.startsWith(editingPage + '-')) {
          key = key.substring(editingPage.length + 1)
        }
        key = dashToCamel(key)
        let value = fieldEl.tagName === 'IMG' ? (fieldEl.getAttribute('src') || '').trim() : (fieldEl.textContent || '').trim()
        // Normalize image URLs to relative path so public site can prefix API host
        if (fieldEl.tagName === 'IMG' && value) {
          value = value.replace(/^https?:\/\/localhost:3001/i, '')
        }
        // Special mapping: About page hero "About Us" -> hero.title (not heroTitle)
        if (editingPage === 'about' && targetSection === 'hero' && key === 'heroTitle') {
          key = 'title'
        }
        if (value !== '') {
          sections[targetSection][key] = value
        }
      })
    })

    // Deep merge sections into pageContent to preserve arrays/objects
    const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item)
    const mergeSections = (target, source) => {
      const output = { ...target }
      Object.keys(source).forEach(key => {
        if (Array.isArray(source[key])) {
          output[key] = source[key] // Arrays replace entirely from source
        } else if (isObject(source[key]) && isObject(target[key])) {
          // Deep merge objects to preserve arrays inside (like FAQ.questions)
          output[key] = { ...target[key], ...source[key] }
          // Preserve arrays from target if not in source
          Object.keys(target[key]).forEach(subKey => {
            if (Array.isArray(target[key][subKey]) && !source[key][subKey]) {
              output[key][subKey] = target[key][subKey]
            }
          })
        } else {
          output[key] = source[key]
        }
      })
      return output
    }
    
    setPageContent((prev) => mergeSections(prev, sections))
    return sections
  }

  // Publish page content
  const publishPageContent = async () => {
    // Capture any in-progress edits from the DOM first
    const latestSections = capturePageEditsToState()
    // Ensure any in-progress contentEditable field commits its value
    try {
      if (document && document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur()
      }
    } catch (_) {}

    if (!editingPage) return
    
    // Deep merge function to preserve nested objects and arrays
    const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item)
    const deepMerge = (target, source) => {
      const output = { ...target }
      if (isObject(target) && isObject(source)) {
        // First, preserve all keys from target that aren't in source (like FAQ.questions)
        Object.keys(target).forEach(key => {
          if (!(key in source)) {
            output[key] = target[key]
          }
        })
        // Then merge source into output
        Object.keys(source).forEach(key => {
          if (Array.isArray(source[key])) {
            output[key] = source[key] // Arrays replace entirely
          } else if (isObject(source[key]) && isObject(target[key])) {
            // Deep merge nested objects, preserving arrays in target
            const nestedMerged = { ...target[key] }
            Object.keys(source[key]).forEach(subKey => {
              if (Array.isArray(source[key][subKey])) {
                nestedMerged[subKey] = source[key][subKey]
              } else if (isObject(source[key][subKey]) && isObject(target[key][subKey])) {
                nestedMerged[subKey] = deepMerge(target[key][subKey], source[key][subKey])
              } else {
                nestedMerged[subKey] = source[key][subKey]
              }
            })
            // Preserve arrays from target that weren't in source
            Object.keys(target[key]).forEach(subKey => {
              if (Array.isArray(target[key][subKey]) && !(subKey in source[key])) {
                nestedMerged[subKey] = target[key][subKey]
              }
            })
            output[key] = nestedMerged
          } else {
            output[key] = source[key]
          }
        })
      }
      return output
    }
    
    const mergedContent = deepMerge(pageContent, latestSections)
    console.log('Publishing page content:', { editingPage, sections: mergedContent })
    setIsPublishing(true)
    setPublishStatus('')
    
    try {
      const result = await pageContentAPI.update(editingPage, mergedContent, true)
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

  const handleSaveDraft = () => {
    capturePageEditsToState()
    setPublishStatus('saved')
    setTimeout(() => setPublishStatus(''), 2500)
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

  // Slider helpers
  const loadSliders = async () => {
    try {
      const res = await slidersAPI.list(false)
      if (res?.success) {
        setSliders(res.data || [])
      } else {
        console.error('Load sliders failed:', res?.error)
        setSliders([])
      }
    } catch (error) {
      console.error('Error loading sliders:', error)
      setSliders([])
    }
  }

  const loadSliderConfig = async () => {
    try {
      const res = await sliderConfigAPI.get()
      if (res?.success) {
        setSliderIntervalMs(res.data?.intervalMs || 30000)
      } else {
        console.error('Load slider config failed:', res?.error)
        setSliderIntervalMs(30000)
      }
    } catch (error) {
      console.error('Error loading slider config:', error)
      setSliderIntervalMs(30000)
    }
  }

  // Blog management functions
  const loadBlogs = async () => {
    try {
      const res = await blogAPI.list(false)
      if (res.success) setBlogs(res.data || [])
    } catch (e) { 
      console.error('Load blogs failed', e)
      setBlogs([])
    }
  }

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    try {
      const res = await blogAPI.delete(id)
      if (res.success) {
        await loadBlogs()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        setPublishStatus('error')
        setTimeout(() => setPublishStatus(''), 2000)
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error deleting blog:', e)
      setTimeout(() => setPublishStatus(''), 2000)
    }
  }

  const editBlog = (blog) => {
    setEditingBlog(blog)
    setShowBlogEditModal(true)
  }

  const uploadBlogImage = async (file) => {
    try {
      setUploadingBlogImage(true)
      const result = await imageUploadAPI.upload(file)
      if (result.success) return result.data.url
      throw new Error(result.error || 'Upload failed')
    } catch (e) {
      alert('Failed to upload image: ' + e.message)
      return ''
    } finally {
      setUploadingBlogImage(false)
    }
  }

  const createBlog = async (blogData) => {
    try {
      const res = await blogAPI.create(blogData)
      if (res.success) {
        await loadBlogs()
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
        // Clear form
        document.getElementById('blog-title').value = ''
        document.getElementById('blog-excerpt').value = ''
        document.getElementById('blog-content').value = ''
        document.getElementById('blog-category').value = ''
        document.getElementById('blog-author').value = ''
        
        document.getElementById('blog-image').value = ''
        document.getElementById('blog-image-url').value = ''
        document.getElementById('blog-published').checked = false
        document.getElementById('blog-order').value = '0'
      } else {
        setPublishStatus('error')
        alert('Failed to create blog: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error creating blog:', e)
      alert('Error creating blog: ' + e.message)
    }
  }

  const updateBlog = async (id, blogData) => {
    try {
      const res = await blogAPI.update(id, blogData)
      if (res.success) {
        await loadBlogs()
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
        setShowBlogEditModal(false)
        setEditingBlog(null)
      } else {
        setPublishStatus('error')
        alert('Failed to update blog: ' + (res.error || 'Unknown error'))
      }
    } catch (e) {
      setPublishStatus('error')
      console.error('Error updating blog:', e)
      alert('Error updating blog: ' + e.message)
    }
  }

  // Helper function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const createSlider = async () => {
    try {
      const title = document.getElementById('slider-title').value.trim()
      const caption = document.getElementById('slider-caption').value.trim()
      const image = document.getElementById('slider-image-url').value.trim()
      const link = document.getElementById('slider-link').value.trim()
      const order = Number(document.getElementById('slider-order').value || 0)
      const isActive = document.getElementById('slider-active').checked
      
      if (!image) {
        alert('Please upload an image')
        return
      }
      
      const res = await slidersAPI.create({ title, caption, image, link, order, isActive })
      
      if (res?.success) {
        await loadSliders()
        // Reset form fields
        document.getElementById('slider-title').value = ''
        document.getElementById('slider-caption').value = ''
        document.getElementById('slider-link').value = ''
        document.getElementById('slider-order').value = '0'
        document.getElementById('slider-active').checked = true
        document.getElementById('slider-image').value = ''
        document.getElementById('slider-image-url').value = ''
        
        setPublishStatus('saved')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        console.error('Create slider failed:', res?.error)
        setPublishStatus('error')
        setTimeout(() => setPublishStatus(''), 2000)
      }
    } catch (error) {
      console.error('Error creating slider:', error)
      setPublishStatus('error')
      setTimeout(() => setPublishStatus(''), 2000)
    }
  }

  const deleteSlider = async (id) => {
    if (!confirm('Delete this slide?')) return
    
    try {
      const res = await slidersAPI.delete(id)
      if (res?.success) {
        await loadSliders()
        setPublishStatus('deleted')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        console.error('Delete slider failed:', res?.error)
        setPublishStatus('error')
        setTimeout(() => setPublishStatus(''), 2000)
      }
    } catch (error) {
      console.error('Error deleting slider:', error)
      setPublishStatus('error')
      setTimeout(() => setPublishStatus(''), 2000)
    }
  }

  const updateSliderInterval = async () => {
    try {
      const val = Number(document.getElementById('slider-interval').value)
      if (val < 3000) {
        alert('Minimum interval is 3000ms (3 seconds)')
        return
      }
      
      const res = await sliderConfigAPI.update(val)
      if (res?.success) {
        setSliderIntervalMs(res.data.intervalMs)
        setPublishStatus('updated')
        setTimeout(() => setPublishStatus(''), 2000)
      } else {
        console.error('Update slider config failed:', res?.error)
        setPublishStatus('error')
        setTimeout(() => setPublishStatus(''), 2000)
      }
    } catch (error) {
      console.error('Error updating slider config:', error)
      setPublishStatus('error')
      setTimeout(() => setPublishStatus(''), 2000)
    }
  }

  const uploadSliderImage = async (file) => {
    try {
      setUploadingSliderImage(true)
      const res = await imageUploadAPI.upload(file)
      setUploadingSliderImage(false)
      
      if (res?.success) {
        return res.data.url
      } else {
        console.error('Image upload failed:', res?.error)
        alert('Upload failed: ' + (res?.error || 'Unknown error'))
        return ''
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadingSliderImage(false)
      alert('Upload failed: ' + error.message)
      return ''
    }
  }

  // Generic image upload handler for page editor
  const handlePageImageUpload = async (file, fieldPath, targetElement) => {
    try {
      const res = await imageUploadAPI.upload(file)
      if (res?.success) {
        // Update page content
        const newPageContent = { ...pageContent }
        const pathParts = fieldPath.split('-')
        let current = newPageContent
        
        // Navigate to the correct nested object
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {}
          }
          current = current[pathParts[i]]
        }
        
        // Set the image URL
        current[pathParts[pathParts.length - 1]] = res.data.url
        
        setPageContent(newPageContent)
        
        // Update the visual display
        if (targetElement) {
          const imgContainer = targetElement.closest('.image-placeholder') || targetElement.closest('.team-image')
          if (imgContainer) {
            const imgElement = imgContainer.querySelector('.professional-image') || 
                              imgContainer.querySelector('.person-avatar') ||
                              imgContainer.querySelector('.team-avatar')
            
            if (imgElement) {
              imgElement.style.backgroundImage = `url(http://localhost:3001${res.data.url})`
              imgElement.style.backgroundSize = 'cover'
              imgElement.style.backgroundPosition = 'center'
              
              // Hide emoji/icon overlays
              const iconElement = imgElement.querySelector('.person-icon') || 
                                 imgElement.querySelector('.person-avatar') ||
                                 imgElement.querySelector('.team-avatar')
              if (iconElement) {
                iconElement.style.display = 'none'
              }
            }
          }
        }
        
        alert('Image uploaded successfully!')
        return res.data.url
      } else {
        alert('Upload failed: ' + (res?.error || 'Unknown error'))
        return ''
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Upload failed: ' + error.message)
      return ''
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
                  className={`sidebar-item ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('projects'); loadProjects() }}
                >
                  <span className="sidebar-icon">🚀</span>
                  <span className="sidebar-text">Projects</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('products'); loadProducts(); loadCategories(); }}
                >
                  <span className="sidebar-icon">📦</span>
                  <span className="sidebar-text">Products</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'services' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('services'); loadServices(); }}
                >
                  <span className="sidebar-icon">🛠️</span>
                  <span className="sidebar-text">Services</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'categories' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('categories'); loadCategories() }}
                >
                  <span className="sidebar-icon">📁</span>
                  <span className="sidebar-text">Categories</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('team'); loadTeam() }}
                >
                  <span className="sidebar-icon">👥</span>
                  <span className="sidebar-text">Team</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'sliders' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('sliders'); loadSliders(); loadSliderConfig(); }}
                >
                  <span className="sidebar-icon">🖼️</span>
                  <span className="sidebar-text">Sliders</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'blogs' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('blogs'); loadBlogs(); }}
                >
                  <span className="sidebar-icon">📝</span>
                  <span className="sidebar-text">Blogs</span>
                </button>
                <button 
                  className={`sidebar-item ${activeTab === 'pages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pages')}
                >
                  <span className="sidebar-icon">📄</span>
                  <span className="sidebar-text">Pages</span>
                </button>
                {null}
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

            {null}

            {activeTab === 'team' && (
              <div className="team-admin">
                <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <h2>Team Management</h2>
                  <div className="section-sub" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="text"
                      placeholder="Search team..."
                      value={teamQuery}
                      onChange={(e) => setTeamQuery(e.target.value)}
                      style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}
                    />
                    <span>Total: {teamMembers.length}</span>
                    {editingTeamId && <button className="secondary-btn" onClick={() => { setEditingTeamId(null); setNewTeam({ name: '', designation: '', photo: '', bio: '', isActive: true, order: 0, socials: { facebook: '', twitter: '', linkedin: '' } }) }}>Cancel edit</button>}
                  </div>
                </div>
                <div className="editor-grid">
                  <div className="add-product-card">
                    <div className="card-header">
                      <h3>{editingTeamId ? '✏️ Edit Team Member' : '➕ Add Team Member'}</h3>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="Full name" />
                      </div>
                      <div className="form-group">
                        <label>Designation</label>
                        <input type="text" value={newTeam.designation} onChange={(e) => setNewTeam({ ...newTeam, designation: e.target.value })} placeholder="Designation" />
                      </div>
                      <div className="form-group">
                        <label>Bio</label>
                        <textarea value={newTeam.bio} onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })} placeholder="Short bio" />
                      </div>
                    <div className="form-group">
                      <label>Upload Photo</label>
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          const url = await uploadTeamImage(f)
                          if (url) setNewTeam({ ...newTeam, photo: url })
                        }} />
                        {uploadingTeamPhoto && <div>Uploading...</div>}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn-success" onClick={createTeamMember}>{editingTeamId ? 'Save Changes' : 'Add Team Member'}</button>
                      {editingTeamId && (
                        <button className="btn-secondary" onClick={() => { setEditingTeamId(null); setNewTeam({ name: '', designation: '', photo: '', bio: '', isActive: true, order: 0, socials: { facebook: '', twitter: '', linkedin: '' } }) }}>Cancel</button>
                      )}
                    </div>
                  </div>

                  <div className="products-table-card">
                    <div className="card-header">
                      <h3>📋 Team List</h3>
                      <div className="header-actions">
                        <button className="btn-secondary" onClick={loadTeam}><span>🔄</span> Reload</button>
                      </div>
                    </div>
                    <div className="table-container">
                      <table className="products-table">
                        <thead>
                          <tr>
                            <th style={{ width: 80 }}>Order</th>
                            <th style={{ width: 72 }}>Photo</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Socials</th>
                            <th style={{ width: 120 }}>Active</th>
                            <th style={{ width: 220 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers
                            .filter(m => (m.name + ' ' + m.designation).toLowerCase().includes(teamQuery.toLowerCase()))
                            .map(m => (
                            <tr key={m._id}>
                              <td>
                                <button onClick={() => changeOrder(m, -1)}>▲</button>
                                <span style={{ margin: '0 8px' }}>{m.order || 0}</span>
                                <button onClick={() => changeOrder(m, 1)}>▼</button>
                              </td>
                              <td>
                                {m.photo ? (
                                  <img src={m.photo} alt={m.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                  <div className="no-image">No</div>
                                )}
                              </td>
                              <td>{m.name}</td>
                              <td>{m.designation}</td>
                              <td>
                                <div className="team-socials">
                                  {m.socials?.facebook && <a href={m.socials.facebook} target="_blank" rel="noreferrer">Fb</a>}
                                  {m.socials?.twitter && <a href={m.socials.twitter} target="_blank" rel="noreferrer">Tw</a>}
                                  {m.socials?.linkedin && <a href={m.socials.linkedin} target="_blank" rel="noreferrer">In</a>}
                                </div>
                              </td>
                              <td>
                                <button className={`toggle-btn ${m.isActive ? 'on' : 'off'}`} onClick={() => toggleTeamActive(m)}>
                                  {m.isActive ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td>
                                <button className="secondary-btn" onClick={() => startEditTeam(m)}>Edit</button>
                                <button className="btn-danger" onClick={() => deleteTeamMember(m._id)} style={{ marginLeft: 8 }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

            {activeTab === 'projects' && (
              <div className="projects-management">
                <div className="section-header">
                  <h2>🚀 Projects Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={loadProjects}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Project saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Project updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Project deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-project-card">
                  <div className="card-header">
                    <h3>➕ Add New Project</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Project Title *</label>
                      <input id="p-title" placeholder="Enter project title" />
                    </div>
                    <div className="form-group">
                      <label>Manager</label>
                      <input id="p-manager" placeholder="Project manager name" />
                    </div>
                    <div className="form-group">
                      <label>Client</label>
                      <input id="p-client" placeholder="Client company name" />
                    </div>
                    <div className="form-group">
                      <label>Project URL</label>
                      <input id="p-url" placeholder="https://example.com" />
                    </div>
                    <div className="form-group">
                      <label>Project Image</label>
                      <input 
                        id="p-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const imageUrl = await uploadProjectImage(file)
                            if (imageUrl) {
                              document.getElementById('p-image-url').value = imageUrl
                            }
                          }
                        }}
                      />
                      <input id="p-image-url" type="hidden" />
                      {uploadingImage && <div className="upload-status">📤 Uploading...</div>}
                    </div>
                    <div className="form-group">
                      <label>Icon</label>
                      <input id="p-icon" placeholder="🚀" defaultValue="🚀" />
                    </div>
                    <div className="form-group">
                      <label>Completion Date *</label>
                      <input id="p-date" type="date" />
                    </div>
                    <div className="form-group">
                      <label>Rating</label>
                      <input id="p-rating" type="number" min="1" max="5" defaultValue="5" />
                    </div>
                    <div className="form-group full-width">
                      <label>Description *</label>
                      <textarea id="p-desc" placeholder="Project description..." rows="3"></textarea>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={async () => {
                      console.log('Testing API connection...')
                      try {
                        const result = await projectItemsAPI.list()
                        console.log('API test result:', result)
                        alert('API connection working! Found ' + result.data.length + ' projects.')
                      } catch (e) {
                        console.error('API test failed:', e)
                        alert('API connection failed: ' + e.message)
                      }
                    }}>
                      Test API
                    </button>
                    <button className="btn-success" onClick={async()=>{
                      const title = document.getElementById('p-title').value.trim()
                      const description = document.getElementById('p-desc').value.trim()
                      const date = document.getElementById('p-date').value
                      
                      console.log('Form data:', { title, description, date })
                      
                      if (!title || !description || !date) {
                        alert('Please fill in Title, Description, and Date')
                        return
                      }
                      
                      const item={
                        title,
                        description,
                        icon: document.getElementById('p-icon').value.trim()||'🚀',
                        image: document.getElementById('p-image-url').value.trim(),
                        manager: document.getElementById('p-manager').value.trim(),
                        url: document.getElementById('p-url').value.trim(),
                        date,
                        client: document.getElementById('p-client').value.trim(),
                        rating: parseInt(document.getElementById('p-rating').value||'5',10)
                      }
                      
                      console.log('Creating project with data:', item)
                      await createProject(item)
                    }}>
                      <span>➕</span> Add Project
                    </button>
                  </div>
                </div>

                <div className="projects-table-card">
                  <div className="card-header">
                    <h3>📋 Projects List ({projectItems.length})</h3>
                  </div>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Icon</th>
                          <th>Title</th>
                          <th>Date</th>
                          <th>Manager</th>
                          <th>Client</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectItems.map(p => (
                          <tr key={p._id}>
                            <td>
                              {p.image ? (
                                <img src={`http://localhost:3001${p.image}`} alt={p.title} className="project-thumbnail" />
                              ) : (
                                <div className="no-image">📷</div>
                              )}
                            </td>
                            <td><span className="project-icon">{p.icon}</span></td>
                            <td className="project-title">{p.title}</td>
                            <td>{new Date(p.date).toLocaleDateString()}</td>
                            <td>{p.manager || '-'}</td>
                            <td>{p.client || '-'}</td>
                            <td>
                              <div className="rating-stars">
                                {[...Array(p.rating || 5)].map((_, i) => (
                                  <span key={i} className="star">⭐</span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-edit" 
                                  onClick={() => editProject(p)}
                                  title="Edit Project"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-delete" 
                                  onClick={() => deleteProject(p._id)}
                                  title="Delete Project"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {projectItems.length === 0 && (
                      <div className="empty-state">
                        <p>No projects found. Add your first project above!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-management">
                <div className="section-header">
                  <h2>📦 Products Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={loadProducts}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Product saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Product updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Product deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-product-card">
                  <div className="card-header">
                    <h3>➕ Add New Product</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Title *</label>
                      <input id="prod-title" placeholder="Enter product title" />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input id="prod-price" placeholder="e.g., $99.99" />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select id="prod-category">
                        <option value="">Select Category</option>
                        {categories.filter(cat => cat.isActive).map(category => (
                          <option key={category._id} value={category.name}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Availability</label>
                      <select id="prod-availability">
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Pre-order">Pre-order</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Product Image</label>
                      <input 
                        id="prod-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const imageUrl = await uploadProductImage(file)
                            if (imageUrl) {
                              document.getElementById('prod-image-url').value = imageUrl
                            }
                          }
                        }}
                      />
                      <input id="prod-image-url" type="hidden" />
                      {uploadingProductImage && <div className="upload-status">Uploading...</div>}
                    </div>
                    <div className="form-group">
                      <label>Icon</label>
                      <input id="prod-icon" placeholder="📦" defaultValue="📦" />
                    </div>
                    <div className="form-group">
                      <label>Rating</label>
                      <select id="prod-rating">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Description *</label>
                      <textarea id="prod-desc" placeholder="Enter product description" rows="3"></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>Features (one per line)</label>
                      <textarea id="prod-features" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" rows="3"></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>Specifications</label>
                      <textarea id="prod-specifications" placeholder="Technical specifications" rows="3"></textarea>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button 
                      className="btn-success" 
                      onClick={() => {
                        const title = document.getElementById('prod-title').value.trim()
                        const description = document.getElementById('prod-desc').value.trim()
                        const price = document.getElementById('prod-price').value.trim()
                        const category = document.getElementById('prod-category').value.trim()
                        const features = document.getElementById('prod-features').value.trim().split('\n').filter(f => f.trim())
                        const specifications = document.getElementById('prod-specifications').value.trim()
                        const availability = document.getElementById('prod-availability').value
                        const icon = document.getElementById('prod-icon').value.trim() || '📦'
                        const image = document.getElementById('prod-image-url').value
                        const rating = parseInt(document.getElementById('prod-rating').value)

                        if (!title || !description) {
                          alert('Title and description are required')
                          return
                        }

                        createProduct({
                          title,
                          description,
                          price,
                          category,
                          features,
                          specifications,
                          availability,
                          icon,
                          image,
                          rating
                        })
                      }}
                    >
                      Add Product
                    </button>
                  </div>
                </div>

                <div className="products-table-card">
                  <div className="card-header">
                    <h3>📋 Products List</h3>
                  </div>
                  <div className="table-container">
                    {productItems.length === 0 ? (
                      <div className="empty-state">
                        <p>No products found. Add your first product above!</p>
                      </div>
                    ) : (
                      <table className="products-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Icon</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Availability</th>
                            <th>Rating</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productItems.map((product) => (
                            <tr key={product._id}>
                              <td>
                                {product.image ? (
                                  <img 
                                    src={`http://localhost:3001${product.image}`} 
                                    alt={product.title}
                                    className="product-thumbnail"
                                  />
                                ) : (
                                  <div className="no-image">No Image</div>
                                )}
                              </td>
                              <td>
                                <span className="product-icon">{product.icon}</span>
                              </td>
                              <td>
                                <div className="product-title">{product.title}</div>
                                <div className="product-description">{product.description}</div>
                              </td>
                              <td>{product.price || 'N/A'}</td>
                              <td>{product.category || 'N/A'}</td>
                              <td>{product.availability}</td>
                              <td>
                                <div className="rating-stars">
                                  {[...Array(product.rating)].map((_, i) => (
                                    <span key={i} className="star">⭐</span>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    className="btn-edit" 
                                    onClick={() => editProduct(product)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="btn-delete" 
                                    onClick={() => deleteProduct(product._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="services-management">
                <div className="section-header">
                  <h2>🛠️ Services Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={loadServices}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Service saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Service updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Service deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-service-card">
                  <div className="card-header">
                    <h3>➕ Add New Service</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title *</label>
                      <input id="svc-title" placeholder="Service title" />
                    </div>
                    <div className="form-group">
                      <label>Icon (Emoji or Upload Image)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div id="svc-icon-preview" style={{ 
                          width: '48px', 
                          height: '48px', 
                          minWidth: '48px',
                          minHeight: '48px',
                          border: '2px solid #ddd', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          fontSize: '24px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <span id="svc-icon-preview-emoji" style={{ display: 'block' }}>🛠️</span>
                          <img id="svc-icon-preview-img" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'none', maxWidth: '48px', maxHeight: '48px' }} alt="Icon preview" />
                        </div>
                        <input 
                          id="svc-icon" 
                          placeholder="e.g., 🛡️" 
                          onChange={(e) => {
                            const emoji = e.target.value.trim()
                            const previewEmoji = document.getElementById('svc-icon-preview-emoji')
                            const previewImg = document.getElementById('svc-icon-preview-img')
                            const iconImageUrl = document.getElementById('svc-icon-image-url').value
                            console.log('Emoji changed:', emoji, 'Has image URL:', !!iconImageUrl)
                            // Only show emoji if no image is uploaded
                            if (!iconImageUrl) {
                              const displayEmoji = emoji || '🛠️'
                              previewEmoji.textContent = displayEmoji
                              previewEmoji.style.display = 'block'
                              previewImg.style.display = 'none'
                              console.log('Preview updated to emoji:', displayEmoji)
                            } else {
                              console.log('Image is uploaded, keeping image preview')
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            id="svc-icon-image" 
                            type="file" 
                            accept="image/*" 
                            style={{ fontSize: '12px', flex: 1 }}
                            onChange={async (e) => {
                              const f = e.target.files[0]
                              if (f) {
                                const previewImg = document.getElementById('svc-icon-preview-img')
                                const previewEmoji = document.getElementById('svc-icon-preview-emoji')
                                
                                // Show preview immediately from file
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  previewImg.src = event.target.result
                                  previewImg.style.display = 'block'
                                  previewEmoji.style.display = 'none'
                                }
                                reader.onerror = () => {
                                  console.error('Failed to read file')
                                  alert('Failed to read image file')
                                }
                                reader.readAsDataURL(f)
                                
                                // Upload to server
                                try {
                                  const url = await uploadServiceImage(f)
                                  if (url) {
                                    document.getElementById('svc-icon-image-url').value = url
                                    // Update preview with server URL (in case the file reader didn't work)
                                    previewImg.src = `http://localhost:3001${url}`
                                    previewImg.style.display = 'block'
                                    previewEmoji.style.display = 'none'
                                    console.log('Icon uploaded successfully:', url)
                                  } else {
                                    // Upload failed, revert to emoji
                                    previewImg.style.display = 'none'
                                    const iconInput = document.getElementById('svc-icon')
                                    previewEmoji.textContent = iconInput.value.trim() || '🛠️'
                                    previewEmoji.style.display = 'block'
                                    alert('Failed to upload icon image')
                                  }
                                } catch (error) {
                                  console.error('Icon upload error:', error)
                                  previewImg.style.display = 'none'
                                  const iconInput = document.getElementById('svc-icon')
                                  previewEmoji.textContent = iconInput.value.trim() || '🛠️'
                                  previewEmoji.style.display = 'block'
                                  alert('Error uploading icon: ' + (error.message || 'Unknown error'))
                                }
                              }
                            }} 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              document.getElementById('svc-icon-image').value = ''
                              document.getElementById('svc-icon-image-url').value = ''
                              const previewImg = document.getElementById('svc-icon-preview-img')
                              const previewEmoji = document.getElementById('svc-icon-preview-emoji')
                              const iconInput = document.getElementById('svc-icon')
                              previewImg.style.display = 'none'
                              previewImg.src = ''
                              previewEmoji.textContent = iconInput.value.trim() || '🛠️'
                              previewEmoji.style.display = 'block'
                            }}
                            style={{ 
                              fontSize: '11px', 
                              padding: '4px 8px', 
                              backgroundColor: '#ff4444', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Clear Image
                          </button>
                        </div>
                        <input id="svc-icon-image-url" type="hidden" />
                        {uploadingServiceImage && <div className="upload-status" style={{ fontSize: '11px', marginTop: '4px' }}>📤 Uploading icon...</div>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input id="svc-category" placeholder="Optional category" />
                    </div>
                    <div className="form-group">
                      <label>Order</label>
                      <input id="svc-order" type="number" defaultValue="0" />
                    </div>
                    <div className="form-group">
                      <label>Active</label>
                      <input id="svc-active" type="checkbox" defaultChecked />
                    </div>
                    <div className="form-group full-width">
                      <label>Description *</label>
                      <textarea id="svc-description" rows="3" placeholder="Short description" />
                    </div>
                    <div className="form-group full-width">
                      <label>Image</label>
                      <input id="svc-image" type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files[0]
                        if (f) {
                          const url = await uploadServiceImage(f)
                          if (url) document.getElementById('svc-image-url').value = url
                        }
                      }} />
                      <input id="svc-image-url" type="hidden" />
                      {uploadingServiceImage && <div className="upload-status">📤 Uploading...</div>}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-success" onClick={async () => {
                      const title = document.getElementById('svc-title').value.trim()
                      const description = document.getElementById('svc-description').value.trim()
                      const icon = document.getElementById('svc-icon').value.trim() || '🛠️'
                      const iconImage = document.getElementById('svc-icon-image-url').value.trim()
                      const image = document.getElementById('svc-image-url').value.trim()
                      const category = document.getElementById('svc-category').value.trim()
                      const isActive = document.getElementById('svc-active').checked
                      const order = parseInt(document.getElementById('svc-order').value || '0', 10)

                      if (!title || !description) { alert('Please fill in Title and Description'); return }

                      await createService({ title, description, icon, iconImage, image, category, isActive, order })

                      // reset quick form
                      document.getElementById('svc-title').value = ''
                      document.getElementById('svc-description').value = ''
                      document.getElementById('svc-icon').value = ''
                      document.getElementById('svc-category').value = ''
                      document.getElementById('svc-icon-image').value = ''
                      document.getElementById('svc-icon-image-url').value = ''
                      document.getElementById('svc-image').value = ''
                      document.getElementById('svc-image-url').value = ''
                      document.getElementById('svc-active').checked = true
                      document.getElementById('svc-order').value = '0'
                      // Reset icon preview
                      const previewEmoji = document.getElementById('svc-icon-preview-emoji')
                      const previewImg = document.getElementById('svc-icon-preview-img')
                      previewEmoji.textContent = '🛠️'
                      previewEmoji.style.display = 'block'
                      previewImg.style.display = 'none'
                      previewImg.src = ''
                    }}>
                      Add Service
                    </button>
                  </div>
                </div>

                <div className="services-table-card">
                  <div className="card-header">
                    <h3>📋 Services List ({services.length})</h3>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {services.length === 0 ? (
                      <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', color: '#666' }}>No services found. Add your first service above!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {services.map(svc => (
                          <div 
                            key={svc._id}
                            style={{
                              backgroundColor: '#fff',
                              border: '1px solid #e0e0e0',
                              borderRadius: '12px',
                              padding: '1.5rem',
                              display: 'flex',
                              gap: '1.5rem',
                              alignItems: 'flex-start',
                              transition: 'box-shadow 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
                          >
                            {/* Icon Section */}
                            <div style={{ 
                              flexShrink: 0, 
                              width: '80px', 
                              display: 'flex', 
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '12px',
                                backgroundColor: '#f5f5f5',
                                border: '2px solid #e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                overflow: 'hidden'
                              }}>
                                {svc.iconImage ? (
                                  <img 
                                    key={`icon-${svc._id}-${svc.iconImage}`}
                                    src={`http://localhost:3001${svc.iconImage}?v=${svc.updatedAt || Date.now()}`} 
                                    alt="Icon" 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                      console.error('Icon image failed to load:', svc.iconImage)
                                      e.target.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <span>{svc.icon || '🛠️'}</span>
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                <input 
                                  type="text" 
                                  defaultValue={svc.icon || '🛠️'} 
                                  placeholder="Emoji"
                                  style={{ 
                                    width: '100%', 
                                    fontSize: '11px', 
                                    padding: '4px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    textAlign: 'center'
                                  }}
                                  onBlur={(e)=>updateService(svc._id,{ icon: e.target.value.trim() || '🛠️' })} 
                                />
                                <label style={{ fontSize: '10px', cursor: 'pointer', textAlign: 'center', color: '#666', padding: '2px' }}>
                                  📷 Upload
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                      const f = e.target.files[0]
                                      if (f) {
                                        try {
                                          const url = await uploadServiceImage(f)
                                          if (url) {
                                            console.log('Icon uploaded, updating service:', svc._id, url)
                                            await updateService(svc._id, { iconImage: url })
                                            e.target.value = ''
                                          }
                                        } catch (err) {
                                          console.error('Failed to upload icon:', err)
                                          alert('Failed to upload icon: ' + (err.message || 'Unknown error'))
                                        }
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Main Content Section */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Title</label>
                                  <input 
                                    defaultValue={svc.title} 
                                    onBlur={(e)=>updateService(svc._id,{ title: e.target.value.trim() })} 
                                    style={{
                                      width: '100%',
                                      padding: '8px',
                                      border: '1px solid #ddd',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      fontWeight: '600'
                                    }}
                                  />
                                </div>
                                <div style={{ width: '120px' }}>
                                  <label style={{ fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Order</label>
                                  <input 
                                    type="number" 
                                    defaultValue={svc.order || 0} 
                                    onBlur={(e)=>updateService(svc._id,{ order: parseInt(e.target.value||'0',10) })} 
                                    style={{
                                      width: '100%',
                                      padding: '8px',
                                      border: '1px solid #ddd',
                                      borderRadius: '6px',
                                      fontSize: '14px'
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label style={{ fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Description</label>
                                <textarea 
                                  defaultValue={svc.description} 
                                  onBlur={(e)=>updateService(svc._id,{ description: e.target.value.trim() })} 
                                  rows="2"
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '600' }}>Category</label>
                                  <input 
                                    defaultValue={svc.category || ''} 
                                    onBlur={(e)=>updateService(svc._id,{ category: e.target.value.trim() })} 
                                    placeholder="Optional"
                                    style={{
                                      width: '100%',
                                      padding: '8px',
                                      border: '1px solid #ddd',
                                      borderRadius: '6px',
                                      fontSize: '13px'
                                    }}
                                  />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                                  <label style={{ fontSize: '13px', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input 
                                      type="checkbox" 
                                      defaultChecked={!!svc.isActive} 
                                      onChange={(e)=>updateService(svc._id,{ isActive: e.target.checked })} 
                                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span>Active</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Actions Section */}
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                              <button 
                                className="btn-danger" 
                                onClick={()=>deleteService(svc._id)}
                                style={{
                                  padding: '8px 16px',
                                  fontSize: '13px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="categories-management">
                <div className="section-header">
                  <h2>📁 Categories Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={loadCategories}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Category saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Category updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Category deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-category-card">
                  <div className="card-header">
                    <h3>➕ Add New Category</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input id="cat-name" placeholder="Enter category name" />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input id="cat-description" placeholder="Category description" />
                    </div>
                    <div className="form-group">
                      <label>Icon</label>
                      <input id="cat-icon" placeholder="📁" defaultValue="📁" />
                    </div>
                    <div className="form-group">
                      <label>Color</label>
                      <input id="cat-color" type="color" defaultValue="#3B82F6" />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button 
                      className="btn-success" 
                      onClick={() => {
                        const name = document.getElementById('cat-name').value.trim()
                        const description = document.getElementById('cat-description').value.trim()
                        const icon = document.getElementById('cat-icon').value.trim() || '📁'
                        const color = document.getElementById('cat-color').value

                        if (!name) {
                          alert('Category name is required')
                          return
                        }

                        createCategory({
                          name,
                          description,
                          icon,
                          color
                        })
                      }}
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                <div className="categories-table-card">
                  <div className="card-header">
                    <h3>📋 Categories List</h3>
                  </div>
                  <div className="table-container">
                    {categories.length === 0 ? (
                      <div className="empty-state">
                        <p>No categories found. Add your first category above!</p>
                      </div>
                    ) : (
                      <table className="categories-table">
                        <thead>
                          <tr>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category) => (
                            <tr key={category._id}>
                              <td>
                                <span className="category-icon" style={{ color: category.color }}>
                                  {category.icon}
                                </span>
                              </td>
                              <td>
                                <div className="category-name">{category.name}</div>
                              </td>
                              <td>{category.description || 'N/A'}</td>
                              <td>
                                <div className="color-preview" style={{ backgroundColor: category.color }}></div>
                              </td>
                              <td>
                                <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    className="btn-edit" 
                                    onClick={() => editCategory(category)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="btn-delete" 
                                    onClick={() => deleteCategory(category._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sliders' && (
              <div className="sliders-management">
                <div className="section-header">
                  <h2>🖼️ Slider Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={() => { loadSliders(); loadSliderConfig(); }}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Slide saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Settings updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Slide deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-product-card">
                  <div className="card-header">
                    <h3>➕ Add New Slide</h3>
                  </div>
                  <form id="slider-form" className="form-grid" onSubmit={(e)=>{e.preventDefault(); createSlider();}}>
                    <div className="form-group">
                      <label>Title</label>
                      <input id="slider-title" placeholder="Optional title" />
                    </div>
                    <div className="form-group">
                      <label>Caption</label>
                      <input id="slider-caption" placeholder="Optional caption" />
                    </div>
                    <div className="form-group">
                      <label>Link</label>
                      <input id="slider-link" placeholder="https://example.com" />
                    </div>
                    <div className="form-group">
                      <label>Order</label>
                      <input id="slider-order" type="number" defaultValue="0" />
                    </div>
                    <div className="form-group">
                      <label>Active</label>
                      <input id="slider-active" type="checkbox" defaultChecked />
                    </div>
                    <div className="form-group full-width">
                      <label>Slide Image</label>
                      <input 
                        id="slider-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const imageUrl = await uploadSliderImage(file)
                            if (imageUrl) {
                              document.getElementById('slider-image-url').value = imageUrl
                            }
                          }
                        }}
                      />
                      <input id="slider-image-url" type="hidden" />
                      {uploadingSliderImage && <div className="upload-status">Uploading...</div>}
                    </div>
                    <div className="form-actions full-width">
                      <button type="submit" className="btn-primary">
                        <span>➕</span> Add Slide
                      </button>
                    </div>
                  </form>
                </div>

                <div className="add-category-card" style={{ marginTop: '20px' }}>
                  <div className="card-header">
                    <h3>⚙️ Slider Settings</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Rotation Interval (ms)</label>
                      <input id="slider-interval" type="number" defaultValue={sliderIntervalMs} />
                    </div>
                    <div className="form-actions">
                      <button className="btn-secondary" onClick={updateSliderInterval}>Save Settings</button>
                    </div>
                  </div>
                </div>

                <div className="products-table-card" style={{ marginTop: '20px' }}>
                  <div className="card-header">
                    <h3>🖼️ Existing Slides</h3>
                  </div>
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th style={{ width: '120px' }}>Image</th>
                        <th>Title</th>
                        <th>Caption</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sliders.map(s => (
                        <tr key={s._id}>
                          <td>
                            {s.image ? (
                              <img src={`http://localhost:3001${s.image}`} alt={s.title || 'slide'} className="product-thumbnail" />
                            ) : '—'}
                          </td>
                          <td>{s.title || '—'}</td>
                          <td>{s.caption || '—'}</td>
                          <td>{s.order ?? 0}</td>
                          <td>{s.isActive ? <span className="status-badge active">Active</span> : <span className="status-badge inactive">Inactive</span>}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-delete" onClick={() => deleteSlider(s._id)} title="Delete Slide">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sliders.length === 0 && (
                    <div className="empty-state">
                      <p>No slides found. Add your first slide above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="blogs-management">
                <div className="section-header">
                  <h2>📝 Blog Management</h2>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={loadBlogs}>
                      <span>🔄</span> Reload
                    </button>
                    {publishStatus === 'saved' && <span className="success-message">✅ Blog saved!</span>}
                    {publishStatus === 'updated' && <span className="success-message">✅ Blog updated!</span>}
                    {publishStatus === 'deleted' && <span className="success-message">✅ Blog deleted!</span>}
                    {publishStatus === 'error' && <span className="error-message">❌ Operation failed</span>}
                  </div>
                </div>

                <div className="add-product-card">
                  <div className="card-header">
                    <h3>➕ Add New Blog Post</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Blog Title *</label>
                      <input id="blog-title" placeholder="Enter blog title" />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <input id="blog-category" placeholder="e.g., Web Design" />
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input id="blog-author" placeholder="Author name" defaultValue="Admin" />
                    </div>
                    <div className="form-group full-width">
                      <label>Excerpt / Short Description</label>
                      <textarea id="blog-excerpt" placeholder="Brief description for preview..." rows="2"></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>Content *</label>
                      <textarea id="blog-content" placeholder="Full blog content..." rows="6"></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label>Order</label>
                      <input id="blog-order" type="number" defaultValue="0" />
                    </div>
                    <div className="form-group">
                      <label>Published</label>
                      <input id="blog-published" type="checkbox" />
                    </div>
                    <div className="form-group full-width">
                      <label>Cover Image</label>
                      <input 
                        id="blog-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const imageUrl = await uploadBlogImage(file)
                            if (imageUrl) {
                              document.getElementById('blog-image-url').value = imageUrl
                            }
                          }
                        }}
                      />
                      <input id="blog-image-url" type="hidden" />
                      {uploadingBlogImage && <div className="upload-status">📤 Uploading...</div>}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-success" onClick={async () => {
                      const title = document.getElementById('blog-title').value.trim()
                      const content = document.getElementById('blog-content').value.trim()
                      const excerpt = document.getElementById('blog-excerpt').value.trim()
                      const category = document.getElementById('blog-category').value.trim()
                      const author = document.getElementById('blog-author').value.trim() || 'Admin'
                      const coverImage = document.getElementById('blog-image-url').value.trim()
                      const isPublished = document.getElementById('blog-published').checked
                      const order = parseInt(document.getElementById('blog-order').value || '0', 10)
                      
                      if (!title || !content || !category) {
                        alert('Please fill in Title, Content, and Category')
                        return
                      }
                      
                      const slug = generateSlug(title)
                      
                      const blogData = {
                        title,
                        slug,
                        content,
                        excerpt,
                        category,
                        author,
                        coverImage: coverImage || undefined,
                        isPublished,
                        order,
                        publishedAt: isPublished ? new Date() : undefined
                      }
                      
                      await createBlog(blogData)
                    }}>
                      <span>➕</span> Add Blog
                    </button>
                  </div>
                </div>

                <div className="projects-table-card">
                  <div className="card-header">
                    <h3>📋 Blogs List ({blogs.length})</h3>
                  </div>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Cover Image</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Author</th>
                          <th>Published</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map(blog => (
                          <tr key={blog._id}>
                            <td>
                              {blog.coverImage ? (
                                <img src={`http://localhost:3001${blog.coverImage}`} alt={blog.title} className="project-thumbnail" />
                              ) : (
                                <div className="no-image">📷</div>
                              )}
                            </td>
                            <td className="project-title">{blog.title}</td>
                            <td>{blog.category || '-'}</td>
                            <td>{blog.author || 'Admin'}</td>
                            <td>
                              {blog.isPublished ? (
                                <span className="status-badge published">✅ Published</span>
                              ) : (
                                <span className="status-badge draft">📝 Draft</span>
                              )}
                            </td>
                            <td>
                              {blog.publishedAt 
                                ? new Date(blog.publishedAt).toLocaleDateString()
                                : new Date(blog.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-edit" 
                                  onClick={() => editBlog(blog)}
                                  title="Edit Blog"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-delete" 
                                  onClick={() => deleteBlog(blog._id)}
                                  title="Delete Blog"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {blogs.length === 0 && (
                      <div className="empty-state">
                        <p>No blogs found. Add your first blog post above!</p>
                      </div>
                    )}
                  </div>
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
                    <p>Manage About hero, content, and team sections</p>
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
                    <button className="btn-primary" onClick={handleSaveDraft}>Save Changes</button>
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
                              <div className="image-placeholder">
                                <div className="company-logo-container">
                                  <img src="/logo.png" alt="Company Logo" className="company-logo-homepage" />
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
                              onBlur={(e) => handleContentChange('services', 'subtitle', e.target.textContent)}
                            >
                              OUR SERVICES
                            </span>
                            <h2 
                              className="services-title editable-text" 
                              data-field="services-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('services', 'title', e.target.textContent)}
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

                      {/* FAQ Section - Editable */}
                      <section className="faq editable-section" data-section="faq">
                        <div className="container">
                          <div className="faq-content">
                            <div className="faq-intro">
                              <span 
                                className="faq-subtitle editable-text" 
                                data-field="faq-subtitle"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('faq', 'subtitle', e.target.textContent)}
                              >
                                {pageContent.faq?.subtitle || 'GENERAL FAQS'}
                              </span>
                              <h2 
                                className="faq-title editable-text" 
                                data-field="faq-title"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('faq', 'title', e.target.textContent)}
                              >
                                {pageContent.faq?.title || 'Any Question? Check the FAQs or Contact Us'}
                              </h2>
                              <div className="faq-underline">
                                <div className="underline-line"></div>
                                <div className="underline-line short"></div>
                              </div>
                              <p 
                                className="faq-description editable-text" 
                                data-field="faq-description"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('faq', 'description', e.target.textContent)}
                              >
                                {pageContent.faq?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                              </p>
                              <button 
                                className="faq-button editable-text" 
                                data-field="faq-button-text"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('faq', 'buttonText', e.target.textContent)}
                              >
                                {pageContent.faq?.buttonText || 'Explore More FAQs'}
                              </button>
                            </div>
                            
                            <div className="faq-accordion">
                              {(pageContent.faq?.questions || [
                                { question: 'How to build a website?', answer: 'Lorem ipsum...' },
                                { question: 'How long will it take?', answer: 'Lorem ipsum...' },
                                { question: 'Do you only create HTML websites?', answer: 'Lorem ipsum...' },
                                { question: 'Will my website be mobile-friendly?', answer: 'Lorem ipsum...' },
                                { question: 'Will you maintain my site for me?', answer: 'Lorem ipsum...' }
                              ]).map((faq, index) => (
                                <div key={index} className="faq-item editable-card" style={{ marginBottom: '8px' }}>
                                  <div 
                                    className="faq-question"
                                    style={{ cursor: 'pointer', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                  >
                                    <input
                                      type="text"
                                      defaultValue={faq.question}
                                      placeholder="Question"
                                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginRight: '8px' }}
                                      onBlur={(e) => {
                                        const questions = [...(pageContent.faq?.questions || [])]
                                        if (!questions[index]) questions[index] = { question: '', answer: '' }
                                        questions[index] = { ...questions[index], question: e.target.value.trim() }
                                        handleContentChange('faq', 'questions', questions)
                                      }}
                                    />
                                    <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
                                  </div>
                                  <div className="faq-answer" style={{ padding: '12px', borderTop: '1px solid #e0e0e0', marginTop: '8px' }}>
                                    <textarea
                                      defaultValue={faq.answer}
                                      placeholder="Answer"
                                      rows="3"
                                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                                      onBlur={(e) => {
                                        const questions = [...(pageContent.faq?.questions || [])]
                                        if (!questions[index]) questions[index] = { question: '', answer: '' }
                                        questions[index] = { ...questions[index], answer: e.target.value.trim() }
                                        handleContentChange('faq', 'questions', questions)
                                      }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const questions = [...(pageContent.faq?.questions || [])]
                                      questions.splice(index, 1)
                                      handleContentChange('faq', 'questions', questions)
                                    }}
                                    style={{
                                      marginTop: '8px',
                                      padding: '6px 12px',
                                      fontSize: '11px',
                                      backgroundColor: '#ff4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const questions = [...(pageContent.faq?.questions || [])]
                                  questions.push({ question: '', answer: '' })
                                  handleContentChange('faq', 'questions', questions)
                                }}
                                style={{
                                  marginTop: '12px',
                                  padding: '10px 16px',
                                  fontSize: '13px',
                                  backgroundColor: '#4CAF50',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  width: '100%'
                                }}
                              >
                                + Add New Question
                              </button>
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
                    <button className="btn-primary" onClick={handleSaveDraft}>Save Changes</button>
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
                            {pageContent.hero?.title || 'About Us'}
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
                                {pageContent.content?.subtitle || 'ABOUT US'}
                              </span>
                              <h2 
                                className="about-title editable-text" 
                                data-field="about-title"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('content', 'title', e.target.textContent)}
                              >
                                {pageContent.content?.title || 'The Best IT Solution With 10 Years of Experience'}
                              </h2>
                              <div className="about-underline"></div>
                              
                              <p 
                                className="about-description editable-text" 
                                data-field="about-description"
                                contentEditable="true"
                                onBlur={(e) => handleContentChange('content', 'description', e.target.textContent)}
                              >
                                {pageContent.content?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
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
                              <div className="company-logo-animated">
                                <div className="logo-container">
                                  <div className="logo-front">
                                    <img src="/logo.png" alt="Company Logo" className="logo-image" />
                                  </div>
                                  <div className="logo-back">
                                    <img src="/logo2.png" alt="Company Logo" className="logo-image" />
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
                              onBlur={(e) => handleContentChange('timeline', 'subtitle', e.target.textContent)}
                            >
                              {pageContent.timeline?.subtitle || 'OUR STORY'}
                            </span>
                            <h2 
                              className="story-title editable-text" 
                              data-field="story-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('timeline', 'title', e.target.textContent)}
                            >
                              {pageContent.timeline?.title || '10 Years of Our Journey to Help Your Business'}
                            </h2>
                            <div className="story-underline"></div>
                          </div>

                          <div className="timeline-container">
                            <div className="timeline-line"></div>
                            
                            {/* Timeline Item 1 */}
                            <div className="timeline-item timeline-left editable-card" data-field="timeline-1">
                              <div className="timeline-marker">
                                <div className="timeline-diamond"></div>
                              </div>
                              <div className="timeline-content">
                                <div 
                                  className="timeline-date editable-text" 
                                  contentEditable="true"
                                  onBlur={(e) => handleContentChange('timeline', 'item1', { ...pageContent.timeline?.item1, date: e.target.textContent })}
                                >
                                  {pageContent.timeline?.item1?.date || '01 Jun, 2021'}
                                </div>
                                <div className="timeline-card">
                                  <h3 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item1', { ...pageContent.timeline?.item1, title: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item1?.title || 'Lorem ipsum dolor'}
                                  </h3>
                                  <p 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item1', { ...pageContent.timeline?.item1, description: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item1?.description || 'Lorem ipsum dolor sit amet elit ornare velit non'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="timeline-item timeline-right editable-card" data-field="timeline-2">
                              <div className="timeline-marker">
                                <div className="timeline-diamond"></div>
                              </div>
                              <div className="timeline-content">
                                <div 
                                  className="timeline-date editable-text" 
                                  contentEditable="true"
                                  onBlur={(e) => handleContentChange('timeline', 'item2', { ...pageContent.timeline?.item2, date: e.target.textContent })}
                                >
                                  {pageContent.timeline?.item2?.date || '01 Jan, 2021'}
                                </div>
                                <div className="timeline-card">
                                  <h3 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item2', { ...pageContent.timeline?.item2, title: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item2?.title || 'Lorem ipsum dolor'}
                                  </h3>
                                  <p 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item2', { ...pageContent.timeline?.item2, description: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item2?.description || 'Lorem ipsum dolor sit amet elit ornare velit non'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="timeline-item timeline-left editable-card" data-field="timeline-3">
                              <div className="timeline-marker">
                                <div className="timeline-diamond"></div>
                              </div>
                              <div className="timeline-content">
                                <div 
                                  className="timeline-date editable-text" 
                                  contentEditable="true"
                                  onBlur={(e) => handleContentChange('timeline', 'item3', { ...pageContent.timeline?.item3, date: e.target.textContent })}
                                >
                                  {pageContent.timeline?.item3?.date || '01 Jun, 2020'}
                                </div>
                                <div className="timeline-card">
                                  <h3 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item3', { ...pageContent.timeline?.item3, title: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item3?.title || 'Lorem ipsum dolor'}
                                  </h3>
                                  <p 
                                    className="editable-text" 
                                    contentEditable="true"
                                    onBlur={(e) => handleContentChange('timeline', 'item3', { ...pageContent.timeline?.item3, description: e.target.textContent })}
                                  >
                                    {pageContent.timeline?.item3?.description || 'Lorem ipsum dolor sit amet elit ornare velit non'}
                                  </p>
                                </div>
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'team-image-1', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'team-image-2', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'team-image-3', e.target)
                                          }
                                        }}
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
                    <button className="btn-primary" onClick={handleSaveDraft}>Save Changes</button>
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
                            onBlur={(e) => handleContentChange('header', 'heroTitle', e.target.textContent)}
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
                              onBlur={(e) => handleContentChange('header', 'subtitle', e.target.textContent)}
                            >
                              OUR SERVICES
                            </span>
                            <h2 
                              className="services-title editable-text" 
                              data-field="services-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('header', 'title', e.target.textContent)}
                            >
                              We Provide The Best Service For You
                            </h2>
                            <div className="services-underline"></div>
                            <p 
                              className="services-description editable-text" 
                              data-field="services-description"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('header', 'description', e.target.textContent)}
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
                    <button className="btn-primary" onClick={handleSaveDraft}>Save Changes</button>
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
                            onBlur={(e) => handleContentChange('hero', 'title', e.target.textContent)}
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
                                      onChange={async (e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                          await handlePageImageUpload(file, 'map-image', e.target)
                                        }
                                      }}
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
                    <button className="btn-primary" onClick={handleSaveDraft}>Save Changes</button>
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
                            onBlur={(e) => handleContentChange('header', 'heroTitle', e.target.textContent)}
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
                              onBlur={(e) => handleContentChange('header', 'subtitle', e.target.textContent)}
                            >
                              OUR PRODUCTS
                            </span>
                            <h2 
                              className="products-title editable-text" 
                              data-field="products-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('header', 'title', e.target.textContent)}
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
                            onBlur={(e) => handleContentChange('header', 'heroTitle', e.target.textContent)}
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
                              onBlur={(e) => handleContentChange('header', 'subtitle', e.target.textContent)}
                            >
                              OUR PROJECTS
                            </span>
                            <h2 
                              className="projects-title editable-text" 
                              data-field="projects-title"
                              contentEditable="true"
                              onBlur={(e) => handleContentChange('header', 'title', e.target.textContent)}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-image-1', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-image-2', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-image-3', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-image-4', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-large-image', e.target)
                                          }
                                        }}
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
                                        onChange={async (e) => {
                                          const file = e.target.files[0]
                                          if (file) {
                                            await handlePageImageUpload(file, 'project-small-image', e.target)
                                          }
                                        }}
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

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Edit Project</h3>
              <button className="modal-close" onClick={() => { setShowEditModal(false); setEditingProject(null) }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input id="edit-title" defaultValue={editingProject.title} />
                </div>
                <div className="form-group">
                  <label>Manager</label>
                  <input id="edit-manager" defaultValue={editingProject.manager || ''} />
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <input id="edit-client" defaultValue={editingProject.client || ''} />
                </div>
                <div className="form-group">
                  <label>Project URL</label>
                  <input id="edit-url" defaultValue={editingProject.url || ''} />
                </div>
                <div className="form-group">
                  <label>Project Image</label>
                  <input 
                    id="edit-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const imageUrl = await uploadProjectImage(file)
                        if (imageUrl) {
                          document.getElementById('edit-image-url').value = imageUrl
                        }
                      }
                    }}
                  />
                  <input id="edit-image-url" type="hidden" defaultValue={editingProject.image || ''} />
                  {uploadingImage && <div className="upload-status">📤 Uploading...</div>}
                  {editingProject.image && (
                    <div className="current-image">
                      <img src={`http://localhost:3001${editingProject.image}`} alt="Current" className="current-thumbnail" />
                      <span>Current image</span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Completion Date *</label>
                  <input id="edit-date" type="date" defaultValue={editingProject.date ? editingProject.date.split('T')[0] : ''} />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input id="edit-rating" type="number" min="1" max="5" defaultValue={editingProject.rating || 5} />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea id="edit-desc" rows="3" defaultValue={editingProject.description || ''}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowEditModal(false); setEditingProject(null) }}>
                Cancel
              </button>
              <button className="btn-success" onClick={async () => {
                const title = document.getElementById('edit-title').value.trim()
                const description = document.getElementById('edit-desc').value.trim()
                const date = document.getElementById('edit-date').value
                
                if (!title || !description || !date) {
                  alert('Please fill in Title, Description, and Date')
                  return
                }
                
                const updatedData = {
                  title,
                  description,
                  icon: document.getElementById('edit-icon').value.trim() || '🚀',
                  image: document.getElementById('edit-image-url').value.trim(),
                  manager: document.getElementById('edit-manager').value.trim(),
                  url: document.getElementById('edit-url').value.trim(),
                  date,
                  client: document.getElementById('edit-client').value.trim(),
                  rating: parseInt(document.getElementById('edit-rating').value || '5', 10)
                }
                await updateProject(updatedData)
              }}>
                <span>💾</span> Update Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showProductEditModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Edit Product</h3>
              <button className="modal-close" onClick={() => { setShowProductEditModal(false); setEditingProduct(null) }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Title *</label>
                  <input id="edit-prod-title" defaultValue={editingProduct.title} />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input id="edit-prod-price" defaultValue={editingProduct.price || ''} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select id="edit-prod-category" defaultValue={editingProduct.category || ''}>
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat.isActive).map(category => (
                      <option key={category._id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select id="edit-prod-availability" defaultValue={editingProduct.availability || 'In Stock'}>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre-order">Pre-order</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Product Image</label>
                  <input 
                    id="edit-prod-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const imageUrl = await uploadProductImage(file)
                        if (imageUrl) {
                          document.getElementById('edit-prod-image-url').value = imageUrl
                        }
                      }
                    }}
                  />
                  <input id="edit-prod-image-url" type="hidden" defaultValue={editingProduct.image || ''} />
                  {uploadingProductImage && <div className="upload-status">📤 Uploading...</div>}
                  {editingProduct.image && (
                    <div className="current-image">
                      <img src={`http://localhost:3001${editingProduct.image}`} alt="Current" className="current-thumbnail" />
                      <span>Current image</span>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <input id="edit-prod-icon" defaultValue={editingProduct.icon || '📦'} />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <select id="edit-prod-rating" defaultValue={editingProduct.rating || 5}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea id="edit-prod-desc" rows="3" defaultValue={editingProduct.description || ''}></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Features (one per line)</label>
                  <textarea id="edit-prod-features" rows="3" defaultValue={editingProduct.features ? editingProduct.features.join('\n') : ''}></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Specifications</label>
                  <textarea id="edit-prod-specifications" rows="3" defaultValue={editingProduct.specifications || ''}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowProductEditModal(false); setEditingProduct(null) }}>
                Cancel
              </button>
              <button className="btn-success" onClick={async () => {
                const title = document.getElementById('edit-prod-title').value.trim()
                const description = document.getElementById('edit-prod-desc').value.trim()
                
                if (!title || !description) {
                  alert('Please fill in Title and Description')
                  return
                }
                
                const updatedData = {
                  title,
                  description,
                  price: document.getElementById('edit-prod-price').value.trim(),
                  category: document.getElementById('edit-prod-category').value.trim(),
                  features: document.getElementById('edit-prod-features').value.trim().split('\n').filter(f => f.trim()),
                  specifications: document.getElementById('edit-prod-specifications').value.trim(),
                  availability: document.getElementById('edit-prod-availability').value,
                  icon: document.getElementById('edit-prod-icon').value.trim() || '📦',
                  image: document.getElementById('edit-prod-image-url').value.trim(),
                  rating: parseInt(document.getElementById('edit-prod-rating').value || '5', 10)
                }
                await updateProduct(updatedData)
              }}>
                <span>💾</span> Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showCategoryEditModal && editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Edit Category</h3>
              <button className="modal-close" onClick={() => { setShowCategoryEditModal(false); setEditingCategory(null) }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input id="edit-cat-name" defaultValue={editingCategory.name} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input id="edit-cat-description" defaultValue={editingCategory.description || ''} />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <input id="edit-cat-icon" defaultValue={editingCategory.icon || '📁'} />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input id="edit-cat-color" type="color" defaultValue={editingCategory.color || '#3B82F6'} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select id="edit-cat-status" defaultValue={editingCategory.isActive ? 'active' : 'inactive'}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowCategoryEditModal(false); setEditingCategory(null) }}>
                Cancel
              </button>
              <button className="btn-success" onClick={async () => {
                const name = document.getElementById('edit-cat-name').value.trim()
                
                if (!name) {
                  alert('Please fill in Category Name')
                  return
                }
                
                const updatedData = {
                  name,
                  description: document.getElementById('edit-cat-description').value.trim(),
                  icon: document.getElementById('edit-cat-icon').value.trim() || '📁',
                  color: document.getElementById('edit-cat-color').value,
                  isActive: document.getElementById('edit-cat-status').value === 'active'
                }
                await updateCategory(updatedData)
              }}>
                <span>💾</span> Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showBlogEditModal && editingBlog && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h3>✏️ Edit Blog</h3>
              <button className="modal-close" onClick={() => { setShowBlogEditModal(false); setEditingBlog(null) }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Blog Title *</label>
                  <input id="edit-blog-title" defaultValue={editingBlog.title} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input id="edit-blog-category" defaultValue={editingBlog.category || ''} />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input id="edit-blog-author" defaultValue={editingBlog.author || 'Admin'} />
                </div>
                <div className="form-group full-width">
                  <label>Excerpt / Short Description</label>
                  <textarea id="edit-blog-excerpt" rows="2" defaultValue={editingBlog.excerpt || ''}></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Content *</label>
                  <textarea id="edit-blog-content" rows="6" defaultValue={editingBlog.content || ''}></textarea>
                </div>
                
                <div className="form-group">
                  <label>Order</label>
                  <input id="edit-blog-order" type="number" defaultValue={editingBlog.order || 0} />
                </div>
                <div className="form-group">
                  <label>Published</label>
                  <input id="edit-blog-published" type="checkbox" defaultChecked={editingBlog.isPublished || false} />
                </div>
                <div className="form-group full-width">
                  <label>Cover Image</label>
                  <input 
                    id="edit-blog-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const imageUrl = await uploadBlogImage(file)
                        if (imageUrl) {
                          document.getElementById('edit-blog-image-url').value = imageUrl
                        }
                      }
                    }}
                  />
                  <input id="edit-blog-image-url" type="hidden" defaultValue={editingBlog.coverImage || ''} />
                  {uploadingBlogImage && <div className="upload-status">📤 Uploading...</div>}
                  {editingBlog.coverImage && (
                    <div className="current-image">
                      <img src={`http://localhost:3001${editingBlog.coverImage}`} alt="Current" className="current-thumbnail" />
                      <span>Current image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowBlogEditModal(false); setEditingBlog(null) }}>
                Cancel
              </button>
              <button className="btn-success" onClick={async () => {
                const title = document.getElementById('edit-blog-title').value.trim()
                const content = document.getElementById('edit-blog-content').value.trim()
                const excerpt = document.getElementById('edit-blog-excerpt').value.trim()
                const category = document.getElementById('edit-blog-category').value.trim()
                const author = document.getElementById('edit-blog-author').value.trim() || 'Admin'
                const coverImage = document.getElementById('edit-blog-image-url').value.trim()
                const isPublished = document.getElementById('edit-blog-published').checked
                const order = parseInt(document.getElementById('edit-blog-order').value || '0', 10)
                
                if (!title || !content || !category) {
                  alert('Please fill in Title, Content, and Category')
                  return
                }
                
                const slug = editingBlog.slug || generateSlug(title)
                
                const blogData = {
                  title,
                  slug,
                  content,
                  excerpt,
                  category,
                  author,
                  coverImage: coverImage || undefined,
                  isPublished,
                  order,
                  publishedAt: isPublished && !editingBlog.publishedAt ? new Date() : (isPublished ? editingBlog.publishedAt : undefined)
                }
                
                await updateBlog(editingBlog._id, blogData)
              }}>
                <span>💾</span> Update Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}