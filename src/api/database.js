import { Contact, Quote, Order, Admin, Blog, Project } from '../models/index.js'

// Contact API Functions
export const contactAPI = {
  // Create new contact
  async create(data) {
    try {
      const contact = new Contact(data)
      await contact.save()
      return { success: true, data: contact }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all contacts
  async getAll() {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 })
      return { success: true, data: contacts }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get contact by ID
  async getById(id) {
    try {
      const contact = await Contact.findById(id)
      if (!contact) {
        return { success: false, error: 'Contact not found' }
      }
      return { success: true, data: contact }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update contact status
  async updateStatus(id, status) {
    try {
      const contact = await Contact.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
      if (!contact) {
        return { success: false, error: 'Contact not found' }
      }
      return { success: true, data: contact }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete contact
  async delete(id) {
    try {
      const contact = await Contact.findByIdAndDelete(id)
      if (!contact) {
        return { success: false, error: 'Contact not found' }
      }
      return { success: true, message: 'Contact deleted successfully' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Quote API Functions
export const quoteAPI = {
  // Create new quote request
  async create(data) {
    try {
      const quote = new Quote(data)
      await quote.save()
      return { success: true, data: quote }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all quotes
  async getAll() {
    try {
      const quotes = await Quote.find().sort({ createdAt: -1 })
      return { success: true, data: quotes }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get quote by ID
  async getById(id) {
    try {
      const quote = await Quote.findById(id)
      if (!quote) {
        return { success: false, error: 'Quote not found' }
      }
      return { success: true, data: quote }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update quote
  async update(id, data) {
    try {
      const quote = await Quote.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      )
      if (!quote) {
        return { success: false, error: 'Quote not found' }
      }
      return { success: true, data: quote }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete quote
  async delete(id) {
    try {
      const quote = await Quote.findByIdAndDelete(id)
      if (!quote) {
        return { success: false, error: 'Quote not found' }
      }
      return { success: true, message: 'Quote deleted successfully' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Order API Functions
export const orderAPI = {
  // Create new order
  async create(data) {
    try {
      const order = new Order(data)
      await order.save()
      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all orders
  async getAll() {
    try {
      const orders = await Order.find().sort({ createdAt: -1 })
      return { success: true, data: orders }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get order by ID
  async getById(id) {
    try {
      const order = await Order.findById(id)
      if (!order) {
        return { success: false, error: 'Order not found' }
      }
      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update order
  async update(id, data) {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      )
      if (!order) {
        return { success: false, error: 'Order not found' }
      }
      return { success: true, data: order }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete order
  async delete(id) {
    try {
      const order = await Order.findByIdAndDelete(id)
      if (!order) {
        return { success: false, error: 'Order not found' }
      }
      return { success: true, message: 'Order deleted successfully' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Blog API Functions
export const blogAPI = {
  // Create new blog post
  async create(data) {
    try {
      const blog = new Blog(data)
      await blog.save()
      return { success: true, data: blog }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all published blogs
  async getAll() {
    try {
      const blogs = await Blog.find({ published: true }).sort({ publishedAt: -1 })
      return { success: true, data: blogs }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get blog by ID
  async getById(id) {
    try {
      const blog = await Blog.findById(id)
      if (!blog) {
        return { success: false, error: 'Blog not found' }
      }
      return { success: true, data: blog }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update blog
  async update(id, data) {
    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      )
      if (!blog) {
        return { success: false, error: 'Blog not found' }
      }
      return { success: true, data: blog }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Project API Functions
export const projectAPI = {
  // Create new project
  async create(data) {
    try {
      const project = new Project(data)
      await project.save()
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get all projects
  async getAll() {
    try {
      const projects = await Project.find().sort({ createdAt: -1 })
      return { success: true, data: projects }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get project by ID
  async getById(id) {
    try {
      const project = await Project.findById(id)
      if (!project) {
        return { success: false, error: 'Project not found' }
      }
      return { success: true, data: project }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Admin API Functions
export const adminAPI = {
  // Create admin user
  async create(data) {
    try {
      const admin = new Admin(data)
      await admin.save()
      return { success: true, data: admin }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Authenticate admin
  async authenticate(username, password) {
    try {
      const admin = await Admin.findOne({ username })
      if (!admin || admin.password !== password) {
        return { success: false, error: 'Invalid credentials' }
      }
      
      // Update last login
      await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })
      
      return { success: true, data: { id: admin._id, username: admin.username, role: admin.role } }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get dashboard stats
  async getStats() {
    try {
      const [contacts, quotes, orders] = await Promise.all([
        Contact.countDocuments(),
        Quote.countDocuments(),
        Order.countDocuments()
      ])

      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])

      return {
        success: true,
        data: {
          totalContacts: contacts,
          totalQuotes: quotes,
          totalOrders: orders,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Initialize default admin user
export const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'Dracula' })
    if (!existingAdmin) {
      const admin = new Admin({
        username: 'Dracula',
        password: 'Admin',
        role: 'admin'
      })
      await admin.save()
      console.log('✅ Default admin user created successfully!')
      console.log('   Username: Dracula')
      console.log('   Password: Admin')
      console.log('   Role: admin')
    } else {
      console.log('ℹ️  Admin user already exists:', existingAdmin.username)
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error)
  }
}

export default {
  contactAPI,
  quoteAPI,
  orderAPI,
  blogAPI,
  projectAPI,
  adminAPI,
  initializeAdmin
}
