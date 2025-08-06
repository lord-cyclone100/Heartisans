import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { Server } from 'socket.io';
import Groq from 'groq-sdk';

// Load environment variables
config();

// Cloudinary Configuration (enhanced with error handling)
const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: process.env.NODE_ENV === 'production'
    });
    console.log('✅ Cloudinary configured successfully');
    return cloudinary;
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error);
    throw error;
  }
};

// Cashfree Payment Gateway Configuration (enhanced)
const configureCashfree = () => {
  try {
    const env = process.env.NODE_ENV === 'production' 
      ? CFEnvironment.PRODUCTION 
      : CFEnvironment.SANDBOX;

    const instance = new Cashfree(
      env,
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY
    );

    console.log(`✅ Cashfree configured for ${env} environment`);
    return instance;
  } catch (error) {
    console.error('❌ Cashfree configuration failed:', error);
    throw error;
  }
};

// Socket.io Configuration (enhanced with error handling)
const configureSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URLS?.split(',') || [
          "https://heartisans-frontend-ibwf.onrender.com",
          "https://heartisans-frontend-ibwf.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true
      }
    });

    io.on("connection", (socket) => {
      console.log(`🔌 New socket connection: ${socket.id}`);

      socket.on("joinAuction", (auctionId) => {
        socket.join(auctionId);
        console.log(`🚪 Socket ${socket.id} joined auction room ${auctionId}`);
      });

      socket.on("placeBid", async ({ auctionId, userId, userName, amount }) => {
        try {
          const auction = await auctionModel.findById(auctionId);
          if (!auction) {
            throw new Error('Auction not found');
          }
          
          // ... rest of your auction logic ...
          
        } catch (err) {
          console.error('Bid placement error:', err);
          socket.emit("bidError", { 
            error: err.message || "Failed to place bid",
            code: "BID_ERROR"
          });
        }
      });

      socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    console.log('✅ Socket.io configured successfully');
    return io;
  } catch (error) {
    console.error('❌ Socket.io configuration failed:', error);
    throw error;
  }
};

// SAP & AI Services Configuration (enhanced)
const configureSAPServices = () => {
  try {
    const config = {
      groq: new Groq({
        apiKey: process.env.GROQ_API_KEY,
        timeout: 30000 // 30 seconds
      }),
      businessAI: {
        apiKey: process.env.SAP_BUSINESS_AI_KEY,
        baseUrl: process.env.SAP_BUSINESS_AI_URL || 'https://api.sap.com/business-ai/v1',
        timeout: 30000
      },
      analyticsCloud: {
        apiKey: process.env.SAP_ANALYTICS_KEY,
        baseUrl: process.env.SAP_ANALYTICS_URL || 'https://api.sap.com/analytics/v1',
        timeout: 30000
      },
      version: process.env.SAP_API_VERSION || '3.1'
    };

    console.log('✅ SAP services configured successfully');
    return config;
  } catch (error) {
    console.error('❌ SAP services configuration failed:', error);
    throw error;
  }
};

// Rate Limiting Configuration (enhanced)
const getRateLimitConfig = () => ({
  sapAnalytics: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: 'Too many SAP analytics requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    skipFailedRequests: true
  },
  generalAPI: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000,
    message: {
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      error: 'Too many authentication attempts. Please try again later.',
      code: 'AUTH_RATE_LIMIT'
    }
  }
});

// Initialize all configurations
const cloudinaryInstance = configureCloudinary();
const cashfreeInstance = configureCashfree();
const sapServices = configureSAPServices();
const rateLimits = getRateLimitConfig();

export {
  cloudinaryInstance as cloudinary,
  cashfreeInstance as cashfree,
  configureSocket,
  sapServices as sapConfig,
  rateLimits,
  getRateLimitConfig
};