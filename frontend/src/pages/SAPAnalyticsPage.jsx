import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SAPAnalyticsDashboard from '../components/elements/SAPAnalyticsDashboard';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const SAPAnalyticsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    // Fetch all products
    axios.get("http://localhost:5000/api/shopcards")
      .then(res => {
        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProduct(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  // Demo product for testing
  const demoProduct = {
    name: t('sap.demoProductName') || 'Traditional Rajasthani Handicraft',
    category: t('sap.demoProductCategory') || 'Handicrafts',
    material: 'Wood and Metal',
    region: 'Rajasthan',
    basePrice: 1500,
    seller: t('sap.demoArtisan') || 'Demo Artisan',
    weight: '2kg',
    color: 'Multi-color'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0, #e8f5e8)' }}>
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent" style={{ borderColor: '#479626', borderTopColor: 'transparent' }}></div>
        <div className="ml-6 text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-700">
          {t('common.loading') || 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0, #e8f5e8)' }}>
      <div className="w-full h-20"></div>
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12  font-mhlk">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t('sap.title') || 'SAP Analytics Cloud'}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('sap.subtitle') || 'Enterprise-Grade Business Intelligence & Analytics for Artisan Marketplaces'}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl" style={{ border: '1px solid #479626' }}>
              <span className="flex items-center text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
                <div className="w-4 h-4 rounded-full mr-4 animate-pulse" style={{ backgroundColor: '#479626' }}></div>
                {t('sap.marketIntelligence') || 'Market Intelligence'}
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl" style={{ border: '1px solid #479626' }}>
              <span className="flex items-center text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
                <div className="w-4 h-4 rounded-full mr-4 animate-pulse" style={{ backgroundColor: '#479626' }}></div>
                {t('sap.pricingAnalytics') || 'Pricing Analytics'}
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl" style={{ border: '1px solid #479626' }}>
              <span className="flex items-center text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
                <div className="w-4 h-4 rounded-full mr-4 animate-pulse" style={{ backgroundColor: '#479626' }}></div>
                {t('sap.customerInsights') || 'Customer Insights'}
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-xl" style={{ border: '1px solid #479626' }}>
              <span className="flex items-center text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
                <div className="w-4 h-4 rounded-full mr-4 animate-pulse" style={{ backgroundColor: '#479626' }}></div>
                {t('sap.demandForecasting') || 'Demand Forecasting'}
              </span>
            </div>
          </div>
        </div>
        {/* Product Selection */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-12" style={{ border: '1px solid #479626' }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-12 text-gray-900">
              📊 {t('sap.selectProduct') || 'Select Product for Analytics'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    selectedProduct?._id === product._id
                      ? 'shadow-2xl'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  style={selectedProduct?._id === product._id 
                    ? { borderColor: '#479626', background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }
                    : { borderColor: '#d1d5db' }
                  }
                >
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="w-full h-40 object-cover rounded-2xl mb-6"
                  />
                  <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-3 leading-tight">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-3">{product.productCategory}</p>
                  <p className="font-bold text-lg sm:text-xl lg:text-2xl" style={{ color: '#479626' }}>₹{product.productPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            {/* Demo Product Option */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-gray-900">
                🚀 {t('sap.tryDemo') || 'Or Try Demo Analytics'}
              </h3>
              <div
                onClick={() => setSelectedProduct(demoProduct)}
                className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 inline-block ${
                  selectedProduct === demoProduct
                    ? 'shadow-2xl'
                    : 'border-gray-300 hover:shadow-xl'
                }`}
                style={selectedProduct === demoProduct 
                  ? { borderColor: '#479626', background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }
                  : { borderColor: '#d1d5db' }
                }
              >
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
                    <span className="text-white font-bold text-3xl">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900">{demoProduct.name}</h4>
                    <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl">{demoProduct.category} • ₹{demoProduct.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Products Fallback */}
        {products.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-16 mb-12 text-center" style={{ border: '1px solid #479626' }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 text-gray-900">
              🚀 {t('sap.experienceTitle') || 'Experience SAP Analytics Cloud'}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('sap.noProductsMessage') || 'No products found in the database. Try our demo analytics to see the full capabilities.'}
            </p>
            <button
              onClick={() => setSelectedProduct(demoProduct)}
              className="text-white px-12 py-6 rounded-2xl font-bold text-lg sm:text-xl lg:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              style={{ backgroundColor: '#ffaf27' }}
            >
              {t('sap.launchDemo') || 'Launch Demo Analytics'}
            </button>
          </div>
        )}

        {/* SAP Analytics Dashboard */}
        {selectedProduct && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 mb-12">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-12 border-b border-green-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                    {t('sap.analyticsDashboard') || 'Analytics Dashboard'}: {selectedProduct.productName || selectedProduct.name}
                  </h3>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-700">
                    Category: {selectedProduct.productCategory || selectedProduct.category} • 
                    Price: ₹{(selectedProduct.productPrice || selectedProduct.basePrice).toLocaleString()}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <div className="flex items-center space-x-4 bg-white/90 rounded-2xl px-6 py-4 border border-green-200 shadow-lg">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">{t('sap.integrationActive') || 'SAP Integration Active'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <SAPAnalyticsDashboard
              productData={{
                name: selectedProduct.productName || selectedProduct.name,
                category: selectedProduct.productCategory || selectedProduct.category,
                material: selectedProduct.productMaterial || selectedProduct.material,
                region: selectedProduct.productState || selectedProduct.region,
                basePrice: selectedProduct.productPrice || selectedProduct.basePrice,
                seller: selectedProduct.productSellerName || selectedProduct.seller,
                weight: selectedProduct.productWeight || selectedProduct.weight,
                color: selectedProduct.productColor || selectedProduct.color
              }}
            />
          </div>
        )}

        {/* SAP Integration Info */}
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-12 text-center">
            🌟 {t('sap.integrationCapabilities') || 'SAP Integration Capabilities'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🔍</span>
              </div>
              <h4 className="font-bold text-lg sm:text-xl lg:text-2xl mb-4 text-gray-900">{t('sap.marketIntelligence') || 'Market Intelligence'}</h4>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">{t('sap.marketAnalysis') || 'Real-time market analysis'}</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">💰</span>
              </div>
              <h4 className="font-bold text-lg sm:text-xl lg:text-2xl mb-4 text-gray-900">{t('sap.pricingAnalytics') || 'Pricing Analytics'}</h4>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">{t('sap.pricingStrategies') || 'Optimal pricing strategies'}</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">👥</span>
              </div>
              <h4 className="font-bold text-lg sm:text-xl lg:text-2xl mb-4 text-gray-900">{t('sap.customerInsights') || 'Customer Insights'}</h4>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">{t('sap.behavioralSegmentation') || 'Behavioral segmentation'}</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🔮</span>
              </div>
              <h4 className="font-bold text-lg sm:text-xl lg:text-2xl mb-4 text-gray-900">{t('sap.demandForecasting') || 'Demand Forecasting'}</h4>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">{t('sap.predictiveAnalytics') || 'Predictive analytics'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


