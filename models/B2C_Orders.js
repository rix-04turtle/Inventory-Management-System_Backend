import mongoose from 'mongoose'

// Define the Schema
const B2COrderSchema = new mongoose.Schema({
  _id: ObjectId,
  customerId: { type: ObjectId, ref: 'User' },
  items:[
    {
      retailerId: { type: ObjectId, ref: 'User' },
      retailerInventoryId: { type: ObjectId, ref: 'RetailerInventory' },
      quantity: { type: Number },
      priceAtPurchase: { type: Number }
    }
  ],
  totalAmount: { type: Number },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum:['PENDING', 'SUCCESS', 'FAILED'] }
  },
  orderStatus: { type: String, enum:['PLACED', 'READY_FOR_PICKUP', 'DELIVERED'] },
  createdAt: Date
})
// Create and export the Model
const B2COrder = mongoose.model('B2COrder', B2COrderSchema);

export default B2COrder;