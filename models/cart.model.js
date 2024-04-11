import mongoose from "mongoose";
const { Schema } = mongoose;
const cartSchema = new Schema({
  cartPdtId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  cartUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  cartPdtQty: {
    type: Number,
    required: true,
    default: 1
  },
  cartPdtPrice: {
    type: Number,
    required: true
  }
});
export default mongoose.model("Cart", cartSchema);
