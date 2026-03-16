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

    let base = 0;
    let dbEntryItems = [];
    for (let i = 0; i < orderedItems.length; i++) {
      let orderedItem = orderedItems[i]; // The one user passed through API
      // The one got from Database
      let product = productDetails.filter(
        (item) => orderedItem.id == item._id,
      )[0];

      base += product.basePrice * orderedItem.quantity;

      // Prepare individual items with predefined sturcture, to insert in db later step
      dbEntryItems.push({
        masterProductId: product._id,
        quantity: orderedItem.quantity,
        priceAtPurchase: product.basePrice,
      });
    }

    const loggedinUser = req.authMiddleware;
    const retailerId = loggedinUser._id;
    const ADMIN_ID = "69b5e6ef56c76b6c043cdbdc";

    // Insert the order in database
    const newOrder = await B2BOrder.create({
      retailerId: retailerId,
      adminId: ADMIN_ID,
      items: dbEntryItems,
      totalAmount: base,
      orderStatus: "PROCESSING",
    });

    // Respond with success and order details
    return res.json({
      status: "success",
      items: dbEntryItems,
      totalAmount: base,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "failed", message: "Internal Server Error", error });
  }
}

export default placeOrder;
