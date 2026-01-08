const express = require('express');
const router = express.Router();
const OrderService = require('../services/OrderService');
const ApiError = require('../services/ApiError');

router.post('/', async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    if (err instanceof ApiError) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao salvar pedido' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await OrderService.getOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;
