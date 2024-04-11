import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        first_name: String,
        last_name: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: Number
        }
    }
);

export default mongoose.model('User', userSchema);