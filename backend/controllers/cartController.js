import { cartModel } from '../models/cartModel.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, productName, productImageUrl, productPrice, productCategory } = req.body;
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, productName, productImageUrl, productPrice, productCategory }]
      });
    } else {
      const item = cart.items.find(i => i.productId.toString() === productId);
      if (!item) {
        cart.items.push({ productId, productName, productImageUrl, productPrice, productCategory });
      }
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.json({ success: true });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};