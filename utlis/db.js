import mongodb from 'mongodb';
import mongoose from 'mongoose';

const MongoClient = mongodb.MongoClient;

let db;

export const mongoConnect = () => {
    mongoose.connect('mongodb+srv://gopi:gopi@mycluster.csmbn.mongodb.net/nodEcommerceOct23?retryWrites=true&w=majority').then(result => {
       
        console.log('DB Connected');
    }).catch(error => {
        console.log('DB Not Connected');
        console.log('DB Error :: ', error)
    })
};

export const getDB = () => {
    if(db) {
        return db
    }
    throw "No DB Found";
}



