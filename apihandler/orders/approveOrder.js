import B2BOrder from "../../models/B2B_Orders.js";
import MasterProduct from "../../models/MasterProduct.js";
import RetailerInventory from "../../models/RetailerInventories.js";

async function approveOrder(req, res) {
  try {
    const loggedinUser = req.authMiddleware;
    if (!loggedinUser) {
      return res.json({ status: "failed", message: "Unauthorized" });
    }

    const { orderId, status } = req.body; 

    if (!orderId) {
      return res.json({ status: "failed", message: "Order ID is required" });
    }

    const order = await B2BOrder.findById(orderId);
    if (!order) {
      return res.json({ status: "failed", message: "Order not found" });
    }

    // Make sure it's not already processed
    if (order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") {
      return res.json({ status: "failed", message: "Order is already processed" });
    }

    // Default to shipped upon approval
    const newStatus = status || "SHIPPED"; 

    // Carefully decrease from Admin's MasterProduct (RetailerInventory updates on delivery receipt)
    for (const item of order.items) {
      const product = await MasterProduct.findById(item.masterProductId);
      if (!product) {
        return res.json({ status: "failed", message: "Product not found" });
      }

      // Check if Admin has sufficient stock
      if (product.stockQuantity < item.quantity) {
        return res.json({ 
          status: "failed", 
          message: `Insufficient stock for product. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
        });
      }

      // Decrease admin's stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // Update the order's status
    order.orderStatus = newStatus;
    await order.save();

    return res.json({ 
      status: "success", 
      message: "Order approved and shipped. Items have been deducted from your inventory.", 
      order 
    });
  } catch (error) {
    console.error("Error approving order:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default approveOrder;
