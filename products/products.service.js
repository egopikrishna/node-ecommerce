import categoryModel from "../models/category.model.js";

export const createNewCategory = async catData => {
    return new Promise((resolve, reject) => {
        const queryObj = {
            ...catData
        };

        categoryModel.create(queryObj).then(res => {
            resolve(res);
        }).catch(error => {
            console.log(error);
            reject(false);
        });
    })
};

