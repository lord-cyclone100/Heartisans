import express from 'express';
import {
  createShopCard,
  getAllShopCards,
  getShopCardsByCategory,
  getShopCardsByState,
  getShopCardById,
  updateShopCard,
  deleteShopCard
} from '../controllers/shopCardController.js';

const router = express.Router();

router.post('/', createShopCard);
router.get('/', getAllShopCards);
router.get('/category/:category', getShopCardsByCategory);
router.get('/state/:state', getShopCardsByState);
router.get('/:id', getShopCardById);
router.patch('/:id', updateShopCard);
router.delete('/:id', deleteShopCard);

export default router;