import mongoose from 'mongoose'

// Define the Schema
const ChatSessionSchema = new mongoose.Schema({
  _id: ObjectId,
  customerId: { type: ObjectId, ref: 'User' },
  messages:[
    {
      sender: { type: String, enum: ['USER', 'BOT'] },
      text: { type: String },
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
})
// Create and export the Model
const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

export default ChatSession;