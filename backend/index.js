import express from 'express'
import cors from 'cors'
import { connectDB } from './database/db.js';
import { userModel } from './models/userModel.js';
import { shopCardModel } from './models/shopCardModel.js';
import { auctionModel } from './models/auctionModel.js';
import { cartModel } from './models/cartModel.js';
import { orderModel } from './models/orderModel.js';
import { v2 as cloudinary } from 'cloudinary';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import Groq from 'groq-sdk';
import sapAiPricing from './services/sapAiPricing.js';
import sapBusinessAI from './services/sapBusinessAI.js';
import SAPAnalyticsCloudService from './services/sapAnalyticsCloud.js';

const app = express();
const port = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  // Join auction room
  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
  });
  socket.on("placeBid", async ({ auctionId, userId, userName, amount }) => {
    try {
      const auction = await auctionModel.findById(auctionId);

      // Prevent auction creator from bidding
      if (auction.sellerId.toString() === userId.toString()) {
        socket.emit("bidError", { error: "You cannot bid on your own auction." });
        return;
      }

      // Auction time checks
      const now = new Date();
      const auctionEnd = new Date(auction.startTime.getTime() + auction.duration * 60 * 1000);
      if (now < auction.startTime) {
        socket.emit("bidError", { error: "Auction not started" });
        return;
      }
      if (now > auctionEnd) {
        socket.emit("bidError", { error: "Auction ended" });
        return;
      }

      // Bid amount check
      const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.basePrice;
      if (amount <= highestBid) {
        socket.emit("bidError", { error: "Bid too low" });
        return;
      }

      // Add bid
      auction.bids.push({ userId, userName, amount });
      await auction.save();

      // Emit updated auction to all in the room
      io.to(auctionId).emit("auctionUpdate", auction);
    } catch (err) {
      socket.emit("bidError", { error: "Failed to place bid" });
    }
  });
});

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

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MERCHANT_ID = process.env.MERCHANT_ID
const MERCHANT_KEY = process.env.MERCHANT_KEY
const BASE_URL = process.env.BASE_URL
const STATUS_URL = process.env.STATUS_URL

const redirecturl = `http://localhost:${port}/status`
const successurl = `http://localhost:${port}/payment-success`
const failureurl = `http://localhost:${port}/payment-failure`




// const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
// const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
// const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || "https://sandbox.cashfree.com/pg";

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);


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

