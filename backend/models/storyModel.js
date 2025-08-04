import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150x150?text=User"
  },
  storyImage: {
    type: String,
    default: null
  },
  story: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  purchaseDate: {
    type: Date
  },
  productCategory: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
storySchema.index({ isApproved: 1, featured: 1, createdAt: -1 });

const Story = mongoose.model('Story', storySchema);
export default Story;
