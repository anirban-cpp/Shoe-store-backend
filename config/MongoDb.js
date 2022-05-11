import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("Connected to MongoDB");
      }
    );
  } catch (error) {
    console.log("Error message", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
