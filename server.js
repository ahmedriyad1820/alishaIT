import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

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
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

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

app.put('/api/project-items/:id', async (req, res) => {
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

// Product Items CRUD
app.get('/api/product-items', async (req, res) => {
  try {
    const items = await ProductItem.find().sort({ createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/product-items', async (req, res) => {
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

app.put('/api/product-items/:id', async (req, res) => {
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

app.delete('/api/product-items/:id', async (req, res) => {
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

app.post('/api/categories', async (req, res) => {
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

app.put('/api/categories/:id', async (req, res) => {
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

app.delete('/api/categories/:id', async (req, res) => {
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
