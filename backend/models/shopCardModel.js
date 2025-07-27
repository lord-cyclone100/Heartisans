import {model, Schema} from 'mongoose'

const shopCardSchema = new Schema({
  productName:{
    type:String,
    required:true,
    // unique:true,
  },
  productPrice:{
    type:String,
    required:true,
    // unique:true,
  },
  productState:{
    type:String,
    required:true,
    // unique:true,
  },
  productCategory:{
    type:String,
    required:true,
    // unique:true,
  },
  productSellerName:{
    type:String,
    required:true,
    // unique:true,
  },
  sellerId:{
    type: Schema.Types.ObjectId,
    ref: 'Heartisans_user',
    required: false, // Making it optional for backward compatibility
  },
  productImageUrl: {
    type: String,
    required: false,
    default:"https://i.pinimg.com/originals/b5/d9/9a/b5d99a457840cabba912b05ea4cc7c77.jpg"
  },
  productDescription:{
    type:String,
    required:true,
    // unique:true,
  },
  productMaterial:{
    type:String,
    required:true,
    // unique:true,
  },
  productWeight:{
    type:String,
    required:true,
    // unique:true,
  },
  productColor:{
    type:String,
    required:true,
    // unique:true,
  },
  isCodAvailable:{
    type:Boolean,
    default:false
  },
})

export const shopCardModel = model('Heartisans_shopcard',shopCardSchema);