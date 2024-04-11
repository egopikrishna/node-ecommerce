import express from 'express';
import { checkoutForm, createOrder } from '../payment/payment.controller.js';


const routes = express.Router();

routes.get('/checkout-form', checkoutForm);

routes.post('/create-order', createOrder);

//export default routes;
export default routes;