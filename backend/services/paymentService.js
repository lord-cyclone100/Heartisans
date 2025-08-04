import { orderModel } from '../models/orderModel.js';
import { User } from '../models/userModel.js';
import Resale from '../models/resaleModel.js';
import cashfree from '../config/cashfree.js';

export const processSuccessfulPayment = async (order, paymentDetails) => {
  try {
    order.status = 'paid';
    order.paymentDetails = {
      paymentId: paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED',
      paymentMethod: paymentDetails.payment_method,
      paymentTime: paymentDetails.payment_time,
      bankReference: paymentDetails.bank_reference
    };
    order.updatedAt = new Date();
    
    if (order.isSubscription) {
      const buyerUser = await User.findById(order.buyerId);
      if (buyerUser) {
        await User.findByIdAndUpdate(order.buyerId, {
          hasArtisanSubscription: true,
          subscriptionDate: new Date()
        });
      }
      await User.updateMany(
        { isAdmin: true },
        { $inc: { balance: 1000 } }
      );
    } else if (order.sellerId) {
      const seller = await User.findById(order.sellerId);
      if (seller) {
        seller.balance = (seller.balance || 0) + order.amount;
        await seller.save();
      }

      // Check if this is a resale product and mark it as sold
      if (order.productDetails?.productType === 'resale' || 
          (order.productDetails?.id && order.productDetails?.productType === 'resale')) {
        try {
          const resaleListing = await Resale.findById(order.productDetails.id);
          if (resaleListing) {
            await resaleListing.markAsSold();
            console.log(`Resale listing ${order.productDetails.id} marked as sold`);
          }
        } catch (resaleError) {
          console.error('Error marking resale listing as sold:', resaleError);
          // Don't throw error here, as the payment was successful
        }
      }
    }
    
    await order.save();
    return order;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

export const verifyPaymentWithCashfree = async (orderId) => {
  try {
    console.time('CashfreeAPIRequest');
    const response = await cashfree.PGFetchOrder(orderId);
    console.timeEnd('CashfreeAPIRequest');
    
    if (!response.data) {
      throw new Error('Invalid response from Cashfree API');
    }
    
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    console.error('Cashfree API Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    throw error;
  }
};

export const createCashfreeOrder = async (orderPayload) => {
  try {
    const response = await cashfree.PGCreateOrder(orderPayload);
    return {
      payment_session_id: response.data?.payment_session_id,
      payment_link: response.data?.payment_link,
      status: response.status
    };
  } catch (error) {
    console.error('Cashfree Order Creation Error:', error);
    throw error;
  }
};

export const getOrderStatus = async (order) => {
  try {
    if (!order || !order.orderId) {
      throw new Error('Invalid order data');
    }
    
    const status = await orderModel.findOne({ orderId: order.orderId })
      .select('status paymentDetails updatedAt')
      .lean();
    
    return status || { status: 'unknown' };
  } catch (error) {
    console.error('Order status check error:', error);
    throw error;
  }
};
