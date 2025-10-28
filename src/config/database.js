import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://mdriyadahmed:mdriyadahmed123@cluster0.8qgqj.mongodb.net/alisha-it-solutions?retryWrites=true&w=majority'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
