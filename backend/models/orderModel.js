import { model, Schema } from 'mongoose';

// Define the order schema
const orderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'Heartisans_user',
    required: true
  },
  sellerId: {
    type: Schema.Types.Mixed, // Change from ObjectId to Mixed
    required: false
  },
  productDetails: {
    productId: {
      type: Schema.Types.Mixed, // Allow both ObjectId and String
      required: false // Make optional for subscription payments
    },
    productName: String,
    productPrice: String,
    productCategory: String,
    productImage: String
  },
  customerDetails: {
    name: String,
    email: String,
    mobile: String,
    address: String
  },
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  isSubscription: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: function() { return this.isSubscription; }
  },
  adminBonusProcessed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'expired'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    paymentMethod: String,
    paymentTime: Date,
    bankReference: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ updatedAt: 1 });

// Export the order model
export const orderModel = model('Heartisans_order', orderSchema);