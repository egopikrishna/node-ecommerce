//const express = require("express");
import express from 'express';
import bodyParser from 'body-parser';
//const userRoutes = require('./Routes/users');
import { mongoConnect } from './utlis/db.js';
import userRoutes from './Routes/users.js';
import productRoutes from './Routes/products.js';
import paymentRoutes from './Routes/payment.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import session from 'express-session';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

const app = express();

app.use(cors());

app.use(session({
    secret: 'your-session-sec-key',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json()); // Parsing req body data

const indexPath = path.resolve(__dirname, 'index.html');

app.get('/', (req, res, next) => {
   // res.send('<h1>Welcome to ecommerce service</h1>');
   res.sendFile(indexPath);
});


app.use('/user', userRoutes);  // https://www.user-api.shopcart.com
app.use('/product', productRoutes); // https://www.product-api.shopcart.com
app.use('/payment', paymentRoutes); // https://www.payment-api.shopcart.com



mongoConnect();

const nodeServer = app.listen(3000, ()=>{
    console.log('Check port no 3000');
});

const io = new Server(nodeServer);

io.on('connection', (socket)=>{
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        console.log('chat msg', msg);

       if(msg === 'hi') {
        io.emit('chat message', 'hello');
       } else if(msg === 'h r u?') {
        io.emit('chat message', 'Im fine');
       } else {
        io.emit('chat message', msg);
       }

    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    })

});

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Shoppingcart API",
			version: "1.0.0",
			description: "Shoppingcart E-commerce API",
		},
		servers: [
			{
				url: `http://localhost:3000`,
			},
		],
	},
	apis: ["./swagger.js"] // Path to the file containing your JSDoc comments
};


const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use((req, res) => {
    res.send('<h1>Page Not Found!</h1>')
});


