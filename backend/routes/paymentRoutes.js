// paymentRoutes.js
import express from 'express';
import { createOrder, verifyPayment, getPaymentStatus } from '../controllers/paymentController.js'; // Import getPaymentStatus

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/status', getPaymentStatus); // New route for polling

export default router;