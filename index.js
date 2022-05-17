import express from "express";
import morgan from "morgan";
import connectDatabase from "./config/MongoDb.js";
import productRouter from "./Routes/productRoutes.js";
import cors from "cors";
import authRouter from "./Routes/authRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import dotenv from "dotenv";

dotenv.config();
connectDatabase();
const app = express();

// middleware

app.use(express.json());

app.use(cors());
app.use(morgan("module"));
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.status(200).json("HomePage");
});

const PORT = 1000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
