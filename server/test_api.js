const fetch = require('node-fetch');

async function testApi() {
    const cafeId = '69b5a9d658b2d0f44f1f0f26'; // rost's _id
    try {
        const res = await fetch(`http://localhost:5000/api/cafe/meetup-orders/${cafeId}`);
        const data = await res.json();
        console.log('API Response success:', data.success);
        console.log('Orders found:', data.orders ? data.orders.length : 0);
        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(o => {
                console.log(`- Order ${o.orderId}: ${o.status}`);
            });
        } else {
            console.log('No orders returned for this cafeId');
        }
    } catch (err) {
        console.error('API call failed:', err.message);
    }
}

testApi();
