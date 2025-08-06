import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/AuthContext";
import axios from "axios";
import { useScrollToTop } from "../hooks/useScrollToTop";

export const ResaleProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user } = useUser();

  useScrollToTop();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://heartisans-1.onrender.com/api/resale/${id}`);
        
        if (response.data.success) {
          setListing(response.data.data);
          setError(null);
        } else {
          throw new Error(response.data.error || 'Failed to fetch listing');
        }
      } catch (error) {
        console.error('Fetch listing error:', error);
        setError('Failed to load listing details');
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getConditionInfo = (condition) => {
    const conditionData = {
      'with-tag': { 
        title: 'With Tag - Just Like New', 
        description: 'Original tags intact, pristine condition, no wear signs',
        color: 'bg-green-100 text-green-800', 
        icon: '🏷️' 
      },
      'without-tag': { 
        title: 'Without Tag - Good to Fair', 
        description: 'Excellent condition, minimal wear, well maintained',
        color: 'bg-orange-100 text-orange-800', 
        icon: '✨' 
      },
      'lesser-quality': { 
        title: 'Lesser Quality', 
        description: 'Visible wear, some flaws, but still functional and beautiful',
        color: 'bg-blue-100 text-blue-800', 
        icon: '🔄' 
      }
    };
    
    return conditionData[condition] || conditionData['with-tag'];
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to purchase this item');
        navigate('/login');
        return;
      }

      // Check if user is the seller
      if (user && listing && user._id === listing.seller._id) {
        alert('You cannot buy your own listing');
        return;
      }

      // Prepare product details for checkout (matching payment controller format)
      const productDetails = {
        id: listing._id,
        name: listing.productName,
        price: listing.currentPrice,
        image: listing.images && listing.images.length > 0 ? listing.images[0].url : '',
        category: listing.category,
        description: listing.description,
        quantity: 1,
        productType: 'resale' // To distinguish from regular shop products
      };

      // Navigate to checkout form with resale product details
      navigate('/checkout', {
        state: {
          total: listing.currentPrice,
          sellerId: listing.seller._id,
          sellerName: listing.sellerName,
          productDetails: productDetails,
          isSubscription: false,
          directBuy: true
        }
      });

    } catch (error) {
      console.error('Checkout navigation error:', error);
      alert('Failed to proceed to checkout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#479626', borderTopColor: 'transparent' }}></div>
          <p className="text-2xl font-semibold" style={{ color: '#479626' }}>Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">{error || 'This listing may have been removed or sold.'}</p>
          <button
            onClick={() => navigate('/resale-listings')}
            className="px-8 py-4 text-white font-bold text-lg rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg font-mhlk"
            style={{ backgroundColor: '#479626' }}
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const conditionInfo = getConditionInfo(listing.condition);
  const isUserSeller = user && listing.seller && user._id === listing.seller._id;

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
        <div className="w-full h-20"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Product Images */}
            <div className="w-full">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-6">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    {/* Main Image */}
                    <img 
                      src={listing.images[selectedImageIndex]?.url || listing.images[0]?.url} 
                      alt={listing.productName} 
                      className="w-full h-96 lg:h-[600px] object-cover rounded-xl" 
                    />
                    
                    {/* Image Thumbnails */}
                    {listing.images.length > 1 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto">
                        {listing.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`${listing.productName} ${index + 1}`}
                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                              selectedImageIndex === index 
                                ? 'border-green-500 scale-105' 
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 lg:h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <span className="text-6xl" style={{ color: '#479626' }}>📷</span>
                  </div>
                )}
                
                {/* Condition Badge */}
                <div className="absolute top-8 left-8">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${conditionInfo.color}`}>
                    <span className="mr-2">{conditionInfo.icon}</span>
                    {conditionInfo.title}
                  </span>
                </div>

                {/* Discount Badge */}
                {listing.originalPrice && listing.currentPrice && (
                  <div className="absolute top-8 right-8">
                    <span className="text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg" style={{ background: 'linear-gradient(to right, #479626, #3d7a20)' }}>
                      {Math.round(((listing.originalPrice - listing.currentPrice) / listing.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Information */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #479626' }}>
                <div className="space-y-6">
                  
                  {/* Title and Description */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                      {listing.productName}
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 mt-4 leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>

                  {/* Condition Details */}
                  <div className={`p-6 rounded-xl ${conditionInfo.color.replace('text-', 'bg-').replace('-800', '-50')}`}>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{conditionInfo.icon}</span>
                      <h3 className="text-xl font-bold">{conditionInfo.title}</h3>
                    </div>
                    <p className="text-gray-700">{conditionInfo.description}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(to right, #479626, #3d7a20)' }}>
                    <p className="text-sm font-medium opacity-90">Price</p>
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        {formatPrice(listing.currentPrice)}
                      </h3>
                      {listing.originalPrice && (
                        <span className="text-xl line-through opacity-80">
                          {formatPrice(listing.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Seller</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {listing.sellerName || listing.seller?.fullName || listing.seller?.userName || 'Unknown Seller'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                      <p className="text-lg font-semibold text-gray-900">{listing.category}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Listed On</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(listing.listedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {listing.location?.city && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {listing.location.city}
                          {listing.location.state ? `, ${listing.location.state}` : ''}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Views</p>
                      <p className="text-lg font-semibold text-gray-900">{listing.views}</p>
                    </div>
                    
                    {listing.sellerContact && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">Contact</p>
                        <p className="text-lg font-semibold text-gray-900">{listing.sellerContact}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4">
                    <button 
                      className={`w-full py-4 px-8 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                        isUserSeller 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'text-white shadow-lg hover:shadow-xl'
                      }`}
                      style={!isUserSeller ? { backgroundColor: '#ffaf27' } : {}}
                      onClick={handleBuyNow}
                      disabled={isUserSeller}
                      title={isUserSeller ? 'You cannot buy your own listing' : 'Buy Now'}
                    >
                      {isUserSeller ? 'Your Listing' : 'Buy Now'}
                    </button>

                    {/* Back to Listings Button */}
                    <button
                      onClick={() => navigate('/resale-listings')}
                      className="w-full mt-4 py-3 px-8 rounded-xl text-lg font-bold border-2 transition-all duration-300 hover:bg-gray-50"
                      style={{ borderColor: '#479626', color: '#479626' }}
                    >
                      Back to All Listings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResaleProductDetails;