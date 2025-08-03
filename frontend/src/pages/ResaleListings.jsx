import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ResaleListings = () => {
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
      const token = localStorage.getItem('token');
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>
        <span className="mr-1">{info.icon}</span>
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
              <p className="text-gray-600">Loading resale listings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="w-full h-[10vh]"></div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Resale Marketplace
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover pre-loved handcrafted treasures at amazing prices
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter & Sort</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>{condition.title}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="₹ Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="₹ Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {listings.length} of {pagination.totalItems} listings
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later for new items</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                  
                  {/* Condition Badge */}
                  <div className="absolute top-3 left-3">
                    {getConditionBadge(listing.condition)}
                  </div>

                  {/* Discount Badge */}
                  {listing.originalPrice && listing.currentPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(((listing.originalPrice - listing.currentPrice) / listing.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {listing.productName}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{listing.category}</p>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {listing.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(listing.currentPrice)}
                      </span>
                      {listing.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(listing.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>By {listing.sellerName}</span>
                    <span>{listing.views} views</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleInterest(listing._id)}
                    className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-orange-600 transition-all duration-300"
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      page === pagination.currentPage
                        ? 'bg-green-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResaleListings;
