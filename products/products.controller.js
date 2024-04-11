import { sendRsp } from "../utlis/response.js";
import { createNewCategory } from './products.service.js'
import productsModel from "../models/products.model.js";
import fs from 'fs';
import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";

const { ObjectId } = mongoose.Types;

export const listProducts = async (req, res) => {

    const catId = req.params.catId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    let isFileExists = false;

    const skip = (page - 1) * limit;

    const condition = catId ? {product_cat_id: new ObjectId(catId)} : {};
    
    const products = await productsModel.find(condition).select('-__v').skip(skip)
    .limit(limit)
    .lean(); // []

    const totalCount = await productsModel.countDocuments(condition); // 6

    const nextPage = page * limit < totalCount ? page + 1 : null;

    if(products && products.length) {
        products.map((pdtObj)=>{

            if(pdtObj.product_image){
                isFileExists = fs.existsSync(process.env.IMAGE_PATH+'/'+pdtObj.product_image);
            }

            if(!isFileExists) {
                pdtObj.product_image = "no-image.png";
            }

            return pdtObj;
        })
    }

    sendRsp(res, 200, "Product fectched successfully", {products, totalCount, nextPage});
};



export const createCategory = async (req, res) => {
    try {

        const catRes = await createNewCategory(req.body);
        sendRsp(res, 201, "Category created successfuly");

    } catch (error) {
        console.log('createCategory error :: ', error);
        return sendRsp(res, 500, "Something went error");
    }
}

export const createProduct = async (req, res) => {
    try {

        console.log(req.body);
    
        if(!req.file) {
           // return sendRsp(res, 415, "Unsupported File Type");
        }

        req.body.product_image = req?.file?.filename;
        req.body.product_price = Number(req.body.product_price);
        
        await productsModel.create(req.body);

        sendRsp(res, 201, "Product created successfuly");

    } catch (error) {
        console.log('createProduct error :: ', error);
        return sendRsp(res, 500, "Something went error");
    }
}

export const addToCart = async (req, res) => {
    try {

        const pdtData = await productsModel.findById(req.body.cartPdtId, 'product_price');
        if(!pdtData) return sendRsp(res, 404, "Product not found");

        req.body.cartUserId = req.authUser._id;
        req.body.cartPdtQty = 1; // 10
        req.body.cartPdtPrice = pdtData.product_price;

        const cartExist = await cartModel.findOne({cartPdtId: new ObjectId(req.body.cartPdtId), cartUserId: new ObjectId(req.authUser._id)}, 'cartPdtQty cartPdtPrice').lean();

        let cartData;
        if(!cartExist) {
            cartData = await cartModel.create(req.body);
        } else {
            const updateCart = {};
            updateCart.cartPdtQty = cartExist.cartPdtQty+1;
            updateCart.cartPdtPrice = cartExist.cartPdtPrice+ pdtData.product_price;

            cartData = await cartModel.findOneAndUpdate({cartPdtId: new ObjectId(req.body.cartPdtId), cartUserId: new ObjectId(req.authUser._id)}, updateCart, {new: true, select: '-__v'}).lean();
        }

        sendRsp(res, 201, "Cart added successfuly", cartData);
    } catch (error) {
        console.log('createProduct error :: ', error);
        return sendRsp(res, 500, "addToCart failed");
    }
}

export const getMyCartItems = async (req, res) => {
    try {
       /* const cartItems = await cartModel.find({cartUserId: new ObjectId(req.authUser._id)})
        .populate('cartPdtId')
        .lean();*/

        const cartItems = await cartModel.aggregate(
            [
                {
                    $match: {
                        cartUserId: new ObjectId(req.authUser._id)
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'cartPdtId',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                }
            ]
        );

        sendRsp(res, 200, "Cart items fetched successfuly", cartItems);
    } catch (error) {
        console.log('getMyCartItems error :: ', error);
        return sendRsp(res, 500, "getMyCartItems failed");
    }

}

export const updateCart = async (req, res) => {
    const { cartId, cartPdtQty } = req.body;

    const cartData = await cartModel.findById(cartId).populate('cartPdtId').lean();
    if(!cartData) return sendRsp(res, 404, "Cart data not found"); 

    const pdtPrice = cartData.cartPdtId.product_price;
    const updateMyCart = {};
    updateMyCart.cartPdtQty = cartPdtQty;
    updateMyCart.cartPdtPrice = cartPdtQty*pdtPrice;

    const updateCartItem = await cartModel.findByIdAndUpdate(cartId, updateMyCart, {new: true, select: '-__v'}).lean();

    sendRsp(res, 201, "Cart item updated successfully", updateCartItem);
}

export const removeCart = async (req, res) => {
    try {
        const { cartid } = req.params;

        await cartModel.deleteOne({_id: new ObjectId(cartid), cartUserId: new ObjectId(req.authUser._id)});
        res.redirect(302, '/product/mycart');
    } catch (error) {
        console.log('removeCart error :: ', error);
        return sendRsp(res, 500, "removeCart failed");
    }

}