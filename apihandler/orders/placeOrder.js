import B2BOrder from "../../models/B2B_Orders.js";
import MasterProduct from "../../models/MasterProduct.js";

async function placeOrder(req, res) {
  try {
    let body = req.body;
    let orderedItems = Array(...body.items);

    if (orderedItems.length <= 0) {
      return res.json({ status: "failed", message: "product not found" });
    }

    let uniqueProductIds = orderedItems.map((item) => item.id);

    const productDetails = await MasterProduct.find({
      _id: { $in: uniqueProductIds },
    });

    if (productDetails.length < 1) {
      return res.json({ status: "failed", message: "product not found" });
    }

    const loggedinUser = req.authMiddleware;
    const retailerId = loggedinUser._id;
    const ADMIN_ID = "69b5e6ef56c76b6c043cdbdc"; // Reverted to hardcoded ADMIN_ID

    let base = 0;
    let dbEntryItems = [];
    
    for (let i = 0; i < orderedItems.length; i++) {
      let orderedItem = orderedItems[i]; // The one user passed through API
      let product = productDetails.find((item) => orderedItem.id == item._id);

      if (!product) continue;

      base += product.basePrice * orderedItem.quantity;

      dbEntryItems.push({
        masterProductId: product._id,
        quantity: orderedItem.quantity,
        priceAtPurchase: product.basePrice,
      });
    }

    // Insert the order in database
    const newOrder = await B2BOrder.create({
      retailerId: retailerId,
      adminId: ADMIN_ID,
      items: dbEntryItems,
      totalAmount: base,
      orderStatus: "PROCESSING",
      createdAt: new Date()
    });

    // Respond with success
    return res.json({
      status: "success",
      message: "Order placed successfully",
      orderId: newOrder._id,
      totalAmount: base
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "failed", message: "Internal Server Error", error });
  }
}

export default placeOrder;
