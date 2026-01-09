const Order = require('../models/Order');
const ValidationService = require('./ValidationService');
const ApiError = require('./ApiError');

async function createOrder(orderDto) {
  const validation = ValidationService.validateOrder(orderDto);
  if (!validation.valid) {
    // status 400 com mensagens concat
    throw new ApiError(400, validation.errors.join('; '));
  }
  // persistir (pode ajustar mapeamento se necessário)
  const order = new Order({
    products: orderDto.products,
    total: orderDto.total,
    customerName: orderDto.customerName,
    contactNumber: orderDto.contactNumber
  });
  await order.save();
  return order;
}

async function getOrders(limit = 50) {
  return Order.find().sort({ createdAt: -1 }).limit(limit).exec();
}

module.exports = { createOrder, getOrders };
