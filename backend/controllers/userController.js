import { User } from '../models/userModel.js';

export const createUser = async (req, res) => {
  try {
    const { userName, email, imageUrl, fullName } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ userName, email, imageUrl, fullName });
    }
    res.status(201).json({ message: "User saved", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to save user" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateArtisanStatus = async (req, res) => {
  try {
    const { isArtisan } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isArtisan },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update artisan status" });
  }
}; 

export const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ joiningDate: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { hasArtisanSubscription, subscriptionType, subscriptionDate } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { hasArtisanSubscription, subscriptionType, subscriptionDate },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update subscription" });
  }
};

export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.balance || 0, userName: user.userName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
};

export const getSellerEarnings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // 🔄 LAZY MIGRATION: Check if user needs migration
    if (!user.isCommissionMigrated) {
      console.log(`🔄 Performing lazy migration for user: ${user.userName}`);
      await performUserMigration(user);
      // Reload user data after migration
      const updatedUser = await User.findById(req.params.id);
      return getSellerEarnings({ params: { id: req.params.id } }, res);
    }
    
    // Convert to numbers to ensure proper calculations
    const totalEarnings = Number(user.totalEarnings || 0);
    const currentBalance = Number(user.balance || 0);
    const isCommissionActive = totalEarnings >= 1000;
    const freePostingRemaining = Math.max(0, 1000 - totalEarnings);
    
    res.json({ 
      totalEarnings,
      currentBalance,
      isCommissionActive,
      commissionRate: isCommissionActive ? 10 : 0,
      freePostingRemaining
    });
  } catch (err) {
    console.error('Seller earnings error:', err);
    res.status(500).json({ error: "Failed to fetch seller earnings" });
  }
};

// 🔧 LAZY MIGRATION FUNCTION
async function performUserMigration(user) {
  try {
    console.log(`📊 Migrating user: ${user.userName} (ID: ${user._id})`);
    
    // Import the order model for migration
    const { orderModel } = await import('../models/orderModel.js');
    
    // Get all paid orders for this user
    const paidOrders = await orderModel.find({ 
      sellerId: user._id, 
      status: 'paid' 
    }).sort({ createdAt: 1 });
    
    console.log(`📋 Found ${paidOrders.length} paid orders for migration`);
    
    let calculatedEarnings = 0;
    let calculatedBalance = 0;
    
    if (paidOrders.length > 0) {
      // Calculate from order history
      for (const order of paidOrders) {
        const productPrice = Number(order.productDetails?.productPrice) || 
                           (Number(order.amount) - Number(order.platformFee || 0));
        
        calculatedEarnings += productPrice;
        
        // Apply commission logic progressively
        const wasCommissionActive = calculatedEarnings > 1000;
        const sellerRevenue = wasCommissionActive 
          ? Math.round(productPrice * 0.9)
          : productPrice;
        
        calculatedBalance += sellerRevenue;
      }
      
      console.log(`💰 Calculated from orders: ₹${calculatedEarnings} earnings, ₹${calculatedBalance} balance`);
    } else {
      // No orders - check if user has existing balance that suggests legacy earnings
      const currentBalance = Number(user.balance || 0);
      const currentEarnings = Number(user.totalEarnings || 0);
      
      if (currentBalance > 1000 || currentEarnings > 1000) {
        // Likely a legacy user - preserve their data but mark as migrated
        calculatedEarnings = currentEarnings;
        calculatedBalance = currentBalance;
        console.log(`📂 Legacy user detected - preserving existing data`);
      }
    }
    
    // Update user with migrated data
    await User.findByIdAndUpdate(user._id, {
      totalEarnings: calculatedEarnings,
      balance: calculatedBalance,
      isCommissionMigrated: true,
      legacyEarnings: Number(user.totalEarnings || 0) // Store original for audit
    });
    
    console.log(`✅ Migration completed for ${user.userName}: ₹${calculatedEarnings} total, ₹${calculatedBalance} balance`);
    
  } catch (error) {
    console.error(`❌ Migration failed for user ${user.userName}:`, error);
    // Mark as migrated even if failed to prevent infinite loops
    await User.findByIdAndUpdate(user._id, { isCommissionMigrated: true });
  }
}
