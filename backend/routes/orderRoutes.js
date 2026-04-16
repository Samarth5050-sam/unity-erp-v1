const express = require('express');
const router = express.Router();
const { Order, OrderItem } = require('../models');

// User creates an order
router.post('/', async (req, res) => {
    try {
        const { user_id, user_name, user_email, items, total_amount, payment_mode, payment_id, shipping_address } = req.body;
        
        // Generate a simple tracking ID
        const tracking_id = `UE-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;

        const order = await Order.create({
            tracking_id,
            user_id: user_id || null, // null for guest
            user_name: user_name || 'Guest',
            user_email: user_email || '',
            total_amount,
            payment_mode: payment_mode || 'Razorpay',
            payment_id: payment_id || 'DEMO-' + Date.now(),
            shipping_address: shipping_address ? JSON.stringify(shipping_address) : '',
            status: 'Pending'
        });

        // Add Items
        if (items && items.length > 0) {
            const orderItems = items.map(i => ({
                order_id: order.id,
                product_id: i.id,
                product_name: i.product_name,
                quantity: i.quantity,
                price: Number(i.selling_price)
            }));
            await OrderItem.bulkCreate(orderItems);
        }

        const newOrderWithItems = await Order.findByPk(order.id, {
            include: [OrderItem]
        });

        // Emit notification
        const io = req.app.get('io');
        if (io) {
            io.emit('new_order', newOrderWithItems);
            console.log(`[Socket] new_order emitted: ${order.tracking_id}`);
        }

        res.status(201).json(newOrderWithItems);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Admin views all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [OrderItem],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// User views their orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.params.userId },
            include: [OrderItem],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch User Orders Error:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});

// Admin updates order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        order.status = status;
        await order.save();

        const updatedOrderData = await Order.findByPk(req.params.id, {
            include: [OrderItem]
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('order_updated', updatedOrderData);
        }

        res.status(200).json(updatedOrderData);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;
