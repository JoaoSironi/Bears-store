import ApiClient from './ApiClient';

async function createOrder(order) {
  return ApiClient.post('/orders', order);
}

export default { createOrder };
