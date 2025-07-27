import {model, Schema} from 'mongoose'

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
    type: Schema.Types.ObjectId,
    ref: 'Heartisans_user',
    required: false // Make optional for subscription payments
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
})

export const orderModel = model('Heartisans_order', orderSchema);
