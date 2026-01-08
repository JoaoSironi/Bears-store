const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// criar pedido
router.post('/', async (req, res) => {
  try {
    const { products, total, customerName, contactNumber } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Produtos obrigatórios' });
    }
    const order = new Order({ products, total, customerName, contactNumber });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar pedido' });
  }
});

// listar pedidos (opcional)
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
  res.json(orders);
});

module.exports = router;
