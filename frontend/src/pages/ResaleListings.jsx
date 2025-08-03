import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ResaleListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'listedAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useScrollToTop();

  const categories = [
    'Art', 'Pottery', 'Fashion', 'Crafts', 'Crochet', 'Accessories',
    'Jewelry', 'Textiles', 'Woodwork', 'Metalwork', 'Paintings', 'Sculptures'
  ];

  const conditions = [
    { id: 'with-tag', title: 'With Tag - Just Like New' },
    { id: 'without-tag', title: 'Without Tag - Good to Fair' },
    { id: 'lesser-quality', title: 'Lesser Quality' }
  ];

  const sortOptions = [
    { value: 'listedAt:desc', label: 'Newest First' },
    { value: 'listedAt:asc', label: 'Oldest First' },
    { value: 'currentPrice:asc', label: 'Price: Low to High' },
    { value: 'currentPrice:desc', label: 'Price: High to Low' },
    { value: 'views:desc', label: 'Most Viewed' }
  ];

  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      const [sortBy, sortOrder] = filters.sortBy.includes(':') 
        ? filters.sortBy.split(':') 
        : [filters.sortBy, filters.sortOrder];

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy,
        sortOrder,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.condition !== 'all' && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice })
      });

      const response = await axios.get(`http://localhost:5000/api/resale?${params}`);
      
      if (response.data.success) {
        setListings(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        throw new Error(response.data.error || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Fetch listings error:', error);
      setError('Failed to load resale listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  const handlePageChange = (page) => {
    fetchListings(page);
  };

  const handleInterest = async (listingId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to express interest');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/resale/${listingId}/interest`,
        { message: 'I am interested in this item' },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Interest expressed successfully! The seller will be notified.');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Express interest error:', error);
      alert(error.response?.data?.error || 'Failed to express interest');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getConditionBadge = (condition) => {
    const conditionInfo = {
      'with-tag': { color: 'bg-green-100 text-green-800', icon: '🏷️' },
      'without-tag': { color: 'bg-orange-100 text-orange-800', icon: '✨' },
      'lesser-quality': { color: 'bg-blue-100 text-blue-800', icon: '🔄' }
    };
    
    const info = conditionInfo[condition] || conditionInfo['with-tag'];
    const conditionTitle = conditions.find(c => c.id === condition)?.title || condition;
    
    return (
      <span className={`inline-flex items-center px-3 py-2 rounded-full text-base font-semibold ${info.color}`}>
        <span className="mr-2">{info.icon}</span>
        {conditionTitle}
      </span>
    );
  };

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="w-full h-[10vh]"></div>
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading resale listings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
      <div className="w-full h-[10vh]"></div>
      
      {/* Hero Section */}
      <div className="text-center py-8 md:py-12 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 font-mhlk" style={{ color: '#479626' }}>
          Resale Marketplace
        </h1>
        <p className="text-lg md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: '#479626' }}>
          Discover pre-loved handcrafted treasures at amazing prices
        </p>
        
        {/* Create Listing Button */}
        <button
          onClick={() => navigate('/resale')}
          className="inline-flex items-center px-8 py-4 text-white font-bold text-lg rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg font-mhlk"
          style={{ backgroundColor: '#479626' }}
        >
          <span className="mr-2">✨</span>
          Create Your Listing
        </button>
      </div>

      {/* Content Container */}
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-mhlk" style={{ color: '#479626' }}>
              Filter & Sort
            </h2>
            <p className="text-xl md:text-2xl" style={{ color: '#479626' }}>
              Find the perfect handcrafted item for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-lg font-bold mb-3 font-mhlk" style={{ color: '#479626' }}>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md transition-colors"
                style={{
                  focusRingColor: '#479626',
                  focusBorderColor: '#479626'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-lg font-bold mb-3 font-mhlk" style={{ color: '#479626' }}>Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md transition-colors"
                style={{
                  focusRingColor: '#479626',
                  focusBorderColor: '#479626'
                }}
              >
                <option value="all">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>{condition.title}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-lg font-bold mb-3 font-mhlk" style={{ color: '#479626' }}>Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="₹ Min"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md transition-colors"
                style={{
                  focusRingColor: '#479626',
                  focusBorderColor: '#479626'
                }}
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-3 font-mhlk" style={{ color: '#479626' }}>Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="₹ Max"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md transition-colors"
                style={{
                  focusRingColor: '#479626',
                  focusBorderColor: '#479626'
                }}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-lg font-bold mb-3 font-mhlk" style={{ color: '#479626' }}>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md transition-colors"
                style={{
                  focusRingColor: '#479626',
                  focusBorderColor: '#479626'
                }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-lg font-bold font-mhlk" style={{ color: '#479626' }}>
            Showing {listings.length} of {pagination.totalItems} listings
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-6xl mx-auto">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#479626' }}></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mx-auto max-w-2xl">
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4 font-mhlk">No listings found</h3>
              <p className="text-xl text-gray-500 font-mhlk">Try adjusting your filters or check back later for new items</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-opacity-30" style={{ boxShadow: '0 10px 25px rgba(71, 150, 38, 0.1)' }}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'rgba(71, 150, 38, 0.1)' }}>
                      <span className="text-6xl" style={{ color: '#479626' }}>📷</span>
                    </div>
                  )}
                  
                  {/* Condition Badge */}
                  <div className="absolute top-3 left-3">
                    {getConditionBadge(listing.condition)}
                  </div>

                  {/* Discount Badge */}
                  {listing.originalPrice && listing.currentPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-2 rounded-full text-base font-bold">
                      {Math.round(((listing.originalPrice - listing.currentPrice) / listing.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 font-mhlk group-hover:text-opacity-80 transition-colors">
                      {listing.productName}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 mb-3 font-mhlk">{listing.category}</p>
                  
                  <p className="text-base text-gray-500 line-clamp-2 mb-4 font-mhlk">
                    {listing.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-mhlk" style={{ color: '#479626' }}>
                        {formatPrice(listing.currentPrice)}
                      </span>
                      {listing.originalPrice && (
                        <span className="text-lg text-gray-400 line-through font-mhlk">
                          {formatPrice(listing.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between text-base text-gray-500 mb-4 font-mhlk">
                    <span>By {listing.sellerName}</span>
                    <span>{listing.views} views</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleInterest(listing._id)}
                    className="w-full text-white py-4 px-4 rounded-full font-bold text-lg font-mhlk hover:opacity-90 transition-all duration-300"
                    style={{ backgroundColor: '#479626' }}
                  >
                    Express Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-8 py-4 text-lg font-bold font-mhlk text-gray-600 bg-white border-2 border-gray-200 rounded-full hover:border-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                style={{ '--hover-border-color': '#479626' }}
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-5 py-4 text-lg font-bold font-mhlk rounded-full transition-all duration-300 ${
                      page === pagination.currentPage
                        ? 'text-white'
                        : 'text-gray-600 bg-white border-2 border-gray-200 hover:border-opacity-50'
                    }`}
                    style={page === pagination.currentPage ? { backgroundColor: '#479626' } : { '--hover-border-color': '#479626' }}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-8 py-4 text-lg font-bold font-mhlk text-gray-600 bg-white border-2 border-gray-200 rounded-full hover:border-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                style={{ '--hover-border-color': '#479626' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResaleListings;
