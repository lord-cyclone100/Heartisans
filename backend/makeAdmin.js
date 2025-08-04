import mongoose from 'mongoose';
import { User } from './models/userModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const makeUserAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Ask for email/username to update
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log('Usage: node makeAdmin.js <email_or_username>');
      process.exit(1);
    }

    const identifier = args[0];
    
    // Find user by email or username
    const user = await User.findOne({ 
      $or: [
        { email: identifier },
        { userName: identifier }
      ]
    });

    if (!user) {
      console.log(`User with email or username "${identifier}" not found`);
      process.exit(1);
    }

    // Update user to admin
    user.isAdmin = true;
    await user.save();

    console.log(`✅ User "${user.userName}" (${user.email}) is now an admin!`);
    console.log(`Admin status: ${user.isAdmin}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeUserAdmin();
