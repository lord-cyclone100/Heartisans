import express from 'express';
import multer from 'multer';
import {
  createResaleListing,
  getAllResaleListings,
  getUserResaleListings,
  getResaleListingById,
  updateResaleListing,
  deleteResaleListing,
  markAsSold,
  expressInterest,
  getResaleStats
} from '../controllers/resaleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
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
router.get('/', getAllResaleListings);
router.get('/:id', getResaleListingById);

// Protected routes (require authentication)
router.use(protect);

// User's resale listings
router.get('/user/listings', getUserResaleListings);
router.get('/user/stats', getResaleStats);

// Create new listing
router.post('/', upload.array('images', 5), createResaleListing);

// Update, delete, and manage listings
router.put('/:id', updateResaleListing);
router.delete('/:id', deleteResaleListing);
router.patch('/:id/sold', markAsSold);
router.post('/:id/interest', expressInterest);

export default router;
