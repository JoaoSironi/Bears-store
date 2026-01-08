const express = require('express');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

module.exports = function registerRoutes(app) {
  app.use(express.json({ limit: '10mb' }));

  app.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

  const api = express.Router();
  api.use('/orders', ordersRouter);
  api.use('/products', productsRouter);
  app.use('/api', api);
};
