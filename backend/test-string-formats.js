import GroqIntelligentFallback from './services/groqIntelligentFallback.js';
import dotenv from 'dotenv';

dotenv.config();

async function testStringFormats() {
    console.log('🧪 Testing Updated Groq String Formats...\n');
    
    const groqFallback = new GroqIntelligentFallback();
    
    // Test product data
    const testProduct = {
        name: 'Traditional Handicraft Item',
        category: 'handicrafts',
        region: 'West Bengal',
        materials: 'Clay and paint',
        basePrice: 1200
    };

    try {
        console.log('🔍 Testing Market Intelligence String Format...');
        const marketIntel = await groqFallback.generateSAPAnalyticsCloudResponse(testProduct, 'market_intelligence');
        
        console.log('✅ Market Intelligence Response:');
        console.log('   Market Size:', marketIntel.market_size);
        console.log('   Growth Rate:', marketIntel.growth_rate);
        console.log('   Key Insights Type:', typeof marketIntel.key_insights);
        console.log('   Key Insights:', marketIntel.key_insights);
        console.log('   Opportunities Type:', typeof marketIntel.opportunities);
        console.log('   Opportunities:', marketIntel.opportunities);
        console.log('');
        
        // Check individual insight types
        if (marketIntel.key_insights && Array.isArray(marketIntel.key_insights)) {
            console.log('📋 Individual Insight Types:');
            marketIntel.key_insights.forEach((insight, index) => {
                console.log(`   Insight ${index + 1} (${typeof insight}):`, insight);
            });
        }
        console.log('');
        
        console.log('💰 Testing Pricing Analytics String Format...');
        const pricingData = await groqFallback.generateSAPAnalyticsCloudResponse(testProduct, 'pricing_analytics');
        
        console.log('✅ Pricing Analytics Response:');
        console.log('   Pricing Strategy:', pricingData.pricing_strategy);
        console.log('   Recommendations Type:', typeof pricingData.pricing_recommendations);
        console.log('   Recommendations:', pricingData.pricing_recommendations);
        
        if (pricingData.pricing_recommendations && Array.isArray(pricingData.pricing_recommendations)) {
            console.log('📋 Individual Recommendation Types:');
            pricingData.pricing_recommendations.forEach((rec, index) => {
                console.log(`   Rec ${index + 1} (${typeof rec}):`, rec);
            });
        }
        
        console.log('');
        console.log('🎯 String Format Test Complete! ✅');
        
    } catch (error) {
        console.error('❌ String Format Test Failed:', error);
    }
}

// Run the test
testStringFormats();
