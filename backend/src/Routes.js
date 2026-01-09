import { Router } from "express";
import ordersController from './controllers/orders';
import productsController from './controllers/products';

const routes = new Router();

    routes.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

    //Orders routes
    routes.post('/orders', ordersController.createOrder);
    routes.get('/orders', ordersController.getOrders);

    //Products routes
    routes.get('/products', productsController.getProducts);
    routes.get('/products/:id', productsController.getProductById);

export default routes;

