import usersModel from "../models/users.model.js";

export const isEmailEixts = async email => {
    
    return new Promise((resolve, reject) => {

        usersModel.countDocuments({ email }).then(res => {
            resolve(res);
        })
        .catch(error => {
            console.log(error);
            reject(false);
        });
    });
}

