import B2COrder from '../../models/B2C_Orders.js';
import RetailerInventory from '../../models/RetailerInventories.js';
import Cart from '../../models/Carts.js';

const placeB2COrder = async (req, res) => {
    try {
        const customerId = req.user.id;
        let { items, paymentDetails } = req.body; // Expect items array: [{ retailerId, retailerInventoryId, quantity, priceAtPurchase }]

        // If items not provided, try to create from cart
        if (!items || items.length === 0) {
            const cart = await Cart.findOne({ customerId }).populate('items.retailerInventoryId');
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty and no items provided.' });
            }
            items = cart.items.map(item => ({
                retailerId: item.retailerInventoryId.retailerId,
                retailerInventoryId: item.retailerInventoryId._id,
                quantity: item.quantity,
                priceAtPurchase: item.retailerInventoryId.retailerPrice
            }));
        }

        let totalAmount = 0;
        for (const item of items) {
            // Check stock and calculate total
            const inventory = await RetailerInventory.findById(item.retailerInventoryId);
            if (!inventory || inventory.stockQuantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for inventory ID ${item.retailerInventoryId}` });
            }

            totalAmount += item.quantity * item.priceAtPurchase;
            // Update stock
            inventory.stockQuantity -= item.quantity;
            await inventory.save();
        }

        const newOrder = new B2COrder({
            customerId,
            items,
            totalAmount,
            paymentDetails: paymentDetails || { status: 'PENDING' },
            orderStatus: 'PLACED',
            createdAt: Date.now()
        });

        await newOrder.save();

        // Clear user's cart after placing order
        await Cart.findOneAndUpdate({ customerId }, { items: [], updatedAt: Date.now() });

        res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Server error while placing order.' });
    }
};

export default placeB2COrder;
