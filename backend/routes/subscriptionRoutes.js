import express from 'express';
import { createSubscriptionOrder, verifySubscriptionPayment } from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create-order', createSubscriptionOrder);
router.post('/payment/verify', verifySubscriptionPayment);

export default router;