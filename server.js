import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import session from 'express-session'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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
app.use('/uploads', express.static(uploadsDir))

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

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/services')) {
    console.log(`${req.method} ${req.path} - Headers:`, { origin: req.headers.origin, cookie: req.headers.cookie })
  }
  next()
})

// Session setup
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
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

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
  phoneNumber: { type: String, trim: true, default: '' },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phoneNumber: { type: String, trim: true, default: '' },
  service: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'quoted', 'accepted', 'rejected'], default: 'pending' },
  quotedAmount: { type: Number, default: 0 },
  remark: { type: String, trim: true, default: '' },
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
  image: { type: String, trim: true }, // URL to uploaded image
  manager: { type: String, trim: true },
  url: { type: String, trim: true },
  date: { type: Date, required: true },
  client: { type: String, trim: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
})

const ProjectItem = mongoose.model('ProjectItem', projectItemSchema)

// Product item schema for Admin-managed products
const productItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: '📦' },
  image: { type: String, trim: true }, // URL to uploaded image
  price: { type: String, trim: true },
  category: { type: String, trim: true },
  features: [{ type: String, trim: true }],
  specifications: { type: String, trim: true },
  availability: { type: String, default: 'In Stock', trim: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
})

const ProductItem = mongoose.model('ProductItem', productItemSchema)

// Service item schema for Admin-managed services
const serviceItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: '🛠️' }, // Emoji or text icon
  iconImage: { type: String, trim: true }, // URL to uploaded icon image
  image: { type: String, trim: true }, // URL to uploaded image
  category: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

const ServiceItem = mongoose.model('ServiceItem', serviceItemSchema)

// Category schema for dynamic category management
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  icon: { type: String, default: '📁' },
  color: { type: String, default: '#3B82F6' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

const Category = mongoose.model('Category', categorySchema)

// Slider item schema and config for homepage hero slider
const sliderItemSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  caption: { type: String, trim: true },
  image: { type: String, required: true, trim: true },
  link: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

const sliderConfigSchema = new mongoose.Schema({
  // single document collection: keep latest by upsert
  intervalMs: { type: Number, default: 30000 },
  updatedAt: { type: Date, default: Date.now }
})

const SliderItem = mongoose.model('SliderItem', sliderItemSchema)
const SliderConfig = mongoose.model('SliderConfig', sliderConfigSchema)

// Team member schema
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  photo: { type: String, trim: true },
  bio: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  socials: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },
  createdAt: { type: Date, default: Date.now }
})

const TeamMember = mongoose.model('TeamMember', teamMemberSchema)

// Blog schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  excerpt: { type: String, trim: true },
  content: { type: String, required: true },
  coverImage: { type: String, trim: true },
  category: { type: String, trim: true },
  author: { type: String, trim: true, default: 'Admin' },
  isPublished: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Text index across main text fields. Exclude tags to avoid array-text index issues
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' })

const Blog = mongoose.model('Blog', blogSchema)

// Testimonial schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  profession: { type: String, required: true, trim: true },
  quote: { type: String, required: true, trim: true },
  avatar: { type: String, trim: true, default: '👤' },
  avatarImage: { type: String, trim: true }, // URL to uploaded avatar image
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Testimonial = mongoose.model('Testimonial', testimonialSchema)

// Ensure blog indexes don't include legacy 'tags' text index
const ensureBlogIndexes = async () => {
  try {
    await mongoose.connection.asPromise()
    const indexes = await Blog.collection.indexes().catch(() => [])
    // Drop ANY existing text index variants (including legacy with tags)
    for (const idx of indexes) {
      const isText = idx.key && Object.values(idx.key).some(v => v === 'text')
      if (isText && idx.name) {
        try { await Blog.collection.dropIndex(idx.name) } catch (_) {}
      }
    }
    // Recreate the correct text index
    await Blog.collection.createIndex({ title: 'text', excerpt: 'text', content: 'text' })
  } catch (e) {
    console.warn('Index maintenance warning for Blog:', e?.message)
  }
}

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
  // Maintain blog indexes (drop legacy tags text index if present)
  ensureBlogIndexes()
})

// Routes

// Auth guard
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next()
  }
  console.log('❌ Unauthorized request to', req.method, req.path, '- Session:', req.session?.adminId || 'none')
  return res.status(401).json({ success: false, error: 'Unauthorized - Please log in again' })
}

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

