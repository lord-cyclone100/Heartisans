import { useNavigate } from "react-router-dom";

export const ArtisanPlanModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubscription = () => {
    // Navigate to checkout for subscription payment
    navigate('/checkout', {
      state: {
        total: 1000,
        sellerId: null, // No seller for subscription payments
        sellerName: 'Heartisans Platform',
        isSubscription: true,
        productDetails: {
          id: 'artisan-subscription',
          name: 'Artisan Plan Subscription',
          price: 1000,
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
        
        <div className="text-center">
          {user.hasArtisanSubscription ? (
            <div className="mb-4">
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
                <span className="text-2xl font-bold text-green-600">Rs 1000 per year</span>
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  className="btn btn-success text-white"
                  onClick={handleSubscription}
                >
                  Take Subscription
                </button>
                <button 
                  className="btn btn-secondary"
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
