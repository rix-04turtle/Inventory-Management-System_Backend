import Cart from '../../models/Carts.js';
import RetailerInventory from '../../models/RetailerInventories.js';

const getUserCart = async (req, res) => {
    try {
        const customerId = req.authMiddleware._id; // From auth middleware
        const cart = await Cart.findOne({ customerId }).populate({
            path: 'items.retailerInventoryId',
            populate: [
                { path: 'masterProductId' },
                { path: 'retailerId', select: 'name storeName' }
            ]
        });

        if (!cart) {
            return res.status(200).json({ success: true, data: { items: [] } });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching cart.' });
    }
};

const updateUserCart = async (req, res) => {
    try {
        const customerId = req.authMiddleware._id;
        const { items } = req.body;

        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            cart = new Cart({ customerId, items });
        } else {
            cart.items = items;
            cart.updatedAt = Date.now();
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Cart updated successfully', data: cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Server error while updating cart.' });
    }
};

export { getUserCart, updateUserCart };
