import { orderModel } from '../models/orderModel.js'; // Keep this one, ensure it's only once
import { User } from '../models/userModel.js';
import cashfree from '../config/cashfree.js';
import { processSuccessfulPayment, verifyPaymentWithCashfree } from '../services/paymentService.js';
import { generateOrderId, formatOrderPayload } from '../utils/helpers.js';

export const createOrder = async (req, res) => {
    try {
        const { name, mobile, amount, address, sellerId, productDetails, isSubscription, platformFee } = req.body;
        const orderId = generateOrderId();

        let buyerId = null;
        if (req.body.buyerEmail) {
            const buyer = await User.findOne({ email: req.body.buyerEmail });
            buyerId = buyer?._id;
        }

        const orderPayload = formatOrderPayload({
            orderId,
            amount,
            name,
            email: req.body.buyerEmail,
            mobile,
            returnUrl: `https://heartisans-frontend-ibwf.onrender.com/payment-success?order_id=${orderId}`
        });

        const cashfreeResponse = await cashfree.PGCreateOrder(orderPayload);

        if (cashfreeResponse.data.payment_session_id) {
            const orderData = {
                orderId,
                buyerId,
                productDetails: {
                    id: productDetails?.id,
                    productId: productDetails?.id,
                    productName: productDetails?.name,
                    productPrice: productDetails?.price,
                    productCategory: productDetails?.category,
                    productImage: productDetails?.image,
                    productType: productDetails?.productType // Add productType to identify resale vs regular products
                },
                customerDetails: {
                    name,
                    email: req.body.buyerEmail || "test@example.com",
                    mobile,
                    address
                },
                amount: parseFloat(amount),
                platformFee: parseFloat(platformFee) || 0, // Track platform fee
                status: 'pending',
                isSubscription: isSubscription || false
            };

            if (sellerId && sellerId.trim() !== '') {
                orderData.sellerId = sellerId;
            }

            const order = await orderModel.create(orderData);

            res.json({
                success: true,
                message: 'Order created successfully',
                orderId,
                paymentUrl: cashfreeResponse.data.payment_link,
                paymentSessionId: cashfreeResponse.data.payment_session_id
            });
        } else {
            throw new Error('Failed to create payment session');
        }
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message,
            details: error.response?.data || 'No additional details available'
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        console.log('Verification request for order:', req.body.orderId);

        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        // Fetch the order from your database first
        const order = await orderModel.findOne({ orderId }); // <-- ADD THIS LINE

        if (!order) { // <-- ADD THIS CHECK
            return res.status(404).json({
                success: false,
                message: 'Order not found in database.'
            });
        }

        const cashfreeResponse = await verifyPaymentWithCashfree(orderId);
        console.log('Cashfree response:', cashfreeResponse.data);

        if (cashfreeResponse.data && cashfreeResponse.data.order_status === 'PAID') {
            // Now pass the actual Mongoose 'order' document to processSuccessfulPayment
            await processSuccessfulPayment(order, cashfreeResponse.data); // <-- CHANGE THIS LINE

            res.json({
                success: true,
                message: 'Payment verified and successful',
                // Return the updated order details from the database
                order: {
                    orderId: order.orderId,
                    status: 'paid', // Or order.status after update
                    amount: order.amount,
                    productDetails: order.productDetails // Include more details as needed
                }
            });
        } else {
            // If Cashfree says not paid, still update the local order status if necessary
            // For example, if it's 'FAILED' or 'PENDING'
            if (cashfreeResponse.data && order.status !== cashfreeResponse.data.order_status.toLowerCase()) {
                 order.status = cashfreeResponse.data.order_status.toLowerCase();
                 await order.save(); // Save the updated status
            }

            res.status(200).json({ // Return 200 even if not paid, just indicate status
                success: false,
                message: cashfreeResponse.data.order_status || 'Payment not yet successful or failed',
                status: cashfreeResponse.data.order_status || 'pending'
            });
        }

    } catch (error) {
        console.error('Full payment verification error:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.query;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        const order = await orderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            orderId: order.orderId,
            status: order.status
        });

    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment status',
            error: error.message
        });
    }
};
