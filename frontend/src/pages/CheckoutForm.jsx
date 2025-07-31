import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

export const CheckoutForm = () => {
  const { user } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract data from location.state
  const {
    total = 0,
    sellerId,
    sellerName,
    productDetails, // This will be the correctly mapped object from ProductDetailPage
    isSubscription = false,
    subscriptionPlan = 'yearly', // Default to yearly
    directBuy = false // Flag to distinguish direct buy from cart checkout
  } = location.state || {};


  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentInProgress(true);

    const data = {
      name: user.fullName,
      mobile: phoneNumber,
      amount: total,
      address: address,
      buyerEmail: user?.emailAddresses?.[0]?.emailAddress
    };

    // Conditionally add product/subscription details based on the type of purchase
    if (isSubscription) {
      data.isSubscription = true;
      data.subscriptionPlan = subscriptionPlan;
      // No productDetails for subscriptions
    } else {
      // This is a regular product purchase (either from cart or direct buy)
      data.isSubscription = false;
      if (productDetails) { // productDetails should already be correctly formatted from ProductDetailPage
        data.productDetails = productDetails;
      }
      // Only include sellerId if it's available and not "Not Available"
      if (sellerId && sellerId !== "Not Available") {
        data.sellerId = sellerId;
      }
      // sellerName is not directly consumed by paymentController's createOrder for orderData,
      // but it might be useful for logging or other purposes.
      // It's passed in location.state, so it's available for display in the form.
    }

    try {
      console.log("Processing payment...", { isSubscription, data });

      // Use different endpoints for subscription vs regular purchases
      const endpoint = isSubscription
        ? "http://localhost:5000/api/subscription/create-order"
        : "http://localhost:5000/api/payment/create-order";

      const response = await axios.post(endpoint, data);
      console.log("Payment API response:", response.data);
      const responseData = response.data;

      if (responseData.paymentSessionId && responseData.orderId) {
        // Navigate to payment page with order details
        navigate('/payment', {
          state: {
            orderId: responseData.orderId,
            paymentSessionId: responseData.paymentSessionId,
            bookingData: data, // Keep bookingData for context if needed on payment page
            isSubscription: isSubscription
          }
        });
      }
    } catch (error) {
      console.error("Payment error:", error); // Use console.error for errors
      // You might want to display an error message to the user here
    } finally {
      setPaymentInProgress(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (paymentInProgress) {
        e.preventDefault();
        e.returnValue = 'Your payment is being processed. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [paymentInProgress]);

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="w-full h-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Checkout
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto">
              Complete your purchase and support authentic artisan craftsmanship.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #479626' }}>
            {/* Product Details Section */}
            {productDetails && (
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <img 
                        src={productDetails.image} 
                        alt={productDetails.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {productDetails.name}
                      </h4>
                      <p className="text-base sm:text-lg text-gray-600 mb-2">
                        Category: {productDetails.category}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#479626' }}>
                        ₹{productDetails.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Seller</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Seller ID</p>
                        <p className="text-lg font-semibold text-gray-900">{sellerId || 'Loading...'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(to right, #479626, #3d7a20)' }}>
                    <p className="text-lg font-medium opacity-90 mb-2">Total Amount</p>
                    <p className="text-3xl sm:text-4xl font-bold">₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Checkout Form */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Billing Information</h3>
              
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.fullName || ""}
                    disabled
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-lg"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.emailAddresses?.[0]?.emailAddress || ""}
                    disabled
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-lg"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Delivery Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-lg"
                    placeholder="Enter your complete delivery address"
                    rows={4}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full text-white py-4 px-8 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    style={{ backgroundColor: '#ffaf27' }}
                  >
                    Pay ₹{total.toLocaleString()} Now
                    <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6" style={{ border: '1px solid #479626' }}>
            <div className="flex items-center justify-center space-x-4">
              <div className="rounded-full p-3" style={{ backgroundColor: '#e8f5e8' }}>
                <svg className="w-6 h-6" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Secure Payment</p>
                <p className="text-base text-gray-600">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}