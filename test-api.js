// Quick API test
const baseUrl = 'https://ecommerce.routemisr.com/api/v1/';

// Test getting all products first
fetch(baseUrl + 'products')
    .then(response => response.json())
    .then(data => {
        console.log('Products API response:', data);
        if (data.data && data.data.length > 0) {
            const firstProduct = data.data[0];
            console.log('First product ID:', firstProduct.id);

            // Test getting specific product
            return fetch(baseUrl + `products/${firstProduct.id}`);
        }
    })
    .then(response => response.json())
    .then(productData => {
        console.log('Product details API response:', productData);
    })
    .catch(error => {
        console.error('API Error:', error);
    });
