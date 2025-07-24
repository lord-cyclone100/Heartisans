import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "shopCardModel", 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  // Optionally, store snapshot of product details for quick display
  productName: String,
  productImageUrl: String,
  productPrice: Number,
  productCategory: String
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "userModel", 
    required: true, 
    unique: true 
  },
  items: [cartItemSchema],
});

export const cartModel = mongoose.model("Cart", cartSchema);