const express = require('express');
const OrderService = require('../services/OrderService');
const ApiError = require('../services/ApiError');

class OrdersController {
  async createOrder(req, res) {
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
  };

  async getOrders(req, res) {
    try {
      const orders = await OrderService.getOrders();
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  };
}

export default new OrdersController();
