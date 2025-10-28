// MongoDB Connection Troubleshooting Guide

## 🔧 MongoDB Atlas Connection Issues

### Current Problem:
- **Error**: `querySrv ENOTFOUND _mongodb._tcp.cluster0.8qgqj.mongodb.net`
- **Cause**: DNS resolution failure for MongoDB Atlas cluster

### 🛠️ Solutions to Try:

#### 1. **Check MongoDB Atlas Cluster Status**
- Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
- Verify your cluster is running (not paused)
- Check if cluster name is correct: `cluster0.8qgqj`

#### 2. **Update IP Whitelist**
- In MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to allow all IPs (for testing)
- Or add your current IP address

#### 3. **Verify Database User**
- In MongoDB Atlas → Database Access
- Ensure user `mdriyadahmed` exists
- Check password is correct: `mdriyadahmed123`
- Ensure user has read/write permissions

#### 4. **Test Connection String**
Try this updated connection string:
```
mongodb+srv://mdriyadahmed:mdriyadahmed123@cluster0.8qgqj.mongodb.net/alisha-it-solutions?retryWrites=true&w=majority
```

#### 5. **Alternative: Use MongoDB Compass**
- Download MongoDB Compass
- Test connection with the same credentials
- If Compass works, the issue is with the Node.js connection

### 🚀 Quick Fix for Development:

If MongoDB Atlas is not accessible, you can:

1. **Use Local MongoDB** (if installed):
   ```javascript
   const MONGODB_URI = 'mongodb://localhost:27017/alisha-it-solutions'
   ```

2. **Use MongoDB Atlas Free Tier**:
   - Create a new cluster
   - Use the new connection string

3. **Use Mock Data** (temporary):
   - The app will work with mock data until MongoDB is fixed

### 📞 Next Steps:
1. Check MongoDB Atlas dashboard
2. Verify cluster is running
3. Update IP whitelist
4. Test with MongoDB Compass
5. Try the updated connection string

The admin login will work once MongoDB connection is established!
