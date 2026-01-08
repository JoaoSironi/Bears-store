import ApiClient from './ApiClient';

async function createOrder(order) {
  return ApiClient.post('/api/orders', order);
}

export default { createOrder };
