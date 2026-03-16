import B2BOrder from "../../models/B2B_Orders.js";
import MasterProduct from "../../models/MasterProduct.js";
import RetailerInventory from "../../models/RetailerInventories.js";

async function receiveOrder(req, res) {
  try {
    const loggedinUser = req.authMiddleware;
    if (!loggedinUser) {
      return res.json({ status: "failed", message: "Unauthorized" });
    }

    const { orderId } = req.body; 

    if (!orderId) {
      return res.json({ status: "failed", message: "Order ID is required" });
    }

    const order = await B2BOrder.findById(orderId);
    if (!order) {
      return res.json({ status: "failed", message: "Order not found" });
    }

    // Must be mapped to the logged in Retailer
    if (order.retailerId.toString() !== loggedinUser._id.toString()) {
        return res.json({ status: "failed", message: "Cannot accept delivery for another user's order" });
    }

    // Order must be in SHIPPED status to interact
    if (order.orderStatus !== "SHIPPED") {
      return res.json({ status: "failed", message: `Order cannot be received in its current status: ${order.orderStatus}` });
    }

    // Add items to Retailer's Inventory
    for (const item of order.items) {
      const product = await MasterProduct.findById(item.masterProductId);
      const purchasePrice = item.priceAtPurchase || (product ? product.basePrice : 0);

      // Update or create the retailer's inventory
      let retailerInventory = await RetailerInventory.findOne({
        retailerId: order.retailerId,
        masterProductId: item.masterProductId
      });

      if (retailerInventory) {
        retailerInventory.stockQuantity += item.quantity;
        retailerInventory.updatedAt = new Date();
        if (retailerInventory.status === "OUT_OF_STOCK" && retailerInventory.stockQuantity > 0) {
            retailerInventory.status = "ACTIVE";
        }
        await retailerInventory.save();
      } else {
        await RetailerInventory.create({
          retailerId: order.retailerId,
          masterProductId: item.masterProductId,
          retailerPrice: purchasePrice, // default initially to basePrice/purchasePrice
          stockQuantity: item.quantity,
          status: "ACTIVE",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Update the order's status
    order.orderStatus = "DELIVERED";
    await order.save();

    return res.json({ 
      status: "success", 
      message: "Delivery accepted successfully, items added to your retail inventory.", 
      order 
    });
  } catch (error) {
    console.error("Error receiving order:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default receiveOrder;