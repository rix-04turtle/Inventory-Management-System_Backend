import B2BOrder from "../../models/B2B_Orders.js";

async function viewAdminOrders(req, res) {
  try {
    const loggedinUser = req.authMiddleware;
    if (!loggedinUser) {
      return res.json({ status: "failed", message: "Unauthorized" });
    }

    // Fetch orders where the logged-in user is the admin (wholesaler)
    const orders = await B2BOrder.find({
      adminId: loggedinUser._id,
    })
      .populate("items.masterProductId")
      .populate("retailerId", "name email"); // Populate retailer details if necessary

    return res.json({ status: "success", data: orders });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default viewAdminOrders;
