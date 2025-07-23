import { model, Schema } from 'mongoose'

const bidSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Heartisans_user', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  time: { 
    type: Date, 
    default: Date.now 
  }
});

const auctionSchema = new Schema({
  productName: { 
    type: String, 
    required: true 
  },
  productDescription: { 
    type: String, 
    required: true 
  },
  productImageUrl: { 
    type: String, 
    required: true 
  },
  productMaterial: { 
    type: String 
  },
  productWeight: { 
    type: String 
  },
  productColor: { 
    type: String 
  },
  sellerId: { 
    type: String, 
    // ref: 'Heartisans_user', 
    required: true 
  },
  sellerName: { 
    type: String, required: 
    true 
  },
  basePrice: { 
    type: Number, 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  }, // in seconds or minutes
  bids: [bidSchema], // Array of bids
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const auctionModel = model('Heartisans_auction', auctionSchema);