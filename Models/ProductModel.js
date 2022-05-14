import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    images: [String],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    old_price: {
      type: Number,
      required: true,
      default: 0,
    },
    new_price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
