import express from 'express';
import {
  createShopCard,
  getAllShopCards,
  getShopCardsByCategory,
  getShopCardsByState,
  getShopCardById,        // ← This is equivalent to getProductById
  deleteShopCard
} from '../controllers/shopCardController.js';

const router = express.Router();

router.post('/', createShopCard);
router.get('/', getAllShopCards);
router.get('/category/:category', getShopCardsByCategory);
router.get('/state/:state', getShopCardsByState);
router.get('/:id', getShopCardById);        // ← This line already exists!
router.delete('/:id', deleteShopCard);

export default router;