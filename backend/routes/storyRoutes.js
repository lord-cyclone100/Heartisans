import express from 'express';
import {
  getStories,
  createStory,
  getStoryById,
  approveStory,
  getPendingStories,
  rejectStory
} from '../controllers/storyController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/', createStory);

// Admin routes - protected with authentication and admin check
router.get('/admin/pending', protect, adminOnly, getPendingStories);
router.put('/admin/:id/approve', protect, adminOnly, approveStory);
router.delete('/admin/:id/reject', protect, adminOnly, rejectStory);

export default router;
