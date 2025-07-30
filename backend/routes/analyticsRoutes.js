import express from 'express';
import { 
  getSellerAnalytics,
  getBuyerAnalytics 
} from '../controllers/analyticsController.js';

const router = express.Router();

// Seller analytics endpoint
router.get('/seller/:id', getSellerAnalytics);

// Buyer analytics endpoint
router.get('/buyer/:id', getBuyerAnalytics);

export default router;