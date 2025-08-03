import express from 'express';
import {
  getStories,
  createStory,
  getStoryById,
  approveStory,
  getPendingStories,
  rejectStory
} from '../controllers/storyController.js';

const router = express.Router();

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/', createStory);

// Admin routes (you may want to add authentication middleware)
router.get('/admin/pending', getPendingStories);
router.put('/admin/:id/approve', approveStory);
router.delete('/admin/:id/reject', rejectStory);

export default router;
