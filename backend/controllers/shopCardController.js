import { shopCardModel } from '../models/shopCardModel.js';

export const createShopCard = async (req, res) => {
  try {
    console.log('=== SHOP CARD CREATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('sellerId received:', req.body.sellerId);
    console.log('sellerId type:', typeof req.body.sellerId);
    console.log('sellerId exists:', !!req.body.sellerId);
    console.log('sellerId length:', req.body.sellerId?.length);
    
    if (!req.body.sellerId) {
      console.warn('WARNING: sellerId is missing from request!');
    }
    
    const card = await shopCardModel.create(req.body);
    
    console.log('=== SHOP CARD CREATED ===');
    console.log('Created card ID:', card._id);
    console.log('Created card name:', card.productName);
    console.log('Created card sellerId:', card.sellerId);
    console.log('Created card sellerId type:', typeof card.sellerId);
    console.log('Full created card:', card.toObject());
    
    res.status(201).json(card);
  } catch (err) {
    console.error('=== ERROR CREATING SHOP CARD ===');
    console.error('Error:', err);
    console.error('Error message:', err.message);
    res.status(500).json({ error: "Failed to create shop card", details: err.message });
  }
};

export const getAllShopCards = async (req, res) => {
  try {
    const cards = await shopCardModel.find();
    console.log('Total shop cards found:', cards.length);
    
    // Debug: Log seller info for each card
    cards.forEach((card, index) => {
      console.log(`Card ${index + 1}:`, {
        name: card.productName,
        sellerName: card.productSellerName,
        sellerId: card.sellerId,
        sellerIdType: typeof card.sellerId
      });
    });
    
    res.json(cards);
  } catch (err) {
    console.error('Error fetching shop cards:', err);
    res.status(500).json({ error: "Failed to fetch shop cards" });
  }
};

export const getShopCardsByCategory = async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productCategory: req.params.category });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by category" });
  }
};

export const getShopCardsByState = async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productState: req.params.state });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by state" });
  }
};

export const getShopCardById = async (req, res) => {
  try {
    const card = await shopCardModel.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateShopCard = async (req, res) => {
  try {
    const card = await shopCardModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteShopCard = async (req, res) => {
  try {
    const card = await shopCardModel.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// New endpoint to get products by seller ID
export const getShopCardsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log('Fetching products for seller ID:', sellerId);
    
    const cards = await shopCardModel.find({ sellerId: sellerId });
    console.log(`Found ${cards.length} products for seller ${sellerId}`);
    
    res.json(cards);
  } catch (err) {
    console.error('Error fetching products by seller ID:', err);
    res.status(500).json({ error: "Failed to fetch products by seller ID" });
  }
};

// New endpoint to get products without sellerId
export const getProductsWithoutSellerId = async (req, res) => {
  try {
    const productsWithoutSellerId = await shopCardModel.find({
      $or: [
        { sellerId: { $exists: false } },
        { sellerId: null },
        { sellerId: '' }
      ]
    });
    
    console.log(`Found ${productsWithoutSellerId.length} products without sellerId`);
    res.json({
      count: productsWithoutSellerId.length,
      products: productsWithoutSellerId
    });
  } catch (err) {
    console.error('Error fetching products without sellerId:', err);
    res.status(500).json({ error: "Failed to fetch products without sellerId" });
  }
};

// Endpoint to fix sellerId for a specific product
export const fixProductSellerId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sellerId } = req.body;
    
    const updatedProduct = await shopCardModel.findByIdAndUpdate(
      productId,
      { sellerId: sellerId },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log(`Fixed sellerId for product: ${updatedProduct.productName}`);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error fixing product sellerId:', err);
    res.status(500).json({ error: "Failed to fix product sellerId" });
  }
};