import MasterProduct from "../../models/MasterProduct.js";
import B2BOrder from "../../models/B2B_Orders.js";

async function fetchAdminInventory(req, res) {
  try {
    const loggedinUser = req.authMiddleware;

    if (!loggedinUser) {
      return res.json({ status: "failed", message: "Unauthorized" });
    }

    // Since MasterProducts do not have an adminId associated with each document, we fetch all products
    const inventory = await MasterProduct.find({});
    
    // Fetch B2B orders specifically associated with this admin
    const orders = await B2BOrder.find({
      adminId: loggedinUser._id,
    }).populate("items.masterProductId");

    return res.json({ status: "success", inventory, orders });
  } catch (error) {
    console.error("Error fetching admin inventory:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default fetchAdminInventory;