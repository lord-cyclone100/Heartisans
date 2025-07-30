import express from 'express';
import { createSubscriptionOrder } from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create-order', createSubscriptionOrder);

export default router;