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

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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

// Admin routes (you may want to add authentication middleware)
router.get('/admin/pending', getPendingStories);
router.put('/admin/:id/approve', approveStory);
router.delete('/admin/:id/reject', rejectStory);

export default router;
