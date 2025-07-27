import GroqIntelligentFallback from './services/groqIntelligentFallback.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDetailedPricingFields() {
    console.log('🧪 Testing Detailed Pricing Fields for Frontend...\n');
    
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
        console.log('🔍 Testing SAP AI Core Price Prediction with Full Fields...');
        const pricePrediction = await groqFallback.generateSAPAICoreResponse(testProduct, 'price_prediction');
        
        console.log('\n✅ Complete Pricing Response:');
        console.log(JSON.stringify(pricePrediction, null, 2));
        
        console.log('\n🔍 Checking Required Frontend Fields:');
        
        // Check all required fields
        const requiredFields = {
            'predicted_price': pricePrediction.predicted_price,
            'confidence_score': pricePrediction.confidence_score,
            'pricingFactors': pricePrediction.pricingFactors,
            'recommendations': pricePrediction.recommendations,
            'sapBusinessInsights.profitAnalysis.grossMargin': pricePrediction.sapBusinessInsights?.profitAnalysis?.grossMargin,
            'sapBusinessInsights.profitAnalysis.profitHealthScore': pricePrediction.sapBusinessInsights?.profitAnalysis?.profitHealthScore,
            'market_factors': pricePrediction.market_factors,
            'price_range': pricePrediction.price_range
        };
        
        let allFieldsPresent = true;
        
        for (const [field, value] of Object.entries(requiredFields)) {
            if (value !== undefined && value !== null) {
                console.log(`✅ ${field}: ${Array.isArray(value) ? `[${value.length} items]` : value}`);
            } else {
                console.log(`❌ ${field}: MISSING`);
                allFieldsPresent = false;
            }
        }
        
        if (allFieldsPresent) {
            console.log('\n🎉 All required fields are present! Frontend will display complete pricing information.');
        } else {
            console.log('\n⚠️  Some fields are missing. Frontend may show empty sections.');
        }
        
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

// Run the test
testDetailedPricingFields();
