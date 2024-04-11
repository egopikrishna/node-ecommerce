import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
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

export default mongoose.model("Category", categorySchema);
