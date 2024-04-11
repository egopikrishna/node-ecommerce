import { sendRsp } from "../utlis/response.js";
import usersModel from "../models/users.model.js";
import { isEmailEixts } from './user.service.js';
import  Jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import axios from "axios";

export const userRegistration = async (req, res) => {
  try {
    console.log(req.body);

    const isEmailCheck = await isEmailEixts(req.body.email);

    if(isEmailCheck) return sendRsp(res, 409, "Email already taken", {}); 

    const saltRounds = 10;

    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    const userReg = await usersModel.create(req.body);

    if (!userReg) return sendRsp(res, 403, "Something went wrong");

    sendRsp(res, 200, "User Regsitered successfully");
  } catch (error) {
    console.log("userRegistration Error :: ", error);
    return sendRsp(res, 500, "Something went wrong", {});
  }
};

export const userList = (req, res) => {
  sendRsp(res, 200, "User Listed successfully");
};

export const userExistsCheck = async (req, res) => {
  try {
    const { email } = req.body;

    const isEmailCheck = await isEmailEixts(email);

    if(isEmailCheck) return sendRsp(res, 409, "Email already taken", {}); 

    sendRsp(res, 200, "Acount available for you", {});
  } catch (error) {
    console.log("userExistsCheck error :: ", error);
    return sendRsp(res, 500, "Something went wrong", {});
  }
};

export const userLogin = async (req, res) => {
    try {
        console.log('req.body', req.body);
        const { email, password } = req.body;

        const user = await usersModel.findOne({ email }, 'email password').lean();

        if(!user) return sendRsp(res, 404, "Email Not found");

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) return sendRsp(res, 401, "Invalid Password");


        const loginResult = await usersModel.findOne({email }, {password: 0, __v: 0}).lean();

        if(!loginResult) return sendRsp(res, 203, "Invalid Login");

      const payload = {
        _id: loginResult._id.toString(),
        email: loginResult.email
      };

      const secretKey = process.env.JWT_SECRECT_KEY;

      const options = {expiresIn: "1h"};

      const token = Jwt.sign(payload, secretKey, options);
      console.log('loginResult', loginResult);
      req.session.loggedUserData = loginResult;

        sendRsp(res, 200, 'User logged In', {token, user_id: loginResult._id.toString()});
    } catch (error) {
        console.log("userLogin error :: ", error);
        return sendRsp(res, 500, "Something went wrong", {});
      }

}

export const userAccount = (req, res) => {
  console.log('req.session.loggedUserData', req.session.loggedUserData);
    sendRsp(res, 200, 'Account fecthed', {});
};

export const forgotPassword = async (req, res) =>{
  try {
    const { email } = req.body;
    const user = await usersModel.findOne({ email }, 'email password').lean();

    if(!user) return sendRsp(res, 404, "Email Not found");

    const newPassword = generateRandomPassword(10);

    // Create a transporter with your email service provider's configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID, // Replace with your Gmail address
    pass: process.env.GMAIL_PASSWORD  // Replace with your Gmail password or an app-specific password
  }
});

// Define the email options
const mailOptions = {
  from: process.env.GMAIL_ID,  // Replace with your Gmail address
  to: req.body.email,  // Replace with the recipient's email address
  subject: 'Password Reset',
  text: `This is your new password to reset: ${newPassword}` 
};
console.log('mailOptions', mailOptions);
// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
  
  // Close the transporter after sending the email
  transporter.close();
});

sendRsp(res, 200, 'Password reset', mailOptions);

  } catch (error) {
    console.log("forgotPassword error :: ", error);
    return sendRsp(res, 500, "Something went wrong", {});
  }
}

function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

export const getWeather = (req, res) => {
  try {
    const apiKey = "3a3eb62e70b9745f96cb7c04245a9cb8";
    const city = req.params.city;

    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    axios.get(apiUrl).then(response => {
      console.log('response', response);

      sendRsp(res, 200, "Weather data fetched", response.data);
    }).catch(error => {
      console.log("error in fetcheing weather api ::", error);
      return sendRsp(res, 500, "Something went wrong", {});
    });

  } catch(error) {
    console.log("getWeather error :: ", error);
    return sendRsp(res, 500, "Something went wrong", {});
  }
}