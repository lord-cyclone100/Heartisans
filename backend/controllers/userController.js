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
