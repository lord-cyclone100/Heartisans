import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const SubscriptionSuccess = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasVerified = useRef(false); // Flag to prevent double execution

  const orderId = searchParams.get('order_id');

  useScrollToTop();

  useEffect(() => {
    if (orderId && !hasVerified.current) {
      hasVerified.current = true; // Set flag before calling
      verifySubscriptionPayment();
    } else if (!orderId) {
      setError('No order ID found');
      setLoading(false);
    }
  }, [orderId]);

  const verifySubscriptionPayment = async () => {
    try {
      console.log('Verifying subscription payment for order:', orderId);
      
      const response = await fetch('http://localhost:5000/subscription/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || t('subscription.error'));
      }
    } catch (error) {
      console.error('Subscription payment verification error:', error);
      setError(t('subscription.error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('payment.verifyingSubscription')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('subscription.error')}</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {t('subscription.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('subscription.activated')}</h2>
          <p className="text-gray-600 mb-6">{t('subscription.welcomeArtisan')}</p>

          {order && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2 text-purple-800">{t('subscription.details')}</h3>
              <p className="text-sm text-gray-600">{t('subscription.orderId', { id: order.orderId })}</p>
              <p className="text-sm text-gray-600">{t('subscription.plan', { plan: order.productDetails?.productName })}</p>
              <p className="text-sm text-gray-600">{t('subscription.amount', { amount: order.amount })}</p>
              <p className="text-sm text-gray-600">{t('subscription.status', { status: order.status })}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">{t('subscription.benefitsUnlocked')}</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>{t('subscription.enhancedSelling')}</li>
              <li>{t('subscription.prioritySupport')}</li>
              <li>{t('subscription.advancedAnalytics')}</li>
              <li>{t('subscription.exclusiveBadges')}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {t('subscription.startExploring')}
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {t('subscription.goToDashboard')}
            </button>
            <p className="text-xs text-gray-400">
              {t('subscription.confirmationEmail')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
