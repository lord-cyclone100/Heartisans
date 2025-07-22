import express from 'express'
import cors from 'cors'
import { connectDB } from './database/db.js';
import { userModel } from './models/userModel.js';
import { shopCardModel } from './models/shopCardModel.js';
import { v2 as cloudinary } from 'cloudinary'

const app = express();
const port = 5000;

const corsOptions = {
  origin:"http://localhost:5173",
  methods:["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials:true
}

app.use(cors(corsOptions));
app.use(express.json())

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

app.get('/',(req,res)=>{
  res.status(200).send("Hello World");
})

app.get('/api/cloudinary-signature', (req, res) => {
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
});

app.post('/api/user', async (req, res) => {
  try {
    const { userName, email, imageUrl, fullName } = req.body;
    // Save user only if not exists
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({ userName, email, imageUrl, fullName });
    }
    res.status(201).json({ message: "User saved", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

// GET user by id
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.patch('/api/user/:id/artisan', async (req, res) => {
  try {
    const { isArtisan } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isArtisan },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update artisan status" });
  }
});

app.get('/api/user/email/:email', async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post('/api/shopcards', async (req, res) => {
  try {
    const card = await shopCardModel.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create shop card" });
  }
});

app.get('/api/shopcards', async (req, res) => {
  try {
    const cards = await shopCardModel.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards" });
  }
});

// Get products by category
app.get('/api/shopcards/category/:category', async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productCategory: req.params.category });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by category" });
  }
});

// Get products by state
app.get('/api/shopcards/state/:state', async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productState: req.params.state });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by state" });
  }
});

app.get('/api/shopcards/:id', async (req, res) => {
  try {
    const card = await shopCardModel.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

connectDB().then(()=>{
  app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  })
})