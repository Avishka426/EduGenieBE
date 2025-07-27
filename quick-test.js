// Quick test to verify GPT routes are now accessible
require('dotenv').config();

const testGPTRoute = async () => {
    try {
        const baseUrl = 'https://edugeniebe-production.up.railway.app';
        
        // Test without auth first to see if route exists (should get 401, not 404)
        const response = await fetch(`${baseUrl}/api/gpt/health`);
        const data = await response.json();
        
        console.log(`Status: ${response.status}`);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.status === 401) {
            console.log('✅ Route found but needs authentication (expected)');
        } else if (response.status === 404) {
            console.log('❌ Route still not found - need to redeploy');
        } else {
            console.log('✅ Route is accessible');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

testGPTRoute();
