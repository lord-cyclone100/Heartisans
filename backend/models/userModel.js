import {model, Schema} from 'mongoose'

const userSchema = new Schema({
  userName:{
    type:String,
    required:true,
    unique:true,
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
  }
})

export const userModel = model('Heartisans_user',userSchema);