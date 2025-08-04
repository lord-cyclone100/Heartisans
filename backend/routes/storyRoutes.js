import express from 'express';
import multer from 'multer';
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

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Maximum 1 file for story image
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/', upload.single('storyImage'), createStory);

// Admin routes - protected with authentication and admin check
router.get('/admin/pending', protect, adminOnly, getPendingStories);
router.put('/admin/:id/approve', protect, adminOnly, approveStory);
router.delete('/admin/:id/reject', protect, adminOnly, rejectStory);

export default router;
