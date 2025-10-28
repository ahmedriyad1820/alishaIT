// API client for communicating with the backend server
const API_BASE_URL = 'http://localhost:3001/api'

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call error:', error)
    return { success: false, error: 'Network error' }
  }
}

// Contact API
export const contactAPI = {
  async create(data) {
    return await apiCall('/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async getAll() {
    return await apiCall('/contacts')
  }
}

// Quote API
export const quoteAPI = {
  async create(data) {
    return await apiCall('/quotes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async getAll() {
    return await apiCall('/quotes')
  }
}

// Order API
export const orderAPI = {
  async create(data) {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async getAll() {
    return await apiCall('/orders')
  }
}

// Admin API
export const adminAPI = {
  async authenticate(username, password) {
    return await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
  },

  async getStats() {
    return await apiCall('/admin/stats')
  }
}

// Page Content API
export const pageContentAPI = {
  async get(pageName) {
    return await apiCall(`/pages/${pageName}`)
  },

  async update(pageName, sections, published = false) {
    return await apiCall(`/pages/${pageName}`, {
      method: 'POST',
      body: JSON.stringify({ sections, published })
    })
  }
}

// Image Upload API
export const imageUploadAPI = {
  async upload(file) {
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Image upload error:', error)
      return { success: false, error: 'Upload failed' }
    }
  }
}

// Health check
export const healthCheck = async () => {
  return await apiCall('/health')
}

export default {
  contactAPI,
  quoteAPI,
  orderAPI,
  adminAPI,
  pageContentAPI,
  imageUploadAPI,
  healthCheck
}
