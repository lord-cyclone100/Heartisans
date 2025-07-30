import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
};

export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.API_SECRET
  );
  res.json({
    timestamp,
    signature,
    apiKey: process.env.API_KEY || 'YOUR_API_KEY',
    cloudName: process.env.CLOUD_NAME || 'YOUR_CLOUD_NAME'
  });
};