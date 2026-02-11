import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  dateCreated: { type: Number, required: true },
  warranty: { type: Number, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true },
  image: { type: String, required: false },
  reviews: { type: [reviewSchema], default: [] },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
