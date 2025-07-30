// PaymentSuccess.jsx
import { useState, useEffect, useRef, useCallback } from 'react'; // Add useCallback
import { useSearchParams } from 'react-router-dom';
import axios from 'axios'; // You were using fetch, but axios is also imported. Stick to one for consistency or use whichever you prefer. I'll use fetch as per your original code.

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasVerifiedRef = useRef(false); // Changed to useRef for consistent access without re-renders

    const orderId = searchParams.get('order_id');

    // useCallback to memoize the verification function
    const verifyPayment = useCallback(async () => {
        if (hasVerifiedRef.current) return; // Prevent multiple calls
        hasVerifiedRef.current = true; // Set flag to true

        try {
            console.time('PaymentVerification');
            const response = await fetch('http://localhost:5000/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.timeEnd('PaymentVerification');

            if (data.success) {
                setOrder(data.order);
                setError(''); // Clear any previous errors
            } else {
                setError(data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.timeEnd('PaymentVerification');
            console.error('Verification error details:', {
                error: error.message,
                orderId,
                time: new Date().toISOString()
            });
            setError(error.message || 'Failed to verify payment');
        } finally {
            setLoading(false);
        }
    }, [orderId]); // orderId is a dependency

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError('Order ID not found in URL.');
            return;
        }

        // Initial verification attempt
        verifyPayment();

        // Polling for status updates
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/payment/status?orderId=${orderId}`); // Ensure correct URL
                const data = await response.json();

                if (data.success && data.status === 'paid') { // Assuming your backend returns 'paid'
                    clearInterval(pollInterval);
                    setOrder(prevOrder => ({ ...prevOrder, status: 'paid' })); // Update status in state
                    setLoading(false); // Stop loading once paid
                    setError(''); // Clear any errors
                } else if (!data.success) {
                    console.warn('Polling indicated an issue:', data.message);
                    // Optionally set an error if polling explicitly fails
                    // setError(data.message || 'Payment still pending or an issue occurred.');
                }
            } catch (error) {
                console.error('Polling error:', error);
                // You might want to handle persistent polling errors differently,
                // perhaps stopping polling after N retries or notifying the user.
                // For now, it will just keep trying.
                // setError('Failed to retrieve payment status during polling.');
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(pollInterval); // Cleanup on component unmount
    }, [orderId, verifyPayment]); // Add verifyPayment to dependency array

    // ... rest of your component (return JSX)
    // ... (The JSX part remains largely the same)
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.log(error);
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

                    {order && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold mb-2">Order Details:</h3>
                            <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                            <p className="text-sm text-gray-600">Product: {order.productDetails?.productName}</p>
                            <p className="text-sm text-gray-600">Amount: Rs {order.amount}</p>
                            <p className="text-sm text-gray-600">Status: {order.status}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            Go to Home
                        </button>
                        <p className="text-xs text-gray-400">
                            You will receive a confirmation email shortly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};