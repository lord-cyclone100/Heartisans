import express from 'express';
import rateLimit from 'express-rate-limit';  // Make sure this import is correct
import {
  generateDescription,
  predictPrice,
  generateSapDescription,
  testSapBusinessAI,
  getMarketIntelligence,
  analyzePricing,
  analyzeCustomerSegments,
  forecastDemand,
  getAnalyticsDashboard,
  testSAC
} from '../controllers/sapAnalyticsController.js';
import { rateLimits } from '../config/index.js';

const router = express.Router();

// Correct rate limiting configuration
const sapLimiter = rateLimit({
  windowMs: rateLimits.sapAnalytics.windowMs,
  max: rateLimits.sapAnalytics.max,
  message: {
    success: false,
    error: 'Too many requests to SAP analytics endpoints. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// SAP Business AI Endpoints
router.post('/predict-price', sapLimiter, predictPrice);
router.post('/generate-description', sapLimiter, generateDescription);
router.post('/generate-sap-description', sapLimiter, generateSapDescription);
router.get('/test-sap-business-ai', sapLimiter, testSapBusinessAI);

// SAP Analytics Cloud Endpoints
router.post('/market-intelligence', sapLimiter, getMarketIntelligence);
router.post('/pricing-analytics', sapLimiter, analyzePricing);
router.post('/customer-segments', sapLimiter, analyzeCustomerSegments);
router.post('/demand-forecast', sapLimiter, forecastDemand);
router.post('/analytics-dashboard', sapLimiter, getAnalyticsDashboard);
router.get('/test-sac', sapLimiter, testSAC);

// Health Check Endpoint
router.get('/analytics-status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    services: {
      sapBusinessAI: 'active',
      sapAnalyticsCloud: 'active',
      groqAI: 'active'
    },
    rateLimit: rateLimits.sapAnalytics,
    timestamp: new Date().toISOString()
  });
});

export default router;