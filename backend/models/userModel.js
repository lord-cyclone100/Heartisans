import {model, Schema} from 'mongoose'

const userSchema = new Schema({
  userName:{
    type:String,
    require:true,
    unique:true,
  },
  email:{
    type:String,
    require:true,
    unique:true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
})

export const userModel = model('Heartisans_user',userSchema);