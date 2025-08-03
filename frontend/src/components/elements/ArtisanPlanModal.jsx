import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ArtisanPlanModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('yearly'); // 'yearly' or 'monthly'

  if (!isOpen) return null;

  const planDetails = {
    yearly: {
      price: 2000,
      duration: 'per year',
      savings: 'Save Rs 400',
      popular: true
    },
    monthly: {
      price: 200,
      duration: 'per month',
      savings: null,
      popular: false
    }
  };

  const handleSubscription = () => {
    const plan = planDetails[selectedPlan];
    const planName = selectedPlan === 'yearly' ? 'Artisanship Plan - Yearly' : 'Artisanship Plan - Monthly';
    
    // Navigate to checkout for subscription payment
    navigate('/checkout', {
      state: {
        total: plan.price,
        sellerId: null, // No seller for subscription payments
        sellerName: 'Heartisans Platform',
        isSubscription: true,
        subscriptionPlan: selectedPlan, // Add plan type
        productDetails: {
          id: `artisan-subscription-${selectedPlan}`,
          name: planName,
          price: plan.price,
          image: 'https://res.cloudinary.com/dmljao4pk/image/upload/v1754263328/Artisanship_plan_logo_awk7xn.png',
          category: 'Subscription'
        }
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4 font-mhlk">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold mb-2">Artisanship Plan</h2>
          <p className="text-green-100 text-lg">Boost your sales with premium features</p>
        </div>
        
        <div className="p-6">
          {/* Features Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 rounded-lg">
              <h3 className="font-bold text-green-800 mb-5 text-xl flex items-center">
                <span className="bg-green-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 text-sm">✨</span>
                Boost Your Sales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">List unlimited products with premium visibility</span>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">Priority placement in search results</span>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">Featured product highlights on homepage</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">Advanced analytics and sales insights</span>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">Custom shop page with branding options</span>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">✓</span>
                    <span className="text-gray-700 text-sm">Social media promotion tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          {user.hasArtisanSubscription && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3">✓</span>
                  <span className="text-xl font-bold text-green-700">You are subscribed!</span>
                </div>
                <p className="text-green-600 mb-2">
                  Enjoy all premium features of the Artisanship Plan.
                </p>
                {user.subscriptionDate && (
                  <p className="text-green-500 font-medium text-sm">
                    Subscribed on: {new Date(user.subscriptionDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Plan Selection */}
          {!user.hasArtisanSubscription && (
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-5 text-center">Choose Your Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Yearly Plan */}
                <div 
                  className={`relative p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedPlan === 'yearly' 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-green-300 hover:shadow-sm bg-white'
                  }`}
                  onClick={() => setSelectedPlan('yearly')}
                >
                  {planDetails.yearly.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <input
                      type="radio"
                      name="plan"
                      value="yearly"
                      checked={selectedPlan === 'yearly'}
                      onChange={() => setSelectedPlan('yearly')}
                      className="mb-3 w-4 h-4 text-green-600"
                    />
                    <h5 className="font-bold text-lg text-gray-800 mb-2">Yearly Plan</h5>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      Rs {planDetails.yearly.price}
                    </div>
                    <div className="text-gray-600 mb-2 text-sm">
                      {planDetails.yearly.duration}
                    </div>
                    {planDetails.yearly.savings && (
                      <div className="inline-block bg-green-100 text-green-700 font-medium px-2 py-1 rounded text-xs">
                        {planDetails.yearly.savings}
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Plan */}
                <div 
                  className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedPlan === 'monthly' 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
                      : 'border-gray-200 hover:border-green-300 hover:shadow-sm bg-white'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="text-center">
                    <input
                      type="radio"
                      name="plan"
                      value="monthly"
                      checked={selectedPlan === 'monthly'}
                      onChange={() => setSelectedPlan('monthly')}
                      className="mb-3 w-4 h-4 text-green-600"
                    />
                    <h5 className="font-bold text-lg text-gray-800 mb-2">Monthly Plan</h5>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      Rs {planDetails.monthly.price}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {planDetails.monthly.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="text-center border-t border-gray-100 pt-6">
            {user.hasArtisanSubscription ? (
              <button 
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-5">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      Rs {planDetails[selectedPlan].price} {planDetails[selectedPlan].duration}
                    </div>
                    {selectedPlan === 'yearly' && (
                      <div className="text-gray-600 text-sm">
                        Only Rs {Math.round(planDetails.yearly.price / 12)} per month
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    onClick={handleSubscription}
                  >
                    Subscribe to {selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan
                  </button>
                  <button 
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};