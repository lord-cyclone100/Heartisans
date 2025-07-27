import {model, Schema} from 'mongoose'

const userSchema = new Schema({
  userName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  isArtisan:{
    type:Boolean,
    default:false,
    required:true,
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now // Automatically sets to current date/time on creation
  },
  balance:{
    type:Number,
    default:0
  },
  hasArtisanSubscription:{
    type:Boolean,
    default:false
  },
  subscriptionDate: {
    type: Date,
    required: false
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: false
  },
  subscriptionEndDate: {
    type: Date,
    required: false
  }
})

export const userModel = model('Heartisans_user',userSchema);