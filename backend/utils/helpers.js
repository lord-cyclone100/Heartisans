export const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const validateSubscriptionAmount = (subscriptionPlan, amount) => {
  const isYearlyPlan = subscriptionPlan === 'yearly';
  const expectedAmount = isYearlyPlan ? 2000 : 200;
  return parseFloat(amount) === expectedAmount;
};

export const formatOrderPayload = (orderData) => {
  return {
    order_id: orderData.orderId,
    order_amount: orderData.amount,
    order_currency: "INR",
    customer_details: {
      customer_id: `CUST_${Date.now()}`,
      customer_name: orderData.name,
      customer_email: orderData.email || "test@example.com",
      customer_phone: orderData.mobile.toString()
    },
    order_meta: {
      return_url: orderData.returnUrl,
      payment_methods: "cc,dc,upi"
    },
    order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
};