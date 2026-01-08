const express = require('express');
const router = express.Router();
const ProductService = require('../services/ProductService');

router.get('/', async (req, res, next) => {
  const products = await ProductService.getProducts();
  res.json(products);
});

router.get('/:id', async (req, res, next) => {
  const product = await ProductService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  res.json(product);
});

module.exports = router;
