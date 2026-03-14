import mongoose,{ObjectId} from 'mongoose'

// Define the Schema
const masterProductSchema = new mongoose.Schema({
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Links to the User collection
  },

  catagory: {
    type: String,
    required: true
  },

  name: { 
    type: String, 
    required: true 
  },
  sku: { 
    type: String, 
    unique: true, 
    required: true 
  },
  description: { 
    type: String 
  },
  images:[{ 
    type: String // Array of Cloudinary URLs
  }],
  basePrice: { 
    type: Number, 
    required: true 
  },
  stockQuantity: { 
    type: Number, 
    required: true,
    min: [0, 'Stock cannot be negative']
  },
  minStockLevel: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

// Create and export the Model
const MasterProduct = mongoose.model('MasterProduct', masterProductSchema);

export default MasterProduct;