app.get('/api/quotes/:id', requireAdmin, async (req, res) => {
  try {
    console.log('GET /api/quotes/:id - Request received:', { id: req.params.id, session: req.session?.adminId })
    const { id } = req.params
    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid quote ID format:', id)
      return res.status(400).json({ success: false, error: 'Invalid quote ID format' })
    }
    
    const quote = await Quote.findById(id)
    console.log('Quote found:', quote ? 'Yes' : 'No', 'ID:', id)
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote not found' })
    }
    res.json({ success: true, data: quote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/quotes/:id', requireAdmin, async (req, res) => {
  try {
    console.log('PUT /api/quotes/:id - Request received:', { id: req.params.id, body: req.body, session: req.session?.adminId })
    const { id } = req.params
    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('Invalid quote ID format:', id)
      return res.status(400).json({ success: false, error: 'Invalid quote ID format' })
    }
    
    const { status, quotedAmount, remark } = req.body
    const quote = await Quote.findById(id)
    console.log('Quote found for update:', quote ? 'Yes' : 'No', 'ID:', id)
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote not found' })
    }
    
    if (status !== undefined) quote.status = status
    if (quotedAmount !== undefined) quote.quotedAmount = quotedAmount
    if (remark !== undefined) quote.remark = remark
    quote.updatedAt = new Date()
    
    await quote.save()
    console.log('Quote updated successfully:', quote._id)
    res.json({ success: true, data: quote })
  } catch (error) {
    console.error('Error updating quote:', error)
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id)
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote not found' })
    }
    res.json({ success: true, data: quote })
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

    // Set session
    req.session.adminId = admin._id.toString()
    req.session.username = admin.username
    req.session.role = admin.role

    res.json({ success: true, data: { id: admin._id, username: admin.username, role: admin.role } })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, error: 'Server error. Please try again.' })
  }
})

// Current session info
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

// Logout
app.post('/api/admin/logout', (req, res) => {
  if (!req.session) return res.json({ success: true })
  req.session.destroy(() => {
    res.clearCookie('sid')
    return res.json({ success: true })
  })
})

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
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

app.post('/api/project-items', requireAdmin, async (req, res) => {
  try {
    const { title, description, icon = '🚀', image, manager, url, date, client, rating = 5 } = req.body
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'title, description and date are required' })
    }
    const item = await ProjectItem.create({ title, description, icon, image, manager, url, date, client, rating })
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/project-items/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, icon, image, manager, url, date, client, rating } = req.body
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'title, description and date are required' })
    }
    const item = await ProjectItem.findByIdAndUpdate(id, { title, description, icon, image, manager, url, date, client, rating }, { new: true })
    if (!item) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/project-items/:id', requireAdmin, async (req, res) => {
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

// Product Items CRUD
app.get('/api/product-items', async (req, res) => {
  try {
    const items = await ProductItem.find().sort({ createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/product-items', requireAdmin, async (req, res) => {
  try {
    const { title, description, icon = '📦', image, price, category, features, specifications, availability = 'In Stock', rating = 5 } = req.body
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'title and description are required' })
    }
    const item = await ProductItem.create({ title, description, icon, image, price, category, features, specifications, availability, rating })
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/product-items/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, icon, image, price, category, features, specifications, availability, rating } = req.body
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'title and description are required' })
    }
    const item = await ProductItem.findByIdAndUpdate(id, { title, description, icon, image, price, category, features, specifications, availability, rating }, { new: true })
    if (!item) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/product-items/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const item = await ProductItem.findByIdAndDelete(id)
    if (!item) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Categories CRUD
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/categories/all', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const { name, description, icon = '📁', color = '#3B82F6' } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' })
    }
    const category = await Category.create({ name, description, icon, color })
    res.json({ success: true, data: category })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Category name already exists' })
    }
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, icon, color, isActive } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' })
    }
    const category = await Category.findByIdAndUpdate(id, { name, description, icon, color, isActive }, { new: true })
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    res.json({ success: true, data: category })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Category name already exists' })
    }
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    // First get the category to check its name
    const categoryToDelete = await Category.findById(id)
    if (!categoryToDelete) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    
    // Check if any products are using this category
    const productsUsingCategory = await ProductItem.findOne({ category: { $regex: new RegExp(`^${categoryToDelete.name}$`, 'i') } })
    if (productsUsingCategory) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete category. Products are still using this category.' 
      })
    }
    
    const category = await Category.findByIdAndDelete(id)
    res.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Slider Items CRUD
