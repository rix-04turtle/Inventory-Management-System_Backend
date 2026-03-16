import express from "express";
import placeOrders from "./placeOrder.js";
import viewOrders from "./viewOrders.js";
import viewAdminOrders from "./viewAdminOrders.js";
import approveOrder from "./approveOrder.js";
import receiveOrder from "./receiveOrder.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const orderRoutes = express();

orderRoutes.post("/place", authMiddleware, placeOrders);

orderRoutes.get("/", authMiddleware, viewOrders);

orderRoutes.get("/admin", authMiddleware, viewAdminOrders);
orderRoutes.post("/approve", authMiddleware, approveOrder);
orderRoutes.post("/receive", authMiddleware, receiveOrder);

// productRoutes.get('/view')
// BASE URL : /orders

export default orderRoutes;
