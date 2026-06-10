require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Coupon.deleteMany({ code: { $in: ['LINO9', 'CAFFELINO100'] } });
  
  await Coupon.create({
    code: 'LINO9',
    description: 'Save 6% on this order',
    discountValue: 6,
    discountType: 'percent',
    maxUsage: 1000,
    minOrder: 500,
    minOrderRules: [{ cafe: 'Livin Roof', minOrder: 300 }, { cafe: 'Alkeme', minOrder: 300 }],
    applicableCafes: ['ALL'],
    isActive: true,
    priority: 1
  });
  
  await Coupon.create({
    code: 'CAFFELINO100',
    description: 'Save ₹100 on this order',
    discountValue: 100,
    discountType: 'flat',
    maxUsage: 1000,
    minOrder: 700,
    minOrderRules: [],
    applicableCafes: ['Chocolate Room'],
    isActive: true,
    priority: 2
  });
  
  console.log('Coupons seeded successfully');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
