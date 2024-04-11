import mongoose from "mongoose";
const { Schema } = mongoose;

const productsSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_cat_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_image: {
    type: String,
  },
  product_desc: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Product", productsSchema);
