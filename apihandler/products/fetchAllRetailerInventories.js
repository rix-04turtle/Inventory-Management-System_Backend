import RetailerInventory from '../../models/RetailerInventories.js';

const fetchAllRetailerInventories = async (req, res) => {
    try {
        const inventory = await RetailerInventory.find({ status: 'ACTIVE' })
            .populate('masterProductId')
            .populate('retailerId', 'name email storeName storeLocation');

        res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error('Error fetching retailer inventories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching inventories.'
        });
    }
};

export default fetchAllRetailerInventories;
