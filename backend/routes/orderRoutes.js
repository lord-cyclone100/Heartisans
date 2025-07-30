import express from 'express';
// Ensure getOrderById is imported here along with other functions
import { createOrder, getOrdersByBuyer, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/buyer/:id', getOrdersByBuyer);
// This route is for fetching a single order by its MongoDB _id
// It should come after more specific routes if there are any that might conflict
router.get('/:id', getOrderById);

export default router;