import mongoose from 'mongoose'

// Define the Schema
const notificationsSchema = new mongoose.Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User' }, // Can be Admin or Retailer
  type: { type: String, enum: ['LOW_STOCK', 'ORDER_PLACED', 'SYSTEM'] },
  message: { type: String },
  relatedEntityId: { type: ObjectId }, // e.g., MasterProductId or RetailerInventoryId
  isRead: { type: Boolean, default: false },
  createdAt: Date
})
// Create and export the Model
const Notification = mongoose.model('Notification', notificationsSchema);

export default Notification;