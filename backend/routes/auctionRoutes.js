import express from 'express';
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  placeBid,
  deleteAuction
} from '../controllers/auctionController.js';

const router = express.Router();

router.post('/', createAuction);
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);
router.post('/:id/bid', placeBid);
router.delete('/:id', deleteAuction);

export default router;