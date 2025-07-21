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
  }
})

export const userModel = model('Heartisans_user',userSchema);