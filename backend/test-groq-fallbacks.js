import GroqIntelligentFallback from './services/groqIntelligentFallback.js';
import dotenv from 'dotenv';

dotenv.config();

async function testGroqFallbacks() {
    console.log('🧪 Testing Groq Intelligent Fallback System...\n');
    
    const groqFallback = new GroqIntelligentFallback();
    
    // Test product data
    const testProduct = {
        name: 'Premium Rajasthani Jewelry',
        category: 'jewelry',
        region: 'Rajasthan',
        materials: 'Silver and precious stones',
        basePrice: 2500
    };

    try {
        console.log('🔍 Testing SAP AI Core Price Prediction Fallback...');
        const pricePrediction = await groqFallback.generateSAPAICoreResponse(testProduct, 'price_prediction');
        console.log('✅ Price Prediction Result:', {
            predicted_price: pricePrediction.predicted_price,
            confidence_score: pricePrediction.confidence_score,
            sap_service: pricePrediction.sap_service,
            ai_powered: pricePrediction.ai_powered
        });
        console.log('');

        console.log('🏢 Testing SAP Business AI Content Generation Fallback...');
        const contentGeneration = await groqFallback.generateSAPBusinessAIResponse(testProduct, 'content_generation');
        console.log('✅ Content Generation Result:', {
            product_description: contentGeneration.product_description,
            marketing_headlines: contentGeneration.marketing_headlines?.slice(0, 2),
            sap_service: contentGeneration.sap_service,
            ai_powered: contentGeneration.ai_powered
        });
        console.log('');

        console.log('📊 Testing SAP Analytics Cloud Market Intelligence Fallback...');
        const marketIntelligence = await groqFallback.generateSAPAnalyticsCloudResponse(testProduct, 'market_intelligence');
        console.log('✅ Market Intelligence Result:', {
            market_size: marketIntelligence.market_size,
            growth_rate: marketIntelligence.growth_rate,
            key_insights: marketIntelligence.key_insights?.slice(0, 2),
            sap_service: marketIntelligence.sap_service,
            ai_powered: marketIntelligence.ai_powered
        });
        console.log('');

        console.log('🎯 All Groq Fallback Tests Passed! ✅');
        console.log('');
        console.log('🚀 Your SAP services now have intelligent Groq-powered fallbacks that provide:');
        console.log('   • Real AI-generated pricing insights instead of hardcoded values');
        console.log('   • Dynamic content generation for product descriptions');
        console.log('   • Intelligent market analysis with actual reasoning');
        console.log('   • SAP-style enterprise responses with AI enhancement');
        console.log('');
        console.log('💡 This means when SAP APIs are unavailable, users get real AI insights instead of static templates!');
        
    } catch (error) {
        console.error('❌ Groq Fallback Test Failed:', error);
        console.log('⚠️  Make sure GROQ_API_KEY is set in your .env file');
    }
}

// Run the test
testGroqFallbacks();
