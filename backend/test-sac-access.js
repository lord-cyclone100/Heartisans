// test-sac-access.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testSACAccess() {
    console.log('🧪 Testing SAP Analytics Cloud API Access...\n');
    
    const apiKey = process.env.SAP_ANALYTICS_CLOUD_API_KEY;
    const baseUrl = process.env.SAP_ANALYTICS_CLOUD_URL;
    
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND'}`);
    console.log(`Base URL: ${baseUrl}\n`);
    
    const testEndpoints = [
        'analytics/cloud/v1/info',
        'sac/api/v1/tenants',
        'analytics/v1/info',
        'api/sac/v1/info',
        'analytics-cloud/v1/status'
    ];
    
    for (const endpoint of testEndpoints) {
        try {
            console.log(`🔗 Testing: ${baseUrl}/${endpoint}`);
            const response = await axios.get(`${baseUrl}/${endpoint}`, {
                headers: {
                    'APIKey': apiKey,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            
            console.log(`✅ SUCCESS: ${endpoint}`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Data:`, response.data);
            break; // If one works, we're good!
            
        } catch (error) {
            console.log(`❌ Failed: ${endpoint}`);
            console.log(`   Error: ${error.response?.status || error.message}`);
        }
    }
    
    console.log('\n🏁 SAP Analytics Cloud test complete!');
}

testSACAccess();