import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiPackage, FiTruck, FiCreditCard, FiUser, FiCalendar, FiMail, FiMapPin, FiLink } from 'react-icons/fi';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Spacer div for navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="flex-grow flex justify-center items-center text-4xl">Loading...</div>
    </div>
  );
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Spacer div for navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="flex-grow flex justify-center items-center text-4xl">Order not found</div>
    </div>
  );

  return (
    <div className="min-h-screen"> {/* Added min-h-screen for consistent layout */}
      {/* Spacer div to push content down, matching the height used by your navbar */}
      <div className="w-full h-[10vh]"></div> 

      <div className="max-w-6xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 mb-8 hover:text-indigo-800 transition-colors text-3xl"
        >
          <FiArrowLeft className="mr-4 text-4xl" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold text-gray-800">Heartisans*</h1>
                <h2 className="text-4xl font-semibold mt-4">Order #{order.orderId}</h2>
              </div>
              <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm">
                <FiCalendar className="mr-4 text-indigo-500 text-3xl" />
                <span className="text-gray-700 text-2xl">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-10">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Order Items */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="flex items-center text-3xl font-medium mb-6">
                  <FiPackage className="mr-4 text-indigo-500 text-3xl" /> Order Items
                </h3>
                {order.productDetails && (
                  <div className="flex items-start mb-8">
                    {order.productDetails.productImage && (
                      <img
                        src={order.productDetails.productImage}
                        alt={order.productDetails.productName}
                        className="w-32 h-32 object-cover rounded-md mr-8"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-3xl font-semibold">{order.productDetails.productName}</p>
                      <p className="text-gray-600 mt-3 text-2xl">Category: {order.productDetails.productCategory}</p>
                      <p className="text-gray-800 font-bold mt-4 text-3xl">Price: ₹{order.productDetails.productPrice}</p>
                      {order.isSubscription && (
                        <div className="mt-5 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full inline-block text-2xl">
                          {order.subscriptionType} subscription
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="flex items-center text-3xl font-medium mb-6">
                    <FiUser className="mr-4 text-indigo-500 text-3xl" /> Customer Details
                  </h3>
                  <div className="space-y-4">
                    <p className="text-2xl"><strong className="text-gray-700">Name:</strong> {order.customerDetails?.name}</p>
                    <p className="text-2xl"><strong className="text-gray-700">Email:</strong> {order.customerDetails?.email}</p>
                    <p className="text-2xl"><strong className="text-gray-700">Mobile:</strong> {order.customerDetails?.mobile}</p>
                    <p className="text-2xl"><strong className="text-gray-700">Address:</strong> {order.customerDetails?.address}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="flex items-center text-3xl font-medium mb-6">
                    <FiTruck className="mr-4 text-indigo-500 text-3xl" /> Shipping Information
                  </h3>
                  <div className="space-y-4">
                    <p className="text-2xl">Shipping to the address provided in customer details.</p>
                    <p className="text-2xl">
                      Status: <span className={`font-semibold capitalize ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'processing' ? 'text-yellow-600' : 
                        'text-indigo-600'
                      }`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="flex items-center text-3xl font-medium mb-6">
                  <FiCreditCard className="mr-4 text-indigo-500 text-3xl" /> Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-xl"><strong className="text-gray-700">Payment ID:</strong> {order.paymentDetails?.paymentId || 'N/A'}</p>
                    <p className="text-2xl"><strong className="text-gray-700">Method:</strong> {order.paymentDetails?.paymentMethod || 'N/A'}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-2xl"><strong className="text-gray-700">Time:</strong> {order.paymentDetails?.paymentTime ? new Date(order.paymentDetails.paymentTime).toLocaleString() : 'N/A'}</p>
                    <p className="text-2xl"><strong className="text-gray-700">Bank Ref:</strong> {order.paymentDetails?.bankReference || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t">
                  <p className="font-bold text-4xl text-indigo-700">Total Amount: ₹{order.amount}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-10">
              {/* Quick Links */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="flex items-center text-3xl font-medium mb-6">
                  <FiLink className="mr-4 text-indigo-500 text-3xl" /> Quick Links
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-center">
                    <FiUser className="mr-4 text-gray-500 text-2xl" />
                    <span className="text-2xl">Gina, Kuhara-V0012</span>
                  </li>
                  <li className="flex items-center">
                    <FiMapPin className="mr-4 text-gray-500 text-2xl" />
                    <span className="text-2xl">West Bengal, India</span>
                  </li>
                  <li className="flex items-center">
                    <FiMail className="mr-4 text-gray-500 text-2xl" />
                    <span className="text-2xl">Subg@sentisan.com</span>
                  </li>
                </ul>
              </div>

              {/* Step Projects */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-3xl font-medium mb-6">Step Projects</h3>
                <ul className="space-y-4">
                  <li className="text-2xl">Live Aardons</li>
                  <li className="text-2xl">Seit Viet Chai</li>
                  <li className="text-2xl">About Us</li>
                  <li className="text-2xl">Ambassador Program</li>
                </ul>
              </div>

              {/* Categories */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-3xl font-medium mb-6">Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {['Headcards', 'Timbles', 'Pottery', 'Jewelry', 'Paintings'].map((category) => (
                    <span key={category} className="bg-white px-4 py-2 rounded-full text-xl shadow-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-medium mb-4">Stay Connected</h3>
                <p className="text-gray-600 mb-4 text-base">
                  Subscribe to our newsletter for the latest updates on new action products and exclusive offers.
                </p>
                <div className="flex items-center">
                  <a 
                    href="mailto:your-join@heartisans.com" 
                    className="text-indigo-600 hover:text-indigo-800 break-all text-base"
                  >
                    your-join@heartisans.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-10 py-8 flex justify-end space-x-6 border-t">
            <button className="px-8 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-2xl">
              Contact Seller
            </button>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-2xl">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;