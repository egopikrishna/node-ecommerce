//const express = require("express");
import express from 'express';
import { userList, userRegistration, userExistsCheck, userLogin, userAccount, forgotPassword, getWeather } from '../users/user.controller.js';
import { body } from 'express-validator';
import validateBody from '../config/validator.js';
import { validation } from '../middleware/validation.js';
import { isAuth } from '../auth/auth.js';
const routes = express.Router();


/*routes.post('/register', [body('email').trim().isEmail().withMessage('Plz enter Valid email').normalizeEmail(), body('password', 'Password should be text & characters and it between min 6 characters and max 15 characters').trim().isLength({min: 6, max: 15}).isAlphanumeric(), body('confirmPassword').trim().custom((value, { req }) => {

    if(value !== req.body.password) {
        throw new Error("Password and Confirm password should be same");
    }

    return true;
})],  userRegistration);*/

routes.post('/register', validation(validateBody.users.register),  userRegistration);
routes.post('/email-check', validation(validateBody.users.emailCheck), userExistsCheck);
routes.post('/login', validation(validateBody.users.login), userLogin);
routes.get('/myaccount', isAuth(), userAccount);

routes.get('/list', userList);

routes.post('/forgot-password', validation(validateBody.users.emailCheck), forgotPassword);

routes.get('/get-weather/:city', getWeather);

//module.exports = routes;
export default routes;

