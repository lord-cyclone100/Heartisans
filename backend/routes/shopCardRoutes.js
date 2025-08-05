import express from 'express';
import {
  createShopCard,
  getAllShopCards,
  getShopCardsByCategory,
  getShopCardsByState,
  getShopCardById,        // ← This is equivalent to getProductById
  updateShopCard,
  deleteShopCard,
  getShopCardsBySellerId,
  getProductsWithoutSellerId,
  fixProductSellerId,
} from '../controllers/shopCardController.js';

const router = express.Router();

router.post('/', createShopCard);
router.get('/', getAllShopCards);
router.get('/category/:category', getShopCardsByCategory);
router.get('/state/:state', getShopCardsByState);
router.get('/seller/:sellerId', getShopCardsBySellerId);
router.get('/missing-seller-id', getProductsWithoutSellerId);
router.patch('/:productId/fix-seller-id', fixProductSellerId);
router.get('/:id', getShopCardById);        // ← This line already exists!
router.patch('/:id', updateShopCard);
router.delete('/:id', deleteShopCard);

export default router;