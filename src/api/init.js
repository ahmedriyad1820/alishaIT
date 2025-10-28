import connectDB from '../config/database.js'
import { initializeAdmin } from './database.js'

// Initialize database connection and default data
export const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Initialize default admin user
    await initializeAdmin()
    
    console.log('✅ Database initialization completed')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  }
}

export default initializeDatabase
