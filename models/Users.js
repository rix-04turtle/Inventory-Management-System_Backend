import mongoose from 'mongoose'

// Define the Schema
const userSchema = new mongoose.Schema({
  _id: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum:['ADMIN', 'RETAILER', 'CUSTOMER'], required: true },
  phone: { type: String },
  
  // Specific to Retailers
  storeName: { type: String },
  storeLocation: {
    // GeoJSON format for location-based searching/comparisons
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }, // [longitude, latitude]
    addressText: { type: String }
  },
  
  createdAt: Date,
  updatedAt: Date
})
// Create and export the Model
const User = mongoose.model('User', userSchema);
export default User;