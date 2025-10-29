import express from 'express'
import cors from 'cors'
import session from 'express-session'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Generic OPTIONS handler for Express v5 (preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin
    if (origin && ['http://localhost:5173', 'http://localhost:5174'].includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Vary', 'Origin')
      res.header('Access-Control-Allow-Credentials', 'true')
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.sendStatus(204)
  }
  next()
})

// Sessions
const sessionSecret = process.env.SESSION_SECRET || 'change_this_secret'
app.use(session({
  name: 'sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  }
}))

// Mock data storage (in-memory)
let mockData = {
  contacts: [],
  quotes: [],
  orders: [],
  admins: [{ username: 'Dracula', password: 'Admin', role: 'admin' }],
  pageContent: {},
  teamMembers: [],
  blogs: []
}

// Routes

// Auth guard
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) return next()
  return res.status(401).json({ success: false, error: 'Unauthorized' })
}

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
    // set session
    req.session.adminId = '1'
    req.session.username = admin.username
    req.session.role = admin.role

    res.json({ success: true, data: { id: '1', username: admin.username, role: admin.role } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/admin/me', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ success: true, data: {
      id: req.session.adminId,
      username: req.session.username,
      role: req.session.role
    } })
  }
  return res.status(401).json({ success: false, error: 'Unauthorized' })
})

app.post('/api/admin/logout', (req, res) => {
  if (!req.session) return res.json({ success: true })
  req.session.destroy(() => {
    res.clearCookie('sid')
    return res.json({ success: true })
  })
})

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
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

// Blog routes (mock)
// Public list: supports ?published=true
app.get('/api/blogs', async (req, res) => {
  try {
    const publishedOnly = req.query.published === 'true'
    const list = publishedOnly ? mockData.blogs.filter(b => !!b.isPublished) : mockData.blogs
    // sort by order asc, then publishedAt desc, then createdAt desc
    const sorted = [...list].sort((a, b) => {
      const orderDiff = (a.order || 0) - (b.order || 0)
      if (orderDiff !== 0) return orderDiff
      const aPub = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const bPub = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      if (bPub !== aPub) return bPub - aPub
      const aC = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bC = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bC - aC
    })
    res.json({ success: true, data: sorted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get a single blog by slug (public, mock)
app.get('/api/blogs/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const blog = mockData.blogs.find(b => b.slug === slug)
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' })
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create blog (admin)
app.post('/api/blogs', requireAdmin, async (req, res) => {
  try {
    const { title, slug, content } = req.body
    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, error: 'title, slug and content are required' })
    }
    const exists = mockData.blogs.find(b => b.slug === slug)
    if (exists) return res.status(400).json({ success: false, error: 'slug already exists' })

    const now = new Date()
    const blog = {
      _id: Date.now().toString(),
      title,
      slug,
      excerpt: req.body.excerpt || '',
      content,
      coverImage: req.body.coverImage || '',
      category: req.body.category || '',
      
      author: req.body.author || 'Admin',
      isPublished: !!req.body.isPublished,
      order: Number.isFinite(req.body.order) ? req.body.order : 0,
      publishedAt: req.body.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now
    }
    mockData.blogs.push(blog)
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Update blog (admin)
app.put('/api/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const idx = mockData.blogs.findIndex(b => b._id === id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'Blog not found' })

    const current = mockData.blogs[idx]
    const next = { ...current, ...req.body, updatedAt: new Date() }
    if (next.isPublished && !next.publishedAt) next.publishedAt = new Date()
    mockData.blogs[idx] = next
    res.json({ success: true, data: mockData.blogs[idx] })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Delete blog (admin)
app.delete('/api/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const before = mockData.blogs.length
    mockData.blogs = mockData.blogs.filter(b => b._id !== id)
    if (mockData.blogs.length === before) return res.status(404).json({ success: false, error: 'Blog not found' })
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
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

// Team Members routes (mock)
app.get('/api/team-members', async (req, res) => {
  try {
    const activeOnly = req.query.active === 'true'
    const list = activeOnly ? mockData.teamMembers.filter(m => !!m.isActive) : mockData.teamMembers
    const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0))
    res.json({ success: true, data: sorted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/team-members', requireAdmin, async (req, res) => {
  try {
    const { name, designation } = req.body
    if (!name || !designation) return res.status(400).json({ success: false, error: 'name and designation are required' })
    const member = { _id: Date.now().toString(), createdAt: new Date(), ...req.body }
    mockData.teamMembers.push(member)
    res.json({ success: true, data: member })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/team-members/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const idx = mockData.teamMembers.findIndex(m => m._id === id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'Team member not found' })
    mockData.teamMembers[idx] = { ...mockData.teamMembers[idx], ...req.body }
    res.json({ success: true, data: mockData.teamMembers[idx] })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/team-members/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const before = mockData.teamMembers.length
    mockData.teamMembers = mockData.teamMembers.filter(m => m._id !== id)
    if (mockData.teamMembers.length === before) return res.status(404).json({ success: false, error: 'Team member not found' })
    res.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
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