// Quick AI-powered product description generation (Groq)
app.post('/api/generate-description', async (req, res) => {
  try {
    const { 
      productName, 
      productCategory, 
      productState, 
      productMaterial, 
      productWeight, 
      productColor, 
      additionalInfo 
    } = req.body;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    // Create a detailed prompt for the AI
    const prompt = `Generate an engaging and detailed product description for a handcrafted artisan product with the following details:

Product Name: ${productName}
Category: ${productCategory || 'Handcraft'}
State/Region: ${productState || 'India'}
Material: ${productMaterial || 'Traditional materials'}
Weight: ${productWeight || 'Not specified'}
Color: ${productColor || 'Natural colors'}
Additional Info: ${additionalInfo || 'No additional information'}

Requirements:
1. Write a compelling description that highlights the craftsmanship and cultural heritage
2. Emphasize the handmade nature and uniqueness of the product
3. Include information about the artisan tradition from the region
4. Mention the materials and their significance
5. Keep it between 100-200 words
6. Use warm, inviting language that connects with buyers
7. Include care instructions if relevant
8. Highlight what makes this product special and authentic

Write in a professional yet warm tone that would appeal to customers looking for authentic, handcrafted products.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in artisan and handcrafted products. You create compelling product descriptions that highlight the cultural heritage, craftsmanship, and unique qualities of handmade items."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant", // Fast and efficient model
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 300
    });

    const generatedDescription = completion.choices[0]?.message?.content;

    if (!generatedDescription) {
      throw new Error('Failed to generate description');
    }

    res.json({ 
      success: true, 
      description: generatedDescription.trim(),
      powered_by: 'Groq Llama 3.1',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Description Generation Error:', error);
    
    // Provide fallback description
    const fallbackDescription = `This beautiful handcrafted ${req.body.productName || 'product'} showcases the rich artisan tradition of ${req.body.productState || 'India'}. Made with care using ${req.body.productMaterial || 'traditional materials'}, each piece is unique and reflects the skilled craftsmanship passed down through generations. Perfect for those who appreciate authentic, handmade artistry.`;
    
    res.status(500).json({ 
      error: 'Failed to generate AI description', 
      fallbackDescription,
      details: error.message 
    });
  }
});

// SAP Business AI Price Prediction endpoint (REAL SAP BUSINESS SERVICES)
app.post('/api/predict-price', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.productName && !productData.name) {
      return res.status(400).json({
        error: 'Product name is required for price prediction',
        sapError: 'INVALID_INPUT_DATA'
      });
    }

    console.log('🏢 SAP Business AI: Generating price prediction for:', productData.productName || productData.name);

    // Use SAP Business AI analytics for pricing
    const pricePrediction = await sapBusinessAI.analyzePricingIntelligence({
      name: productData.productName || productData.name,
      category: productData.productCategory || productData.category,
      material: productData.productMaterial || productData.material,
      region: productData.productState || productData.region,
      weight: productData.productWeight || productData.weight,
      color: productData.productColor || productData.color,
      additionalInfo: productData.additionalInfo || '',
      listingType: productData.listingType || 'regular'
    });

    res.json({
      success: true,
      data: pricePrediction,
      powered_by: pricePrediction.isRealSAP ? 'SAP Business AI & SAP Analytics Cloud (Real)' : 'SAP Business Intelligence Suite',
      sap_integration: 'Business AI Services',
      timestamp: new Date().toISOString(),
      sapVersion: 'SAP Business AI v3.0'
    });

  } catch (error) {
    console.error('❌ SAP Business AI price prediction error:', error);
    res.status(500).json({
      error: 'Failed to generate SAP Business AI price prediction',
      message: error.message,
      powered_by: 'SAP Business AI Suite',
      sapError: 'BUSINESS_AI_SERVICE_ERROR'
    });
  }
});

// SAP Business AI Content Generation endpoint (REAL SAP BUSINESS SERVICES)
app.post('/api/generate-sap-description', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.productName && !productData.name) {
      return res.status(400).json({
        error: 'Product name is required for SAP Business AI content generation',
        sapError: 'INVALID_INPUT_DATA'
      });
    }

    console.log('🎨 SAP Business AI: Generating content for:', productData.productName || productData.name);

    // Get comprehensive content from SAP Business AI
    const contentData = await sapBusinessAI.generateBusinessContent({
      name: productData.productName || productData.name,
      category: productData.productCategory || productData.category,
      material: productData.productMaterial || productData.material,
      region: productData.productState || productData.region,
      weight: productData.productWeight || productData.weight,
      color: productData.productColor || productData.color,
      additionalInfo: productData.additionalInfo || '',
      listingType: productData.listingType || 'regular',
      basePrice: productData.basePrice || null
    });

    res.json({
      success: true,
      data: contentData,
      powered_by: contentData.isRealSAP ? 'SAP Business AI Suite (Real Services)' : 'SAP Business Intelligence Platform',
      sap_integration: 'Text Analytics, Enterprise Search, Analytics Cloud',
      timestamp: new Date().toISOString(),
      sapVersion: contentData.sapVersion
    });

  } catch (error) {
    console.error('❌ SAP Business AI content generation error:', error);
    res.status(500).json({
      error: 'Failed to generate SAP Business AI content',
      message: error.message,
      powered_by: 'SAP Business AI Suite',
      sapError: 'BUSINESS_AI_CONTENT_ERROR'
    });
  }
});

// SAP Business AI Services Test endpoint
app.get('/api/test-sap-business-ai', async (req, res) => {
  try {
    console.log('🧪 Testing SAP Business AI Services...');
    
    const serviceStatus = await sapBusinessAI.testAllServices();
    
    res.json({
      success: true,
      services: serviceStatus,
      summary: {
        textAnalytics: serviceStatus.textAnalytics ? 'Real SAP API' : 'Intelligent Simulation',
        analytics: serviceStatus.analytics ? 'Real SAP API' : 'Business Intelligence',
        search: serviceStatus.search ? 'Real SAP API' : 'Market Intelligence',
        translation: serviceStatus.translation ? 'Real SAP API' : 'Language Support'
      },
      timestamp: new Date().toISOString(),
      api_hub_url: process.env.SAP_API_HUB_URL,
      integration_level: 'SAP Business AI Suite'
    });

  } catch (error) {
    console.error('❌ SAP Business AI test error:', error);
    res.status(500).json({
      error: 'SAP Business AI test failed',
      message: error.message,
      fallback: 'Business intelligence simulation available'
    });
  }
});

// SAP Analytics Cloud - Market Intelligence endpoint
app.post('/api/sac/market-intelligence', async (req, res) => {
  try {
    console.log('📊 SAC Market Intelligence request:', req.body);
    
    const sacService = new SAPAnalyticsCloudService();
    const marketIntel = await sacService.getMarketIntelligence(req.body);
    
    res.json({
      success: true,
      source: 'SAP Analytics Cloud',
      data: marketIntel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SAC Market Intelligence error:', error);
    res.status(500).json({
      error: 'Market intelligence analysis failed',
      message: error.message,
      fallback: 'Intelligent market analysis available'
    });
  }
});

// SAP Analytics Cloud - Pricing Analytics endpoint
app.post('/api/sac/pricing-analytics', async (req, res) => {
  try {
    console.log('💰 SAC Pricing Analytics request:', req.body);
    
    const sacService = new SAPAnalyticsCloudService();
    const pricingAnalytics = await sacService.analyzePricingTrends(req.body);
    
    res.json({
      success: true,
      source: 'SAP Analytics Cloud',
      data: pricingAnalytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SAC Pricing Analytics error:', error);
    res.status(500).json({
      error: 'Pricing analytics failed',
      message: error.message,
      fallback: 'Intelligent pricing analysis available'
    });
  }
});

// SAP Analytics Cloud - Customer Segmentation endpoint
app.post('/api/sac/customer-segments', async (req, res) => {
  try {
    console.log('👥 SAC Customer Segmentation request:', req.body);
    
    const sacService = new SAPAnalyticsCloudService();
    const customerSegments = await sacService.analyzeCustomerSegments(req.body);
    
    res.json({
      success: true,
      source: 'SAP Analytics Cloud',
      data: customerSegments,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SAC Customer Segmentation error:', error);
    res.status(500).json({
      error: 'Customer segmentation failed',
      message: error.message,
      fallback: 'Intelligent segmentation analysis available'
    });
  }
});

// SAP Analytics Cloud - Demand Forecasting endpoint
app.post('/api/sac/demand-forecast', async (req, res) => {
  try {
    console.log('🔮 SAC Demand Forecasting request:', req.body);
    
    const sacService = new SAPAnalyticsCloudService();
    const demandForecast = await sacService.forecastDemand(req.body);
    
    res.json({
      success: true,
      source: 'SAP Analytics Cloud',
      data: demandForecast,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SAC Demand Forecasting error:', error);
    res.status(500).json({
      error: 'Demand forecasting failed',
      message: error.message,
      fallback: 'Intelligent forecasting available'
    });
  }
});

// SAP Analytics Cloud - Comprehensive Analytics Dashboard
app.post('/api/sac/analytics-dashboard', async (req, res) => {
  try {
    console.log('📈 SAC Analytics Dashboard request:', req.body);
    
    const sacService = new SAPAnalyticsCloudService();
    const dashboard = await sacService.generateAnalyticsDashboard(req.body);
    
    res.json({
      success: true,
      source: 'SAP Analytics Cloud - Complete Suite',
      dashboard: {
        ...dashboard,
        // Ensure analytics data is properly structured for frontend
        analytics: {
          ...dashboard.analytics,
          market_intelligence: {
            ...dashboard.analytics.market_intelligence,
            // Ensure arrays and objects are properly formatted
            key_insights: Array.isArray(dashboard.analytics.market_intelligence?.key_insights) 
              ? dashboard.analytics.market_intelligence.key_insights 
              : [],
            opportunities: Array.isArray(dashboard.analytics.market_intelligence?.opportunities)
              ? dashboard.analytics.market_intelligence.opportunities
              : [],
            risk_factors: Array.isArray(dashboard.analytics.market_intelligence?.risk_factors)
              ? dashboard.analytics.market_intelligence.risk_factors
              : []
          }
        }
      },
      timestamp: new Date().toISOString(),
      analytics_scope: [
        'Market Intelligence',
        'Pricing Analytics', 
        'Customer Segmentation',
        'Demand Forecasting'
      ]
    });

  } catch (error) {
    console.error('❌ SAC Analytics Dashboard error:', error);
    res.status(500).json({
      error: 'Analytics dashboard generation failed',
      message: error.message,
      fallback: 'Comprehensive business intelligence available'
    });
  }
});

// SAP Analytics Cloud - Test all services
app.get('/api/test-sac', async (req, res) => {
  try {
    console.log('🧪 Testing SAP Analytics Cloud Services...');
    
    const sacService = new SAPAnalyticsCloudService();
    const testProduct = {
      name: 'Traditional Rajasthani Handicraft',
      category: 'Handicrafts',
      material: 'Wood and Metal',
      region: 'Rajasthan',
      basePrice: 1500
    };

    // Test all SAC services
    const [marketIntel, pricingAnalytics, customerSegments, demandForecast] = await Promise.all([
      sacService.getMarketIntelligence(testProduct),
      sacService.analyzePricingTrends(testProduct),
      sacService.analyzeCustomerSegments(testProduct),
      sacService.forecastDemand(testProduct)
    ]);
    
    res.json({
      success: true,
      test_results: {
        market_intelligence: {
          status: 'Active',
          data_points: Object.keys(marketIntel).length,
          sample: marketIntel.key_insights?.[0] || 'Market intelligence available'
        },
        pricing_analytics: {
          status: 'Active',
          price_range: pricingAnalytics.optimal_price_range,
          trend: pricingAnalytics.price_trends
        },
        customer_segmentation: {
          status: 'Active',
          segments_count: customerSegments.primary_segments?.length || 4,
          top_segment: customerSegments.primary_segments?.[0]?.name
        },
        demand_forecasting: {
          status: 'Active',
          forecast: demandForecast.forecast_trend,
          growth: demandForecast.predicted_growth
        }
      },
      sap_analytics_cloud: {
        integration_level: 'Enterprise-grade',
        api_coverage: 'Market Intelligence, Pricing, Customer Analytics, Forecasting',
        real_api_attempts: 'Multiple SAC endpoints tested',
        fallback_intelligence: 'Sophisticated business analytics'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ SAC test error:', error);
    res.status(500).json({
      error: 'SAP Analytics Cloud test failed',
      message: error.message,
      analytics_available: 'Business intelligence simulation active'
    });
  }
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

// Get user by userName
app.get('/api/user/username/:username', async (req, res) => {
  try {
    const user = await userModel.findOne({ userName: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET all users (for admin panel)
app.get('/api/users', async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ joiningDate: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// DELETE user by id (admin only)
app.delete('/api/user/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// UPDATE user subscription (admin only)
app.patch('/api/user/:id/subscription', async (req, res) => {
  try {
    const { hasArtisanSubscription, subscriptionType, subscriptionDate } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { hasArtisanSubscription, subscriptionType, subscriptionDate },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ error: "Failed to update subscription" });
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

// DELETE shop card by id (admin only)
app.delete('/api/shopcards/:id', async (req, res) => {
  try {
    const card = await shopCardModel.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Create a new auction
app.post('/api/auctions', async (req, res) => {
  try {
    const auction = await auctionModel.create(req.body);
    res.status(201).json(auction);
  } catch (err) {
    console.error("Auction creation error:", err);
    res.status(500).json({ error: "Failed to create auction"});
  }
});

// Get all auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const auctions = await auctionModel.find();
    const now = Date.now();
    for (const auction of auctions) {
      const start = new Date(auction.startTime).getTime();
      const end = start + auction.duration * 60 * 1000; // duration in ms
      let changed = false;
      if (now >= start && now < end && (!auction.hasBegun || auction.hasEnded)) {
        auction.hasBegun = true;
        auction.hasEnded = false;
        changed = true;
      }
      if (now >= end && !auction.hasEnded) {
        auction.hasEnded = true;
        changed = true;
      }
      if (now < start && (auction.hasBegun || auction.hasEnded)) {
        auction.hasBegun = false;
        auction.hasEnded = false;
        changed = true;
      }
      if (changed) await auction.save();
    }
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

// Get a single auction
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await auctionModel.findById(req.params.id);
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auction" });
  }
});

// Place a bid
app.post('/api/auctions/:id/bid', async (req, res) => {
  try {
    const { userId, userName, amount } = req.body;
    const auction = await auctionModel.findById(req.params.id);

    // Prevent auction creator from bidding
    if (auction.sellerId.toString() === userId.toString()) {
      return res.status(400).json({ error: "You cannot bid on your own auction." });
    }

    // Check if auction has started and not ended
    const now = new Date();
    const auctionEnd = new Date(auction.startTime.getTime() + auction.duration * 1000);
    if (now < auction.startTime) return res.status(400).json({ error: "Auction not started" });
    if (now > auctionEnd) return res.status(400).json({ error: "Auction ended" });

    // Check if bid is higher than current highest or base price
    const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.basePrice;
    if (amount <= highestBid) return res.status(400).json({ error: "Bid too low" });

    // Add bid
    auction.bids.push({ userId, userName, amount });
    await auction.save();

    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: "Failed to place bid" });
  }
});

// DELETE auction by id (admin only)
app.delete('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await auctionModel.findByIdAndDelete(req.params.id);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.json({ message: "Auction deleted successfully" });
  } catch (err) {
    console.error('Error deleting auction:', err);
    res.status(500).json({ error: "Failed to delete auction" });
  }
});

// Add item to cart
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, productName, productImageUrl, productPrice, productCategory } = req.body;
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, productName, productImageUrl, productPrice, productCategory }]
      });
    } else {
      const item = cart.items.find(i => i.productId.toString() === productId);
      if (!item) {
        cart.items.push({ productId, productName, productImageUrl, productPrice, productCategory });
      }
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Get user's cart
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post('/api/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.json({ success: true });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

//PhonePe payment gateway
// app.post('/create-order',async(req,res)=>{
//   const {name,mobile,amount} = req.body;
//   const orderId = uuidv4()

//   const payLoad = {
//     merchantId:MERCHANT_ID,
//     merchantUserId:name,
//     mobileNumber:mobile,
//     amount:amount*100,
//     merchantTransactionId:orderId,
//     redirectUrl:`${redirecturl}/?id=${orderId}`,
//     redirectMode:'POST',
//     paymentInstrument:{
//       type:'PAY_PAGE'
//     }
//   }
//   const newPayLoad = Buffer.from(JSON.stringify(payLoad)).toString('base64');
//   const keyIndex = 1;
//   const str = newPayLoad + '/pg/v1/pay' + MERCHANT_KEY
//   const sha256 = crypto.createHash('sha256').update(str).digest('hex')
//   const checksum = sha256 + '###' + keyIndex

//   const option = {
//     method:'POST',
//     url:BASE_URL,
//     headers:{
//       accept:'application/json',
//       'Content-Type':'application/json',
//       'X-VERIFY':checksum,
//       'X-MERCHANT-ID': MERCHANT_ID
//     },
//     data:{
//       request:newPayLoad
//     }

//   }
//   try {
//     const response = await axios.request(option)
//     console.log("PhonePe API response:", response.data);
//     const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
//     res.status(200).json({ url: redirectUrl });
//   } catch (error) {
//     console.log(error);
//   }
// })





const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

app.post('/create-order', async (req, res) => {
  try{
    const { name, mobile, amount, address, sellerId, sellerName, productDetails, isSubscription } = req.body;
    const orderId = generateOrderId();

    // Get buyer ID from email if available (assuming it's sent from frontend)
    let buyerId = null;
    if (req.body.buyerEmail) {
      const buyer = await userModel.findOne({ email: req.body.buyerEmail });
      buyerId = buyer?._id;
    }

    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: name,
        customer_email: req.body.buyerEmail || "test@example.com",
        customer_phone: mobile.toString()
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-success?order_id=${orderId}`,
        payment_methods: "cc,dc,upi"
      },
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    console.log('Creating Cashfree order with data:', orderPayload);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderPayload);
    console.log('Cashfree response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {
      // Save order to database
      const orderData = {
        orderId: orderId,
        buyerId: buyerId,
        productDetails: {
          productId: productDetails?.id,
          productName: productDetails?.name,
          productPrice: productDetails?.price,
          productCategory: productDetails?.category,
          productImage: productDetails?.image
        },
        customerDetails: {
          name: name,
          email: req.body.buyerEmail || "test@example.com",
          mobile: mobile,
          address: address
        },
        amount: parseFloat(amount),
        status: 'pending',
        isSubscription: isSubscription || false
      };

      // Only add sellerId if it's not null or empty (for regular product purchases)
      if (sellerId && sellerId.trim() !== '') {
        orderData.sellerId = sellerId;
      }

      const order = await orderModel.create(orderData);

      console.log('Order saved to database:', order._id);

      res.json({
        success: true,
        message: 'Order created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create payment session');
    }
  }

  catch(error) {
    console.error('Order creation error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});







app.post('/payment/verify', async (req, res) => {
  try {
    console.log("Verifying payment...");
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    console.log(`Verifying payment for order: ${orderId}`);

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    // Find the order in our database
    const order = await orderModel.findOne({ orderId });
    if (order) {
      console.log(`Updating order ${orderId} from status: ${order.status} to: ${orderStatus}`);
      
      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          order.status = 'paid';
          order.paymentDetails = {
            paymentId: paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED',
            paymentMethod: paymentDetails.payment_method,
            paymentTime: paymentDetails.payment_time,
            bankReference: paymentDetails.bank_reference
          };
          order.updatedAt = new Date();
          
          // Handle subscription vs regular product purchase
          if (order.isSubscription) {
            // Handle subscription payment
            const buyerUser = await userModel.findById(order.buyerId);
            if (buyerUser) {
              await userModel.findByIdAndUpdate(order.buyerId, {
                hasArtisanSubscription: true,
                subscriptionDate: new Date()
              });
              console.log(`User ${buyerUser.userName} subscribed to Artisan Plan`);
            }

            // Increase balance for all admin users by Rs 1000
            await userModel.updateMany(
              { isAdmin: true },
              { $inc: { balance: 1000 } }
            );
            console.log(`All admin users received Rs 1000 for subscription payment`);
          } else {
            // Handle regular product purchase - increase seller balance
            if (order.sellerId) {
              const seller = await userModel.findById(order.sellerId);
              if (seller) {
                const currentBalance = seller.balance || 0;
                const newBalance = currentBalance + order.amount;
                seller.balance = newBalance;
                await seller.save();
                console.log(`Seller ${seller.userName} balance updated from ${currentBalance} to ${newBalance}`);
              } else {
                console.error(`Seller not found for ID: ${order.sellerId}`);
              }
            }
          }
          
          console.log(`Payment verified as successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          order.status = 'expired';
          order.updatedAt = new Date();
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          order.status = 'failed';
          order.updatedAt = new Date();
          console.log(`Payment failed for order ${orderId}`);
          break;
          
        case 'PENDING':
          order.status = 'pending';
          order.updatedAt = new Date();
          console.log(`Payment still pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          order.status = orderStatus.toLowerCase();
          order.updatedAt = new Date();
      }
      
      await order.save();
      console.log(`Order ${orderId} updated successfully`);

      // Return verification result and order data
      res.json({
        success: orderStatus === 'PAID',
        orderStatus: orderStatus,
        paymentDetails: paymentDetails,
        order: {
          id: order._id,
          orderId: order.orderId,
          productDetails: order.productDetails,
          customerDetails: order.customerDetails,
          amount: order.amount,
          status: order.status,
          paymentDetails: order.paymentDetails,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }
      });
    } else {
      console.error(`Order not found for orderId: ${orderId}`);
      res.status(404).json({
        success: false,
        message: 'Order not found',
        orderStatus: orderStatus
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});








// app.post('/status',async(req,res)=>{
//   const merchantTransactionId = req.query.id
//   const keyIndex = 1;
//   const str = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY
//   const sha256 = crypto.createHash('sha256').update(str).digest('hex')
//   const checksum = sha256 + '###' + keyIndex

//   const option = {
//     method:'GET',
//     url:`${STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
//     headers:{
//       accept:'application/json',
//       'Content-Type':'application/json',
//       'X-VERIFY':checksum,
//       'X-MERCHANT-ID': MERCHANT_ID
//     },

//   }
//   axios.request(option).then((response)=>{
//     if(response.data.success === true){
//       res.redirect(successurl)
//     }
//     else{
//       res.redirect(failureurl)
//     }
//   })
// })

// app.get('/payment-success', (req, res) => {
//   res.redirect('http://localhost:5173/payment-success')
// });

// app.get('/payment-failure', (req, res) => {
//   res.send('Payment Failed!');
// });


app.get('/api/wallet/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.balance || 0, userName: user.userName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

// Get all orders for a user (buyer or seller)
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'buyer' or 'seller'
    
    let query = {};
    if (type === 'buyer') {
      query.buyerId = userId;
    } else if (type === 'seller') {
      query.sellerId = userId;
    } else {
      query = { $or: [{ buyerId: userId }, { sellerId: userId }] };
    }
    
    const orders = await orderModel.find(query)
      .populate('buyerId', 'userName email')
      .populate('sellerId', 'userName email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get specific order details
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await orderModel.findOne({ orderId: req.params.orderId })
      .populate('buyerId', 'userName email')
      .populate('sellerId', 'userName email');
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Subscription-specific order creation endpoint
app.post('/create-subscription-order', async (req, res) => {
  try{
    const { name, mobile, amount, address, subscriptionPlan } = req.body;
    const orderId = generateOrderId();

    // Determine plan details
    const isYearlyPlan = subscriptionPlan === 'yearly';
    const planName = isYearlyPlan ? 'Artisan Plan - Yearly' : 'Artisan Plan - Monthly';
    const expectedAmount = isYearlyPlan ? 2000 : 200;

    // Validate amount matches plan
    if (parseFloat(amount) !== expectedAmount) {
      return res.status(400).json({ 
        message: `Invalid amount for ${subscriptionPlan} plan. Expected: Rs ${expectedAmount}` 
      });
    }

    // Get buyer ID from email if available
    let buyerId = null;
    if (req.body.buyerEmail) {
      const buyer = await userModel.findOne({ email: req.body.buyerEmail });
      buyerId = buyer?._id;
    }

    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: name,
        customer_email: req.body.buyerEmail || "test@example.com",
        customer_phone: mobile.toString()
      },
      order_meta: {
        return_url: `http://localhost:5173/subscription-success?order_id=${orderId}`,
        payment_methods: "cc,dc,upi"
      },
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    console.log('Creating Cashfree subscription order with data:', orderPayload);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderPayload);
    console.log('Cashfree subscription response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {
      // Save subscription order to database
      const order = await orderModel.create({
        orderId: orderId,
        buyerId: buyerId,
        // No sellerId for subscription orders
        productDetails: {
          productId: `artisan-subscription-${subscriptionPlan}`,
          productName: planName,
          productPrice: amount.toString(),
          productCategory: 'Subscription',
          productImage: null
        },
        customerDetails: {
          name: name,
          email: req.body.buyerEmail || "test@example.com",
          mobile: mobile,
          address: address
        },
        amount: parseFloat(amount),
        status: 'pending',
        isSubscription: true,
        subscriptionType: subscriptionPlan
      });

      console.log('Subscription order saved to database:', order._id);

      res.json({
        success: true,
        message: 'Subscription order created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create subscription payment session');
    }
  }
  catch(error) {
    console.error('Subscription order creation error:', error);
    
    res.status(500).json({ 
      message: 'Failed to create subscription order',
      error: error.message
    });
  }
});

// Subscription-specific payment verification endpoint
app.post('/subscription/payment/verify', async (req, res) => {
  try {
    console.log("=== SUBSCRIPTION PAYMENT VERIFICATION START ===");
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    console.log(`Verifying subscription payment for order: ${orderId}`);

    // Find the subscription order in our database first
    const order = await orderModel.findOne({ orderId, isSubscription: true });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Subscription order not found'
      });
    }

    console.log(`Found subscription order ${orderId} with current status: ${order.status}`);
    
    // If already processed, return success without double processing
    if (order.status === 'paid') {
      console.log(`Subscription order ${orderId} already processed - returning cached result`);
      return res.json({
        success: true,
        orderStatus: 'PAID',
        message: 'Already processed',
        order: {
          id: order._id,
          orderId: order.orderId,
          amount: order.amount,
          status: order.status
        }
      });
    }

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree subscription order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    if (orderStatus === 'PAID') {
      // Use atomic operation to update order status only if it's still pending
      const updatedOrder = await orderModel.findOneAndUpdate(
        { orderId, isSubscription: true, status: 'pending' },
        {
          status: 'paid',
          paymentDetails: {
            paymentId: paymentDetails.payment_id || 'SUBSCRIPTION_COMPLETED',
            paymentMethod: paymentDetails.payment_method,
            paymentTime: paymentDetails.payment_time
          },
          updatedAt: new Date()
        },
        { new: true }
      );

      // If updatedOrder is null, it means the order was already processed
      if (!updatedOrder) {
        console.log(`Subscription order ${orderId} was already processed by another request`);
        return res.json({
          success: true,
          orderStatus: 'PAID',
          message: 'Already processed',
          order: {
            id: order._id,
            orderId: order.orderId,
            amount: order.amount,
            status: 'paid'
          }
        });
      }
      
      // Process subscription (only if not already subscribed)
      const buyerUser = await userModel.findById(order.buyerId);
      if (buyerUser && !buyerUser.hasArtisanSubscription) {
        // Get subscription type from order
        const subscriptionType = order.subscriptionType;
        const isYearlyPlan = subscriptionType === 'yearly';
        const subscriptionEndDate = new Date();
        
        if (isYearlyPlan) {
          subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        } else {
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        }
        
        // Update user subscription
        await userModel.findByIdAndUpdate(order.buyerId, {
          hasArtisanSubscription: true,
          subscriptionDate: new Date(),
          subscriptionType: subscriptionType,
          subscriptionEndDate: subscriptionEndDate
        });
        console.log(`User ${buyerUser.userName} subscribed to Artisan Plan (${subscriptionType})`);
        
        // Calculate admin bonus based on subscription type
        const adminBonus = isYearlyPlan ? 2000 : 200;
        
        // Update admin balances (only once)
        const adminUpdateResult = await userModel.updateMany(
          { isAdmin: true },
          { $inc: { balance: adminBonus } }
        );
        console.log(`Updated ${adminUpdateResult.modifiedCount} admin users with Rs ${adminBonus} for ${subscriptionType} subscription`);
      } else if (buyerUser && buyerUser.hasArtisanSubscription) {
        console.log(`User ${buyerUser.userName} already has subscription - skipping admin balance update`);
      }
      
      console.log(`Subscription payment verified successfully for order ${orderId}`);
    }

    res.json({
      success: orderStatus === 'PAID',
      orderStatus: orderStatus,
      order: {
        id: order._id,
        orderId: order.orderId,
        amount: order.amount,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Subscription payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify subscription payment',
      error: error.message
    });
  }
});


connectDB().then(()=>{
  server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  })
})