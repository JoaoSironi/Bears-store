const Order = require('../models/Order');

async function create(orderData) {
  const order = new Order({
    products: orderData.products,
    total: orderData.total,
    customerName: orderData.customerName,
    contactNumber: orderData.contactNumber
  });
  await order.save();
  return order;
}

async function find(limit = 50) {
  return Order.find().sort({ createdAt: -1 }).limit(limit).exec();
}

module.exports = { create, find };
