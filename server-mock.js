import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Mock data storage (in-memory)
let mockData = {
  contacts: [],
  quotes: [],
  orders: [],
  admins: [{ username: 'Dracula', password: 'Admin', role: 'admin' }],
  pageContent: {}
}

// Routes

// Contact routes
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      status: 'new'
    }
    mockData.contacts.push(contact)
    res.json({ success: true, data: contact })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/contacts', async (req, res) => {
  try {
    res.json({ success: true, data: mockData.contacts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Quote routes
app.post('/api/quotes', async (req, res) => {
  try {
    const quote = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      status: 'pending',
      quotedAmount: 0
    }
    mockData.quotes.push(quote)
    res.json({ success: true, data: quote })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/quotes', async (req, res) => {
  try {
    res.json({ success: true, data: mockData.quotes })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Order routes
app.post('/api/orders', async (req, res) => {
  try {
    const order = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date(),
      status: 'pending'
    }
    mockData.orders.push(order)
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    res.json({ success: true, data: mockData.orders })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const admin = mockData.admins.find(a => a.username === username && a.password === password)
    
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    res.json({ success: true, data: { id: '1', username: admin.username, role: admin.role } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalRevenue = mockData.orders.reduce((sum, order) => sum + (order.amount || 0), 0)
    
    res.json({
      success: true,
      data: {
        totalContacts: mockData.contacts.length,
        totalQuotes: mockData.quotes.length,
        totalOrders: mockData.orders.length,
        totalRevenue
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Page Content routes
app.get('/api/pages/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params
    
    // Return existing content or default
    if (mockData.pageContent[pageName]) {
      res.json({ success: true, data: mockData.pageContent[pageName] })
    } else {
      // Create default content
      const defaultContent = {
        pageName,
        sections: getDefaultPageContent(pageName),
        published: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockData.pageContent[pageName] = defaultContent
      res.json({ success: true, data: defaultContent })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/pages/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params
    const { sections, published = false } = req.body
    
    const pageData = {
      pageName,
      sections,
      published,
      createdAt: mockData.pageContent[pageName]?.createdAt || new Date(),
      updatedAt: new Date()
    }
    
    mockData.pageContent[pageName] = pageData
    
    res.json({ success: true, data: pageData })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Image upload route
app.post('/api/upload/image', async (req, res) => {
  try {
    const imageUrl = `/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    
    res.json({ 
      success: true, 
      data: { 
        url: imageUrl,
        message: 'Image upload simulated (Mock Mode)'
      } 
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Helper function to get default page content
const getDefaultPageContent = (pageName) => {
  const defaults = {
    'home': {
      hero: {
        companyName: 'ALISHA IT SOLUTION\'S',
        title: 'Creative & Innovative\nDigital Solution',
        primaryButton: 'Free Quote',
        secondaryButton: 'Contact Us'
      },
      about: {
        subtitle: 'ABOUT US',
        title: 'The Best IT Solution With 10 Years of Experience',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        readMoreButton: 'Read More'
      },
      services: {
        subtitle: 'OUR SERVICES',
        title: 'We Provide The Best Service For You',
        description: 'We offer comprehensive IT solutions tailored to your business needs. Our expert team delivers cutting-edge technology services.'
      },
      quote: {
        subtitle: 'REQUEST A QUOTE',
        title: 'Need A Free Quote? Please Feel Free to Contact Us',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        phoneNumber: '+012 345 6789'
      }
    },
    'about': {
      hero: {
        title: 'About Us'
      },
      content: {
        subtitle: 'ABOUT US',
        title: 'The Best IT Solution With 10 Years of Experience',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        features: ['Professional Team', '24/7 Support', 'Quality Service']
      },
      statistics: {
        projects: '500+',
        clients: '200+',
        experience: '10+',
        team: '50+'
      }
    }
  }
  
  return defaults[pageName] || {}
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running (Mock Mode)',
    mode: 'mock',
    data: {
      contacts: mockData.contacts.length,
      quotes: mockData.quotes.length,
      orders: mockData.orders.length
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🔧 Running in MOCK MODE (no MongoDB required)`)
  console.log(`👤 Admin credentials: Dracula / Admin`)
})
