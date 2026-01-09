const express = require('express');
const ProductService = require('../services/ProductService');

class ProductsController {
  async getProducts(req, res, next) {
    const products = await ProductService.getProducts();
    res.json(products);
  }

  async getProductById(req, res, next) {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  }
}

export default new ProductsController();
