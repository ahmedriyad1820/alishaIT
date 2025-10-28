import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
// Prefer environment variable; fall back to the previous default URI
const MONGODB_URI = (process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0)
  ? process.env.MONGODB_URI
  : 'mongodb+srv://ahmedriyad1820:alishaIT@alishait.bu7zbyc.mongodb.net/alisha-it-solutions?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    console.log('💡 Please check:')
    console.log('   1. Your internet connection')
    console.log('   2. MongoDB Atlas cluster status')
    console.log('   3. IP whitelist settings in MongoDB Atlas')
    console.log('   4. Database user permissions')
  })

// Schemas
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  service: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'quoted', 'accepted', 'rejected'], default: 'pending' },
  quotedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  product: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true, min: 0 },
  message: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

// Page Content Schema for dynamic content management
const pageContentSchema = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true, trim: true },
  sections: { type: Map, of: mongoose.Schema.Types.Mixed },
  lastUpdated: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
}, { timestamps: true })

// Models
const Contact = mongoose.model('Contact', contactSchema)
const Quote = mongoose.model('Quote', quoteSchema)
const Order = mongoose.model('Order', orderSchema)
const Admin = mongoose.model('Admin', adminSchema)
const PageContent = mongoose.model('PageContent', pageContentSchema)

// Project item schema for Admin-managed projects
const projectItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: '🚀' },
  manager: { type: String, trim: true },
  url: { type: String, trim: true },
  date: { type: Date, required: true },
  client: { type: String, trim: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
})

const ProjectItem = mongoose.model('ProjectItem', projectItemSchema)

// Initialize default admin
const initializeAdmin = async () => {
  try {
    // Wait for MongoDB connection
    await mongoose.connection.asPromise()
    
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
    } else {
      console.log('ℹ️  Admin user already exists:', existingAdmin.username)
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message)
    console.log('💡 Admin user will be created when first login attempt is made')
  }
}

// Initialize admin after connection
mongoose.connection.on('connected', () => {
  console.log('🔄 Initializing admin user...')
  initializeAdmin()
})

// Routes

// Contact routes
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()
    res.json({ success: true, data: contact })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Quote routes
app.post('/api/quotes', async (req, res) => {
  try {
    const quote = new Quote(req.body)
    await quote.save()
    res.json({ success: true, data: quote })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 })
    res.json({ success: true, data: quotes })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Order routes
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        error: 'Database connection not available. Please try again later.' 
      })
    }
    
    let admin = await Admin.findOne({ username })
    
    // If admin doesn't exist and credentials are correct, create it
    if (!admin && username === 'Dracula' && password === 'Admin') {
      admin = new Admin({
        username: 'Dracula',
        password: 'Admin',
        role: 'admin'
      })
      await admin.save()
      console.log('✅ Admin user created during login')
    }
    
    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    // Update last login
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })
    
    res.json({ success: true, data: { id: admin._id, username: admin.username, role: admin.role } })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, error: 'Server error. Please try again.' })
  }
})

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [totalContacts, totalQuotes, totalOrders] = await Promise.all([
      Contact.countDocuments(),
      Quote.countDocuments(),
      Order.countDocuments()
    ])

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    res.json({
      success: true,
      data: {
        totalContacts,
        totalQuotes,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Project Items CRUD (minimal: list + create)
app.get('/api/project-items', async (req, res) => {
  try {
    const items = await ProjectItem.find().sort({ date: -1, createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/project-items', async (req, res) => {
  try {
    const { title, description, icon = '🚀', manager, url, date, client, rating = 5 } = req.body
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'title, description and date are required' })
    }
    const item = await ProjectItem.create({ title, description, icon, manager, url, date, client, rating })
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/project-items/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, icon, manager, url, date, client, rating } = req.body
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'title, description and date are required' })
    }
    const item = await ProjectItem.findByIdAndUpdate(id, { title, description, icon, manager, url, date, client, rating }, { new: true })
    if (!item) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/project-items/:id', async (req, res) => {
  try {
    const { id } = req.params
    const item = await ProjectItem.findByIdAndDelete(id)
    if (!item) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Page Content routes
app.get('/api/pages/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params
    let pageContent = await PageContent.findOne({ pageName })
    
    // If page doesn't exist, create default content
    if (!pageContent) {
      pageContent = new PageContent({
        pageName,
        sections: getDefaultPageContent(pageName),
        published: false
      })
      await pageContent.save()
    }
    
    res.json({ success: true, data: pageContent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/pages/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params
    const { sections, published = false } = req.body
    
    let pageContent = await PageContent.findOne({ pageName })
    
    if (pageContent) {
      // Update existing page
      pageContent.sections = sections
      pageContent.published = published
      pageContent.lastUpdated = new Date()
      await pageContent.save()
    } else {
      // Create new page
      pageContent = new PageContent({
        pageName,
        sections,
        published,
        lastUpdated: new Date()
      })
      await pageContent.save()
    }
    
    res.json({ success: true, data: pageContent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Image upload route
app.post('/api/upload/image', async (req, res) => {
  try {
    // For now, we'll return a placeholder URL
    // In a real application, you'd handle file upload to cloud storage
    const imageUrl = `/uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    
    res.json({ 
      success: true, 
      data: { 
        url: imageUrl,
        message: 'Image upload simulated - implement actual file upload in production'
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
  res.json({ status: 'OK', message: 'Server is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
})
