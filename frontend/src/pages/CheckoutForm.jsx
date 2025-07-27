import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'

export const CheckoutForm = () => {
  const { user } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [message, setMessage] = useState('')
  const [address, setAddress] = useState("");
  const navigate = useNavigate()
  const location = useLocation();
  const total = location.state?.total || 0;
  const sellerId = location.state?.sellerId || '';
  const sellerName = location.state?.sellerName || '';
  const productDetails = location.state?.productDetails || null;
  const isSubscription = location.state?.isSubscription || false;
  const subscriptionPlan = location.state?.subscriptionPlan || 'yearly'; // Default to yearly

  const handlePayment = async(e) => {
    e.preventDefault();
    const data = {
      name:user.fullName,
      mobile:phoneNumber,
      amount:total,
      address: address,
      buyerEmail: user?.emailAddresses?.[0]?.emailAddress
    }

    // Add additional fields for regular product purchases
    if (!isSubscription) {
      data.sellerId = sellerId;
      data.sellerName = sellerName;
      data.productDetails = productDetails;
      data.isSubscription = false;
    } else {
      // Add subscription-specific fields
      data.subscriptionPlan = subscriptionPlan;
    }

    try {
      console.log("Processing payment...", { isSubscription });
      
      // Use different endpoints for subscription vs regular purchases
      const endpoint = isSubscription 
        ? "http://localhost:5000/create-subscription-order"
        : "http://localhost:5000/create-order";
      
      const response = await axios.post(endpoint, data);
      console.log("Payment API response:", response.data);
      const responseData = response.data;
      
      if (responseData.paymentSessionId && responseData.orderId) {
        // Navigate to payment page with order details
        navigate('/payment', { 
          state: { 
            orderId: responseData.orderId,
            paymentSessionId: responseData.paymentSessionId,
            bookingData: data,
            isSubscription: isSubscription
          }
        })
      }
    } catch (error) {
      console.log("Payment error:", error);
    }
  }

  return (
    <>
      <section>
        <div>
          <div className="h-[10vh] w-full"></div>
          <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            
            {/* Product Details Section */}
            {productDetails && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <div className="flex items-center gap-4 mb-3">
                  <img 
                    src={productDetails.image} 
                    alt={productDetails.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{productDetails.name}</p>
                    <p className="text-sm text-gray-600">Category: {productDetails.category}</p>
                    <p className="text-lg font-bold text-green-600">Rs {productDetails.price}</p>
                  </div>
                </div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm"><span className="font-medium">Seller:</span> {sellerName}</p>
                  <p className="text-sm"><span className="font-medium">Seller ID:</span> {sellerId || 'Loading...'}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handlePayment}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  value={user?.fullName || ""}
                  disabled
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={user?.emailAddresses?.[0]?.emailAddress || ""}
                  disabled
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="">
                <div className="text-xl font-bold mb-6">Total Amount: Rs {total}</div>
                <button type="submit" className="btn btn-success w-full text-lg" >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}