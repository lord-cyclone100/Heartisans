import { orderModel } from '../models/orderModel.js';
import cashfree from '../config/cashfree.js';
import { processSubscriptionPayment } from '../services/subscriptionService.js';
import { generateOrderId, formatOrderPayload, validateSubscriptionAmount } from '../utils/helpers.js';

export const createSubscriptionOrder = async (req, res) => {
  try {
    const { name, mobile, amount, address, subscriptionPlan } = req.body;
    
    if (!validateSubscriptionAmount(subscriptionPlan, amount)) {
      const expectedAmount = subscriptionPlan === 'yearly' ? 2000 : 200;
      return res.status(400).json({ 
        message: `Invalid amount for ${subscriptionPlan} plan. Expected: Rs ${expectedAmount}` 
      });
    }

    const orderId = generateOrderId();
    const planName = subscriptionPlan === 'yearly' 
      ? 'Artisan Plan - Yearly' 
      : 'Artisan Plan - Monthly';

    let buyerId = null;
    if (req.body.buyerEmail) {
      const buyer = await userModel.findOne({ email: req.body.buyerEmail });
      buyerId = buyer?._id;
    }

    const orderPayload = formatOrderPayload({
      orderId,
      amount,
      name,
      email: req.body.buyerEmail,
      mobile,
      returnUrl: `http://localhost:5173/subscription-success?order_id=${orderId}`
    });

    const cashfreeResponse = await cashfree.PGCreateOrder(orderPayload);

    if (cashfreeResponse.data.payment_session_id) {
      const order = await orderModel.create({
        orderId,
        buyerId,
        productDetails: {
          productId: `artisan-subscription-${subscriptionPlan}`,
          productName: planName,
          productPrice: amount.toString(),
          productCategory: 'Subscription',
          productImage: null
        },
        customerDetails: {
          name,
          email: req.body.buyerEmail || "test@example.com",
          mobile,
          address
        },
        amount: parseFloat(amount),
        status: 'pending',
        isSubscription: true,
        subscriptionType: subscriptionPlan
      });

      res.json({
        success: true,
        message: 'Subscription order created successfully',
        orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create subscription payment session');
    }
  } catch (error) {
    console.error('Subscription order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create subscription order',
      error: error.message
    });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findOne({ orderId, isSubscription: true });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Subscription order not found'
      });
    }

    if (order.status === 'paid') {
      return res.json({
        success: true,
        orderStatus: 'PAID',
        message: 'Already processed',
        order
      });
    }

    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    if (orderStatus === 'PAID') {
      const updatedOrder = await processSubscriptionPayment(order, paymentDetails);
      
      if (!updatedOrder) {
        return res.json({
          success: true,
          orderStatus: 'PAID',
          message: 'Already processed',
          order
        });
      }

      return res.json({
        success: true,
        orderStatus,
        order: updatedOrder
      });
    }

    order.status = orderStatus.toLowerCase();
    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: orderStatus === 'PAID',
      orderStatus,
      order
    });
  } catch (error) {
    console.error('Subscription payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify subscription payment',
      error: error.message
    });
  }
};