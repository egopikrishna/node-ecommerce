import { Validator } from 'node-input-validator';
import compose from 'composable-middleware';
import { sendRsp } from '../utlis/response.js';

export const validation = validate => {

    return compose().use( async (req, res, next) => {
        try {
            const validationRules = new Validator(req.body, validate);

            const isMatched = await validationRules.check();
    
            if(!isMatched) {
                const { errors } = validationRules;
                console.log('errors', errors);
                const keyValues = Object.keys(errors);

                const validationErrors = {};

                keyValues.map(key => {
                    validationErrors[key] = errors[key].message;
                });
                
               // return res.status(422).send({error: true, errorData: validationErrors});
                return sendRsp(res, 422, "Unprocessable entitity", {}, {errorData: validationErrors});
            }

            next();
        } catch (error) {
            console.log('validation error :: ', error);
           // return res.status(500).send({error: true, errorData: "Something went wrong"});
           return sendRsp(res, 500, "Something went wrong!");
        }
        

    })
}