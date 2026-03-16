import mongoose from 'mongoose'

// Define the Schema
const CartSchema = new mongoose.Schema({
  
  customerId: { type: ObjectId, ref: 'User' },
  items:[
    {
      retailerInventoryId: { type: ObjectId, ref: 'RetailerInventory' },
      quantity: { type: Number }
    }
  ],
  updatedAt: Date
})
// Create and export the Model
const Cart = mongoose.model('Cart', CartSchema);

export default Cart;