import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/link-google', authController.protect, authController.linkGoogleAccount);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', protect, authController.getCurrentUser);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

export default router;