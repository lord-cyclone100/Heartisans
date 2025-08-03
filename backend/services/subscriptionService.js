import { orderModel } from '../models/orderModel.js';
import { User } from '../models/userModel.js';

export const processSubscriptionPayment = async (order, paymentDetails) => {
  try {
    const updatedOrder = await orderModel.findOneAndUpdate(
      { orderId: order.orderId, isSubscription: true, status: 'pending' },
      {
        status: 'paid',
        paymentDetails: {
          paymentId: paymentDetails.payment_id || 'SUBSCRIPTION_COMPLETED',
          paymentMethod: paymentDetails.payment_method,
          paymentTime: paymentDetails.payment_time
        },
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      console.warn(`Subscription order ${order.orderId} was already processed`);
      return null;
    }

    const buyerUser = await User.findById(order.buyerId);
    if (buyerUser && !buyerUser.hasArtisanSubscription) {
      const subscriptionType = order.subscriptionType;
      const isYearlyPlan = subscriptionType === 'yearly';
      const subscriptionEndDate = new Date();
      
      if (isYearlyPlan) {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }
      
      await User.findByIdAndUpdate(order.buyerId, {
        hasArtisanSubscription: true,
        subscriptionDate: new Date(),
        subscriptionType: subscriptionType,
        subscriptionEndDate: subscriptionEndDate
      });
      
      const adminBonus = isYearlyPlan ? 2000 : 200;
      await User.updateMany(
        { isAdmin: true },
        { $inc: { balance: adminBonus } }
      );
    }

    return updatedOrder;
  } catch (error) {
    console.error('Subscription processing error:', error);
    throw error;
  }
};

export const createSubscriptionOrder = async (subscriptionData) => {
  try {
    const { name, email, mobile, amount, address, subscriptionPlan } = subscriptionData;
    const isYearlyPlan = subscriptionPlan === 'yearly';
    const expectedAmount = isYearlyPlan ? 2000 : 200;

    if (parseFloat(amount) !== expectedAmount) {
      throw new Error(`Invalid amount for ${subscriptionPlan} plan`);
    }

    const buyer = await User.findOne({ email });
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const orderData = {
      buyerId: buyer._id,
      productDetails: {
        productId: `artisan-subscription-${subscriptionPlan}`,
        productName: isYearlyPlan ? 'Artisan Plan - Yearly' : 'Artisan Plan - Monthly',
        productPrice: amount.toString(),
        productCategory: 'Subscription'
      },
      customerDetails: {
        name,
        email,
        mobile,
        address
      },
      amount: parseFloat(amount),
      isSubscription: true,
      subscriptionType: subscriptionPlan
    };

    return orderData;
  } catch (error) {
    console.error('Subscription order creation error:', error);
    throw error;
  }
};

export const verifySubscriptionStatus = async (orderId) => {
  try {
    const order = await orderModel.findOne({ orderId, isSubscription: true });
    if (!order) {
      throw new Error('Subscription order not found');
    }
    return order;
  } catch (error) {
    console.error('Subscription verification error:', error);
    throw error;
  }
};
