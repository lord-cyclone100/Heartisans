import express from 'express';
import {
  createUser,
  getUserById,
  updateArtisanStatus,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
  deleteUser,
  updateSubscription,
  getWallet
} from '../controllers/userController.js';

const router = express.Router();

// More specific routes should come first
router.get('/email/:email', getUserByEmail);
router.get('/username/:username', getUserByUsername);
router.get('/wallet/:id', getWallet); // Keep this specific path before general :id

router.post('/', createUser);
router.get('/:id', getUserById); // This is a general ID route, so it comes after specific named parameters
router.patch('/:id/artisan', updateArtisanStatus);
router.get('/', getAllUsers); // This is the most general GET route
router.delete('/:id', deleteUser);
router.patch('/:id/subscription', updateSubscription);

export default router;