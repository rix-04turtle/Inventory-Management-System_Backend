import mongoose from 'mongoose'

// Define the Schema
const B2BOrderSchema = new mongoose.Schema({
  _id: ObjectId,
  retailerId: { type: ObjectId, ref: 'User' },
  adminId: { type: ObjectId, ref: 'User' },
  items:[
    {
      masterProductId: { type: ObjectId, ref: 'MasterProduct' },
      quantity: { type: Number },
      priceAtPurchase: { type: Number } // Wholesale price at the time of buying
    }
  ],
  totalAmount: { type: Number },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'] }
  },
  orderStatus: { type: String, enum:['PROCESSING', 'SHIPPED', 'DELIVERED'] },
  createdAt: Date
})
// Create and export the Model
const B2BOrder = mongoose.model('B2BOrder', B2BOrderSchema);


export default B2BOrder;