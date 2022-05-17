import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippingAddress: {
      address: { type: String, required: false, default: "" },
      city: { type: String, required: false, default: "" },
      postalCode: { type: String, required: false, default: "" },
      country: { type: String, required: false, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
