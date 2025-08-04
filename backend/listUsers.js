import mongoose from 'mongoose';
import { User } from './models/userModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}, 'userName email isAdmin isArtisan').sort({ joiningDate: -1 });

    console.log('📋 All Users:');
    console.log('='.repeat(60));
    
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.userName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Admin: ${user.isAdmin ? '✅ YES' : '❌ NO'}`);
        console.log(`   Artisan: ${user.isArtisan ? '✅ YES' : '❌ NO'}`);
        console.log('-'.repeat(40));
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listUsers();
