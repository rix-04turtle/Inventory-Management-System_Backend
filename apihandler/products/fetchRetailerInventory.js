import RetailerInventory from "../../models/RetailerInventories.js";

async function fetchRetailerInventory(req, res) {
  try {
    const loggedinUser = req.authMiddleware;
    
    if (!loggedinUser) {
        return res.json({ status: "failed", message: "Unauthorized" });
    }

    // Fetch inventory for the logged-in retailer
    const inventory = await RetailerInventory.find({
      retailerId: loggedinUser._id,
    }).populate("masterProductId");

    return res.json({ status: "success", inventory });
  } catch (error) {
    console.error("Error fetching retailer inventory:", error);
    return res.json({ status: "failed", message: "Internal Server Error" });
  }
}

export default fetchRetailerInventory;
