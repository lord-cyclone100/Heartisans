import mongoose from 'mongoose';
import { orderModel } from '../models/orderModel.js'; // Ensure this import path is correct and the model is named 'orderModel'
// Assuming these are needed for createOrder, if not, remove them or ensure they are imported elsewhere
// import { userModel } from '../models/userModel.js';
// import cashfree from '../config/cashfree.js';
// import { processSuccessfulPayment, verifyPaymentWithCashfree } from '../services/paymentService.js';
// import { generateOrderId, formatOrderPayload } from '../utils/helpers.js';


export const createOrder = async (req, res) => {
    // Your existing createOrder function
    try {
        const orderData = req.body;

        // Check if sellerId is a valid ObjectId
        if (orderData.sellerId && !mongoose.Types.ObjectId.isValid(orderData.sellerId)) {
            delete orderData.sellerId;
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        res.status(201).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
        console.error("Order Save Error:", error.message);
        res.status(500).json({ error: "Failed to save order" });
    }
};

export const getOrdersByBuyer = async (req, res) => {
    // Your existing getOrdersByBuyer function
    try {
        const orders = await orderModel.find({
            buyerId: req.params.id,
            status: 'paid'
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Order Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// New function to get a single order by its _id
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameter

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid Order ID format" });
        }

        const order = await orderModel.findById(id); // Find the order by its _id

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order); // Send the found order as JSON
    } catch (error) {
        console.error("Error fetching single order:", error.message);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};
