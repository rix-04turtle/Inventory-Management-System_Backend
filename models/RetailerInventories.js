import mongoose from 'mongoose'

// Define the Schema
const retailerInventorySchema = new mongoose.Schema({
  _id: ObjectId,
  retailerId: { type: ObjectId, ref: 'User' },
  masterProductId: { type: ObjectId, ref: 'MasterProduct' },
  
  // Retailer customizable fields
  retailerPrice: { type: Number, required: true }, // Selling price to end users
  retailerDescription: { type: String }, 
  stockQuantity: { type: Number, required: true }, // Current stock in the retailer's physical store
  
  status: { type: String, enum:['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
  createdAt: Date,
  updatedAt: Date
})
// Create and export the Model
const RetailerInventory = mongoose.model('RetailerInventory', retailerInventorySchema);

export default RetailerInventory;