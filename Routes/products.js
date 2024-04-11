import express from 'express';
import { listProducts, createCategory, createProduct, addToCart, getMyCartItems, updateCart, removeCart } from '../products/products.controller.js'
import validateBody from '../config/validator.js';
import { validation } from '../middleware/validation.js';
import { isAuth } from '../auth/auth.js';
import multer from 'multer';

const routes = express.Router();

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.IMAGE_PATH);
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, new Date().getTime()+"-"+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: myStorage, fileFilter: fileFilter});


routes.get('/list-products/:catId?', listProducts);
routes.post('/category/add', isAuth(), validation(validateBody.category.create), createCategory);

routes.post('/create', isAuth(), upload.single('product_image'), validation(validateBody.products.create), createProduct);

routes.post('/add-to-cart', isAuth(), validation(validateBody.products.addTocart), addToCart);

routes.get('/mycart',  isAuth(), getMyCartItems);

routes.put('/update-cart', isAuth(), validation(validateBody.products.updateCart), updateCart);

routes.delete('/remore-cart/:cartid', isAuth(), removeCart)

export default routes;