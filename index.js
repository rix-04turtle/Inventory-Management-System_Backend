import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import chatbotRouter from "./apihandler/chatbot/chatbot.routes.js";
import orderRoutes from "./apihandler/orders/orders.route.js";
import productRoutes from "./apihandler/products/products.route.js";
import userRoutes from "./apihandler/user/user.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/home", (req, res) => {
  res.send("Welcome to the Home page!");
});

app.use("/products", productRoutes);

app.use("/user", userRoutes);

app.use("/orders", orderRoutes);

app.use("/chatbot", chatbotRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
