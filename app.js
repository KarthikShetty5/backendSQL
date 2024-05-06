import express from "express";
import { config } from "dotenv";
import paymentRoute from "./routes/paymentRoutes.js";
import authRoute from "./routes/authRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cors from "cors";
config({ path: "./config/config.env" });

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);
app.use("/products", productRoute);


app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);
