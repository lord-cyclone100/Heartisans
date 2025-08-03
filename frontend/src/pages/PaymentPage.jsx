import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { load } from "@cashfreepayments/cashfree-js";
import { useScrollToTop } from '../hooks/useScrollToTop';

export const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { orderId, paymentSessionId } = location.state || {};
  useScrollToTop();

  useEffect(() => {
    if (!orderId || !paymentSessionId) {
      setError('Missing payment information');
      return;
    }

    initializePayment();
  }, [orderId, paymentSessionId]);

  const initializePayment = async () => {
    try {
      const cashfree = await load({ mode: "sandbox" });
      
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      };

      await cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initialize payment');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#fee2e2' }}>
              <svg className="w-8 h-8" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payments Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#ffaf27' }}
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#479626' }}></div>
        <p className="text-gray-600">Initializing payment gatesway...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we redirect you to the payment page</p>
      </div>
    </div>
  );
}
