import { sendRsp } from "../utlis/response.js";
import Razorpay from 'razorpay';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const razorpay = new Razorpay({
  key_id: 'rzp_test_x1UdXJaE055xw3',
  key_secret: 'zKd1i1zm21a7WeQ95aOZbDql',
});


// Serve a simple HTML page for testing
export const checkoutForm = async (req, res) => {
    res.sendFile(__dirname + '/razorpay_index.html');
  }

  export const createOrder = async (req, res) => {
    try {
      const { amount, currency, receipt, payment_capture } = req.body;
  
      // Create an order using the Razorpay API
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt,
        payment_capture,
      });
  
      res.json(order);
    } catch (error) {
      console.log("checkoutCart error", error);
      return sendRsp(res, 500, "checkoutCart failed");
    }
  }