app.get('/api/sliders', async (req, res) => {
  try {
    const onlyActive = req.query.active === 'true'
    const query = onlyActive ? { isActive: true } : {}
    const sliders = await SliderItem.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: sliders })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/sliders', requireAdmin, async (req, res) => {
  try {
    const { title, caption, image, link, order = 0, isActive = true } = req.body
    if (!image) {
      return res.status(400).json({ success: false, error: 'image is required' })
    }
    const item = await SliderItem.create({ title, caption, image, link, order, isActive })
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.put('/api/sliders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, caption, image, link, order, isActive } = req.body
    const updated = await SliderItem.findByIdAndUpdate(id, { title, caption, image, link, order, isActive }, { new: true })
    if (!updated) return res.status(404).json({ success: false, error: 'Slider not found' })
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

app.delete('/api/sliders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await SliderItem.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ success: false, error: 'Slider not found' })
    res.json({ success: true, message: 'Slider deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Slider configuration (interval)
app.get('/api/slider-config', async (req, res) => {
  try {
    let config = await SliderConfig.findOne()
    if (!config) {
      config = await SliderConfig.create({ intervalMs: 30000 })
    }
    res.json({ success: true, data: config })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/slider-config', requireAdmin, async (req, res) => {
  try {
    const { intervalMs } = req.body
    const value = Number(intervalMs) > 0 ? Number(intervalMs) : 30000
    const config = await SliderConfig.findOneAndUpdate({}, { intervalMs: value, updatedAt: new Date() }, { upsert: true, new: true })
    res.json({ success: true, data: config })
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
    
    res.set('Cache-Control', 'no-store')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json({ success: true, data: pageContent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Blog routes
// Public list: supports ?published=true
app.get('/api/blogs', async (req, res) => {
  try {
    const publishedOnly = req.query.published === 'true'
    const query = publishedOnly ? { isPublished: true } : {}
    const blogs = await Blog.find(query).sort({ order: 1, publishedAt: -1, createdAt: -1 })
    res.json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get a single blog by slug (public)
app.get('/api/blogs/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const normalized = String(slug).trim().toLowerCase()
    const blog = await Blog.findOne({ slug: normalized })
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
    // sanitize legacy field if sent
    if ('tags' in req.body) delete req.body.tags
    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, error: 'title, slug and content are required' })
    }
    const normalizedSlug = String(slug).trim().toLowerCase()
    const exists = await Blog.findOne({ slug: normalizedSlug })
    if (exists) return res.status(400).json({ success: false, error: 'slug already exists' })
    // Allowlist fields only
    const payload = {
      title: req.body.title,
      slug: normalizedSlug,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage,
      category: req.body.category,
      author: req.body.author,
      isPublished: !!req.body.isPublished,
      order: typeof req.body.order === 'number' ? req.body.order : Number(req.body.order) || 0,
      publishedAt: req.body.isPublished ? new Date() : undefined
    }
    const blog = await Blog.create(payload)
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Update blog (admin)
app.put('/api/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    // sanitize legacy field if sent
    if ('tags' in req.body) delete req.body.tags
    // Allowlist fields only
    const update = {
      title: req.body.title,
      slug: typeof req.body.slug === 'string' ? req.body.slug.trim().toLowerCase() : undefined,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage,
      category: req.body.category,
      author: req.body.author,
      isPublished: req.body.isPublished,
      order: typeof req.body.order === 'number' ? req.body.order : Number(req.body.order) || 0,
      publishedAt: req.body.isPublished ? (req.body.publishedAt ? new Date(req.body.publishedAt) : new Date()) : undefined,
      updatedAt: new Date()
    }
    if (update.isPublished && !update.publishedAt) update.publishedAt = new Date()
    const blog = await Blog.findByIdAndUpdate(id, update, { new: true })
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' })
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Delete blog (admin)
app.delete('/api/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' })
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Testimonial routes
// Public list: supports ?active=true
app.get('/api/testimonials', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    
    const activeOnly = req.query.active === 'true'
    const query = activeOnly ? { isActive: true } : {}
    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: testimonials })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create testimonial (admin)
app.post('/api/testimonials', requireAdmin, async (req, res) => {
  try {
    console.log('POST /api/testimonials - Request received:', { body: req.body, session: req.session?.adminId })
    const { name, profession, quote, avatar = '👤', avatarImage = '', rating = 5, isActive = true, order = 0 } = req.body
    if (!name || !profession || !quote) {
      console.error('Testimonial create validation failed:', req.body)
      return res.status(400).json({ success: false, error: 'name, profession and quote are required' })
    }
    console.log('Creating testimonial with data:', { name, profession, quote, avatar, avatarImage, rating, isActive, order })
    const testimonial = await Testimonial.create({ name, profession, quote, avatar, avatarImage, rating, isActive, order })
    console.log('Testimonial created successfully:', testimonial._id)
    res.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Testimonial create error:', error.message, error.stack)
    console.error('Error details - body:', req.body)
    res.status(400).json({ success: false, error: error.message || 'Failed to create testimonial' })
  }
})

// Update testimonial (admin)
app.put('/api/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    console.log('PUT /api/testimonials/:id - Request received:', { id: req.params.id, body: req.body })
    const { id } = req.params
    const { name, profession, quote, avatar, avatarImage, rating, isActive, order } = req.body
    
    const update = {}
    if (name !== undefined) update.name = name
    if (profession !== undefined) update.profession = profession
    if (quote !== undefined) update.quote = quote
    if (avatar !== undefined) update.avatar = avatar
    if (avatarImage !== undefined) update.avatarImage = avatarImage
    if (rating !== undefined) update.rating = rating
    if (isActive !== undefined) update.isActive = isActive
    if (order !== undefined) update.order = typeof order === 'number' ? order : Number(order) || 0
    update.updatedAt = new Date()
    
    const testimonial = await Testimonial.findByIdAndUpdate(id, update, { new: true })
    if (!testimonial) {
      console.error('Testimonial not found:', id)
      return res.status(404).json({ success: false, error: 'Testimonial not found' })
    }
    console.log('Testimonial updated successfully:', testimonial._id)
    res.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Testimonial update error:', error.message, error.stack)
    res.status(400).json({ success: false, error: error.message })
  }
})

// Delete testimonial (admin)
app.delete('/api/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const testimonial = await Testimonial.findByIdAndDelete(id)
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' })
    }
    res.json({ success: true, message: 'Testimonial deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Team Members - public list (supports ?active=true for only public members)
app.get('/api/team-members', async (req, res) => {
  try {
    const activeOnly = req.query.active === 'true'
    const query = activeOnly ? { isActive: true } : {}
    const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: members })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Team Members - create
app.post('/api/team-members', requireAdmin, async (req, res) => {
  try {
    const { name, designation, photo, bio, isActive = true, order = 0, socials = {} } = req.body
    if (!name || !designation) {
      return res.status(400).json({ success: false, error: 'name and designation are required' })
    }
    const member = await TeamMember.create({ name, designation, photo, bio, isActive, order, socials })
    res.json({ success: true, data: member })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Team Members - update
app.put('/api/team-members/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const update = req.body
    const member = await TeamMember.findByIdAndUpdate(id, update, { new: true })
    if (!member) return res.status(404).json({ success: false, error: 'Team member not found' })
    res.json({ success: true, data: member })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Team Members - delete
app.delete('/api/team-members/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const member = await TeamMember.findByIdAndDelete(id)
    if (!member) return res.status(404).json({ success: false, error: 'Team member not found' })
    res.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Services - list (this route must be before /api/services/:id routes)
app.get('/api/services', async (req, res) => {
  try {
    const activeOnly = req.query.active === 'true'
    const query = activeOnly ? { isActive: true } : {}
    const services = await ServiceItem.find(query).sort({ order: 1, createdAt: -1 })
    res.set('Cache-Control', 'no-store')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json({ success: true, data: services })
  } catch (error) {
    console.error('Service list error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Services - create (must be before any /api/services/:id routes)
app.post('/api/services', requireAdmin, async (req, res) => {
  try {
    console.log('POST /api/services - Request received:', { body: req.body, session: req.session?.adminId })
    const { title, description, icon = '🛠️', iconImage = '', image = '', category = '', isActive = true, order = 0 } = req.body
    if (!title || !description) {
      console.error('Service create validation failed:', req.body)
      return res.status(400).json({ success: false, error: 'title and description are required' })
    }
    console.log('Creating service with data:', { title, description, icon, iconImage, image, category, isActive, order })
    const service = await ServiceItem.create({ title, description, icon, iconImage, image, category, isActive, order })
    console.log('Service created successfully:', service._id)
    res.json({ success: true, data: service })
  } catch (error) {
    console.error('Service create error:', error.message, error.stack)
    console.error('Error details - body:', req.body)
    res.status(400).json({ success: false, error: error.message || 'Failed to create service' })
  }
})

// Services - update
app.put('/api/services/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const update = req.body
    const service = await ServiceItem.findByIdAndUpdate(id, update, { new: true })
    if (!service) {
      console.error('Service update not found:', id)
      return res.status(404).json({ success: false, error: 'Service not found' })
    }
    res.json({ success: true, data: service })
  } catch (error) {
    console.error('Service update error:', error, req.params, req.body)
    res.status(400).json({ success: false, error: error.message })
  }
})

// Services - delete
app.delete('/api/services/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const service = await ServiceItem.findByIdAndDelete(id)
    if (!service) {
      console.error('Service delete not found:', id)
      return res.status(404).json({ success: false, error: 'Service not found' })
    }
    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Service delete error:', error, req.params)
    res.status(400).json({ success: false, error: error.message })
  }
})

app.post('/api/pages/:pageName', requireAdmin, async (req, res) => {
  try {
    const { pageName } = req.params
    const { sections, published = false } = req.body
    if (sections && typeof sections !== 'object') {
      return res.status(400).json({ success: false, error: 'sections must be an object' })
    }

    // Deep merge function
    const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val)
    const mergeDeep = (target = {}, source = {}) => {
      const out = { ...(target || {}) }
      Object.keys(source || {}).forEach((key) => {
        const sVal = source[key]
        const tVal = out[key]
        if (Array.isArray(sVal)) {
          // For arrays (like FAQ questions), replace the entire array
          out[key] = sVal
        } else if (isObject(tVal) && isObject(sVal)) {
          out[key] = mergeDeep(tVal, sVal)
        } else {
          out[key] = sVal
        }
      })
      return out
    }
    
    let pageContent = await PageContent.findOne({ pageName })
    
    if (pageContent) {
      const existingSections = (pageContent.sections && typeof pageContent.sections.toObject === 'function')
        ? pageContent.sections.toObject()
        : (pageContent.sections || {})
      pageContent.sections = mergeDeep(existingSections, sections || {})
      pageContent.published = published
      pageContent.lastUpdated = new Date()
      await pageContent.save()
    } else {
      pageContent = new PageContent({
        pageName,
        sections: sections || {},
        published,
        lastUpdated: new Date()
      })
      await pageContent.save()
    }
    
    res.set('Cache-Control', 'no-store')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.json({ success: true, data: pageContent })
  } catch (error) {
    console.error('Error updating page content:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Image upload route
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    
    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    })
  } catch (error) {
    console.error('Image upload error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Image upload failed' 
    })
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
      statistics: {
        items: [
          { icon: '👥', label: 'Happy Clients', number: '12345' },
          { icon: '✓', label: 'Projects Done', number: '12345' },
          { icon: '🏆', label: 'Win Awards', number: '12345' }
        ]
      },
      services: {
        subtitle: 'OUR SERVICES',
        title: 'We Provide The Best Service For You',
        description: 'We offer comprehensive IT solutions tailored to your business needs. Our expert team delivers cutting-edge technology services.'
      },
      whyChooseUs: {
        subtitle: 'WHY CHOOSE US',
        title: 'We Are Here to Grow Your Business Exponentially',
        image: '',
        features: [
          { icon: '⚙️', title: 'Best In Industry', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
          { icon: '🏆', title: 'Award Winning', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
          { icon: '👥', title: 'Professional Staff', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' },
          { icon: '📞', title: '24/7 Support', description: 'Magna sea eos sit dolor, ipsum amet lorem diam dolor eos et diam dolor' }
        ]
      },
      quote: {
        subtitle: 'REQUEST A QUOTE',
        title: 'Need A Free Quote? Please Feel Free to Contact Us',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        phoneNumber: '+012 345 6789'
      },
      faq: {
        subtitle: 'GENERAL FAQS',
        title: 'Any Question? Check the FAQs or Contact Us',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        buttonText: 'Explore More FAQs',
        questions: [
          {
            question: 'How to build a website?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            question: 'How long will it take to get a new website?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            question: 'Do you only create HTML websites?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            question: 'Will my website be mobile-friendly?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          },
          {
            question: 'Will you maintain my site for me?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
          }
        ]
      },
      testimonials: {
        subtitle: 'TESTIMONIAL',
        title: 'What Our Clients Say About Our Digital Services'
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
      },
      timeline: {
        subtitle: 'OUR STORY',
        title: '10 Years of Our Journey to Help Your Business',
        item1: {
          date: '01 Jun, 2021',
          title: 'Lorem ipsum dolor',
          description: 'Lorem ipsum dolor sit amet elit ornare velit non'
        },
        item2: {
          date: '01 Jan, 2021',
          title: 'Lorem ipsum dolor',
          description: 'Lorem ipsum dolor sit amet elit ornare velit non'
        },
        item3: {
          date: '01 Jun, 2020',
          title: 'Lorem ipsum dolor',
          description: 'Lorem ipsum dolor sit amet elit ornare velit non'
        }
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
