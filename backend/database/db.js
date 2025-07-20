import mongoose from "mongoose";

const URI = 'mongodb+srv://heartisans_admin:heartisans@cluster0.efjikoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/heartisans_main'

export const connectDB = async()=> {
  try{
    await mongoose.connect(URI);
    console.log("Database Connection successful");
  }
  catch(err){
    console.error("Database connection failed");
    process.exit(0);
  }
}