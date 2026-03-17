require('dotenv').config();
const mongoose = require('mongoose');
const MeetupOrder = require('./models/Meetup/MeetupOrder');

async function testValidation() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const orderData = {
      meetupId: new mongoose.Types.ObjectId('69b6e798a62103ca09058626'),
      userId: 'test_user',
      userName: 'bunny',
      items: [{ name: 'chicken', quantity: 1, price: 329 }],
      subtotal: 329,
      cgst: 10,
      sgst: 10,
      commission: 20,
      total: 369,
      status: 'PENDING',
      orderId: '417815_TEST2',
      splitEnabled: false,
      perPersonAmount: 0,
      members: [],
      cafeId: '69b6dc71a62103ca09058418',
      paymentStatus: 'PENDING'
    };

    console.log('Validating...');
    const order = new MeetupOrder(orderData);
    await order.validate();
    console.log('✅ Validation passed');
    
    console.log('Saving...');
    await order.save();
    console.log('✅ Save passed');
    
    await MeetupOrder.deleteOne({_id: order._id});
    console.log('✅ Cleanup passed');

  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testValidation();
