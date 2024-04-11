import jwt from 'jsonwebtoken';
import { sendRsp } from '../utlis/response.js';
import compose from 'composable-middleware';
import usersModel from '../models/users.model.js';

export const isAuth = () => {
    return compose().use(async (req, res, next) => {
        try {
           // console.log('req.headers.Authorization', req.headers);
            if(!req.headers.authorization) {   // {}
                return sendRsp(res, 501, "Not Token Found");
            }

            const accessToken = req.headers.authorization.split(' ')[1];
            const jwtPayload = await jwtVerify(accessToken);
            if(!jwtPayload) return sendRsp(res, 401, "Invalid Token");

            const users = await usersModel.findOne({_id: jwtPayload._id}, {__v: 0, password: 0}).lean();
            if(!users) return sendRsp(res, 401, 'Invalid User');

            req.authUser = users;
            next();

        } catch (error) {
            console.log('isAuth error', error);

            if(error?.status === 401) {
                return sendRsp(res, 401, "Invalid Token");
            }
            return sendRsp(res, 500, "Something went wrong", {}, error);
        }
    })
};

export const jwtVerify = async token => {
    return jwt.verify(token, process.env.JWT_SECRECT_KEY, (err, verifiedJwt) => {
        if(err) {
            return Promise.reject({
                status: 401
            });
        }
        return verifiedJwt;
    });
}