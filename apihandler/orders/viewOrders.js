import B2BOrder from "../../models/B2B_Orders.js";

async function viewOrdr(req, res) {
  try {
    const loggedinUser = req.authMiddleware;
    if (!loggedinUser) {
      return res.json({ status: "failed", message: "Unauthorized" });
    }

    // Fetch orders for the logged-in retailer
    const orders = await B2BOrder.find({
      retailerId: loggedinUser._id,
    }).populate("items.masterProductId");

    return res.json({ status: "success", data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default viewOrdr;
