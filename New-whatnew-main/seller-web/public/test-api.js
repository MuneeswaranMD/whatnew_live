// Test script to verify getMyProducts API call
// Run this in browser console after logging in as a seller

async function testGetMyProducts() {
    console.log('=== Testing getMyProducts API ===');
    
    // Check if we have auth token
    const token = localStorage.getItem('authToken');
    console.log('Auth token exists:', !!token);
    
    if (!token) {
        console.log('❌ No auth token found. Please login first.');
        return;
    }
    
    try {
        const response = await fetch('/api/products/products/my_products/', {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success! Products data:', data);
            console.log('Number of products:', data.length);
            if (data.length > 0) {
                console.log('First product:', data[0]);
            }
        } else {
            const errorText = await response.text();
            console.log('❌ Error response:', errorText);
        }
    } catch (error) {
        console.log('❌ Network error:', error);
    }
}

// Run the test
testGetMyProducts();
