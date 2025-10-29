// API client for communicating with the backend server
const API_BASE_URL = 'http://localhost:3001/api'

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
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

  async me() {
    return await apiCall('/admin/me')
  },

  async logout() {
    return await apiCall('/admin/logout', { method: 'POST' })
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

// Project Items API
export const projectItemsAPI = {
  async list() {
    return await apiCall('/project-items')
  },

  async create(item) {
    return await apiCall('/project-items', {
      method: 'POST',
      body: JSON.stringify(item)
    })
  },

  async update(id, item) {
    return await apiCall(`/project-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    })
  },

  async delete(id) {
    return await apiCall(`/project-items/${id}`, {
      method: 'DELETE'
    })
  }
}

// Product Items API
export const productItemsAPI = {
  async list() {
    return await apiCall('/product-items')
  },

  async create(item) {
    return await apiCall('/product-items', {
      method: 'POST',
      body: JSON.stringify(item)
    })
  },

  async update(id, item) {
    return await apiCall(`/product-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    })
  },

  async delete(id) {
    return await apiCall(`/product-items/${id}`, {
      method: 'DELETE'
    })
  }
}

// Categories API
export const categoriesAPI = {
  async list() {
    return await apiCall('/categories')
  },

  async listAll() {
    return await apiCall('/categories/all')
  },

  async create(category) {
    return await apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    })
  },

  async update(id, category) {
    return await apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    })
  },

  async delete(id) {
    return await apiCall(`/categories/${id}`, {
      method: 'DELETE'
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

// Sliders API
export const slidersAPI = {
  async list(activeOnly = false) {
    const qs = activeOnly ? '?active=true' : ''
    return await apiCall(`/sliders${qs}`)
  },

  async create(item) {
    return await apiCall('/sliders', {
      method: 'POST',
      body: JSON.stringify(item)
    })
  },

  async update(id, item) {
    return await apiCall(`/sliders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    })
  },

  async delete(id) {
    return await apiCall(`/sliders/${id}`, {
      method: 'DELETE'
    })
  }
}

// Slider Config API
export const sliderConfigAPI = {
  async get() {
    return await apiCall('/slider-config')
  },
  async update(intervalMs) {
    return await apiCall('/slider-config', {
      method: 'PUT',
      body: JSON.stringify({ intervalMs })
    })
  }
}

export default {
  contactAPI,
  quoteAPI,
  orderAPI,
  adminAPI,
  pageContentAPI,
  imageUploadAPI,
  healthCheck,
  projectItemsAPI,
  productItemsAPI,
  categoriesAPI,
  slidersAPI,
  sliderConfigAPI
}
