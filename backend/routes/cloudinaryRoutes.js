import express from 'express';
import { getCloudinarySignature } from '../config/cloudinary.js'; // Import the function from your config file

const router = express.Router();

// Define the route for getting the Cloudinary signature
router.get('/cloudinary-signature', getCloudinarySignature);

export default router;