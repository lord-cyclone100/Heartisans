import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaWallet, FaUser, FaEnvelope, FaRupeeSign } from "react-icons/fa"; // Import icons
import { useScrollToTop } from "../hooks/useScrollToTop";

export const WalletPage = () => {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors

  useScrollToTop();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch(`https://heartisans-1.onrender.com/api/user/wallet/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch wallet data.');
        }
        const data = await res.json();
        setWallet(data);
      } catch (err) {
        setError(err.message);
        setWallet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="w-full h-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#479626', borderTopColor: 'transparent' }}></div>
            <span className="ml-3 text-xl text-gray-600">Loading wallet...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="w-full h-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4">
              My Wallet
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto">
              Manage your earnings, track transactions, and monitor your artisan business finances.
            </p>
          </div>

          {wallet ? (
            <div className="space-y-8">
              {/* Wallet Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="md:col-span-2 rounded-2xl shadow-xl p-8 text-white" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-medium opacity-90">Total Balance</h2>
                      <p className="text-4xl sm:text-5xl lg:text-6xl font-bold">₹ {wallet.balance.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6" style={{ border: '1px solid #479626' }}>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <button className="w-full text-white py-3 px-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: '#ffaf27' }}>
                      Withdraw Funds
                    </button>
                    <button className="w-full py-3 px-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300" style={{ backgroundColor: '#ffaf27', color: '#ffffff' }}>
                      Add Bank Account
                    </button>
                    <button className="w-full py-3 px-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300" style={{ backgroundColor: '#ffaf27', color: '#ffffff' }}>
                      Download Statement
                    </button>
                  </div>
                </div>
              </div>

              {/* User Info Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #479626' }}>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-3" style={{ backgroundColor: '#e8f5e8' }}>
                        <svg className="w-6 h-6" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg text-gray-500">Account Holder</p>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900">{wallet.userName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-3" style={{ backgroundColor: '#e8f5e8' }}>
                        <svg className="w-6 h-6" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg text-gray-500">Email Address</p>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900">{wallet.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-3" style={{ backgroundColor: '#e8f5e8' }}>
                        <svg className="w-6 h-6" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg text-gray-500">Account Status</p>
                        <p className="text-lg sm:text-xl font-semibold" style={{ color: '#479626' }}>Verified</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full p-3" style={{ backgroundColor: '#e8f5e8' }}>
                        <svg className="w-6 h-6" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg text-gray-500">Wallet ID</p>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900">{id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Wallet Found */
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center" style={{ border: '2px solid #dc2626' }}>
              <div className="rounded-full p-6 w-24 h-24 mx-auto mb-6" style={{ backgroundColor: '#fee2e2' }}>
                <svg className="w-12 h-12 mx-auto" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Wallet Not Found</h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                We couldn't find a wallet associated with this ID. Please check your link or contact support.
              </p>
              <button className="text-white py-3 px-8 rounded-xl font-semibold text-lg transition-all duration-300" style={{ backgroundColor: '#ffaf27' }}>
                Contact Support
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};