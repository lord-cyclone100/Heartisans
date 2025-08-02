import mongoose from 'mongoose';

const resaleSchema = new mongoose.Schema({
  // Product Information
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Art', 'Pottery', 'Fashion', 'Crafts', 'Crochet', 'Accessories', 'Jewelry', 'Textiles', 'Woodwork', 'Metalwork', 'Paintings', 'Sculptures']
  },
  description: {
    type: String,
    required: true
  },
  
  // Pricing Information
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Condition Information
  condition: {
    type: String,
    required: true,
    enum: ['with-tag', 'without-tag', 'lesser-quality']
  },
  conditionDetails: {
    title: String,
    description: String,
    priceMultiplier: Number
  },
  
  // Images
  images: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: String,
  sellerContact: String,
  
  // SAP AI Analytics
  sapAnalytics: {
    pricePrediction: {
      suggestedPrice: Number,
      priceRange: {
        min: Number,
        max: Number
      },
      confidence: Number,
      marketPosition: String,
      recommendations: [String]
    },
    generatedDescription: String,
    aiVersion: String,
    timestamp: Date
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive', 'pending'],
    default: 'active'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  
  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  interestedBuyers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contactedAt: {
      type: Date,
      default: Date.now
    },
    message: String
  }],
  
  // Timestamps
  listedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  soldAt: Date,
  
  // Location
  location: {
    state: String,
    city: String,
    pincode: String
  },
  
  // Additional Metadata
  tags: [String],
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedUntil: Date
}, {
  timestamps: true
});

// Indexes for better query performance
resaleSchema.index({ category: 1, status: 1 });
resaleSchema.index({ seller: 1, status: 1 });
resaleSchema.index({ currentPrice: 1 });
resaleSchema.index({ listedAt: -1 });
resaleSchema.index({ condition: 1 });

// Virtual for price discount percentage
resaleSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.currentPrice) {
    return Math.round(((this.originalPrice - this.currentPrice) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for days since listed
resaleSchema.virtual('daysSinceListed').get(function() {
  if (this.listedAt) {
    const now = new Date();
    const diffTime = Math.abs(now - this.listedAt);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Middleware to update the updatedAt field
resaleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find active listings
resaleSchema.statics.findActive = function() {
  return this.find({ status: 'active', isVisible: true });
};

// Static method to find by category
resaleSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category, 
    status: 'active', 
    isVisible: true 
  }).sort({ listedAt: -1 });
};

// Instance method to mark as sold
resaleSchema.methods.markAsSold = function() {
  this.status = 'sold';
  this.soldAt = new Date();
  return this.save();
};

// Instance method to increment views
resaleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Resale', resaleSchema);
