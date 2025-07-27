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
    const planName = selectedPlan === 'yearly' ? 'Artisan Plan - Yearly' : 'Artisan Plan - Monthly';
    
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
          image: null,
          category: 'Subscription'
        }
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Artisan Plan</h2>
          <p className="text-gray-600">Boost your sales with premium features</p>
        </div>
        
        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-4 text-xl">� Boost Your Sales</h3>
            <ul className="text-blue-700 space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>List unlimited products with premium visibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority placement in search results</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Featured product highlights on homepage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced analytics and sales insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Custom shop page with branding options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Social media promotion tools</span>
              </li>
            </ul>
          </div>
        </div>

        {user.hasArtisanSubscription && (
          <div className="mb-6">
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <span className="text-lg font-bold text-green-700">You are subscribed!</span>
              <p className="text-green-600 mt-2">
                Enjoy all premium features of the Artisan Plan.
              </p>
              {user.subscriptionDate && (
                <p className="text-sm text-green-500 mt-1">
                  Subscribed on: {new Date(user.subscriptionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {!user.hasArtisanSubscription && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Your Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Yearly Plan */}
              <div 
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'yearly' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                {planDetails.yearly.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
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
                    className="mb-2"
                  />
                  <h5 className="font-bold text-lg">Yearly Plan</h5>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    Rs {planDetails.yearly.price}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {planDetails.yearly.duration}
                  </div>
                  {planDetails.yearly.savings && (
                    <div className="text-sm text-green-600 font-medium">
                      {planDetails.yearly.savings}
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Plan */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'monthly' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
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
                    className="mb-2"
                  />
                  <h5 className="font-bold text-lg">Monthly Plan</h5>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    Rs {planDetails.monthly.price}
                  </div>
                  <div className="text-sm text-gray-600">
                    {planDetails.monthly.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          {user.hasArtisanSubscription ? (
            <div className="mb-4">
              <button 
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    Rs {planDetails[selectedPlan].price} {planDetails[selectedPlan].duration}
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="text-sm text-gray-600 mt-1">
                      Only Rs {Math.round(planDetails.yearly.price / 12)} per month
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  className="btn btn-success text-white px-6 py-2"
                  onClick={handleSubscription}
                >
                  Subscribe to {selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan
                </button>
                <button 
                  className="btn btn-secondary px-6 py-2"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
