import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SAPAnalyticsDashboard from '../components/elements/SAPAnalyticsDashboard';
import { useTranslation } from 'react-i18next';

const SAPAnalyticsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-xl font-semibold text-gray-600">
          {t('common.loading') || 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-[10vh]"></div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('sap.title') || 'SAP Analytics Cloud'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              {t('sap.subtitle') || 'Enterprise-Grade Business Intelligence & Analytics'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {t('sap.marketIntelligence') || 'Market Intelligence'}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  {t('sap.pricingAnalytics') || 'Pricing Analytics'}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  {t('sap.customerInsights') || 'Customer Insights'}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  {t('sap.demandForecasting') || 'Demand Forecasting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Selection */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              📊 {t('sap.selectProduct') || 'Select Product for Analytics'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  onClick={() => setSelectedProduct(product)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                    selectedProduct?._id === product._id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 text-xs">{product.productCategory}</p>
                  <p className="text-blue-600 font-bold text-sm">₹{product.productPrice}</p>
                </div>
              ))}
            </div>
            
            {/* Demo Product Option */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                🚀 {t('sap.tryDemo') || 'Or Try Demo Analytics'}
              </h3>
              <div
                onClick={() => setSelectedProduct(demoProduct)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 inline-block ${
                  selectedProduct === demoProduct
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🎨</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{demoProduct.name}</h4>
                    <p className="text-gray-600 text-sm">{demoProduct.category} • ₹{demoProduct.basePrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Products Fallback */}
        {products.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🚀 {t('sap.experienceTitle') || 'Experience SAP Analytics Cloud'}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('sap.noProductsMessage') || 'No products found in the database. Try our demo analytics to see the full capabilities.'}
            </p>
            <button
              onClick={() => setSelectedProduct(demoProduct)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              {t('sap.launchDemo') || 'Launch Demo Analytics'}
            </button>
          </div>
        )}

        {/* SAP Analytics Dashboard */}
        {selectedProduct && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t('sap.analyticsDashboard') || 'Analytics Dashboard'}: {selectedProduct.productName || selectedProduct.name}
                  </h3>
                  <p className="text-gray-600">
                    Category: {selectedProduct.productCategory || selectedProduct.category} • 
                    Price: ₹{selectedProduct.productPrice || selectedProduct.basePrice}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{t('sap.integrationActive') || 'SAP Integration Active'}</span>
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
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🌟 {t('sap.integrationCapabilities') || 'SAP Integration Capabilities'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 text-xl">🔍</span>
              </div>
              <h4 className="font-semibold text-sm">{t('sap.marketIntelligence') || 'Market Intelligence'}</h4>
              <p className="text-xs text-gray-600">{t('sap.marketAnalysis') || 'Real-time market analysis'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <h4 className="font-semibold text-sm">{t('sap.pricingAnalytics') || 'Pricing Analytics'}</h4>
              <p className="text-xs text-gray-600">{t('sap.pricingStrategies') || 'Optimal pricing strategies'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
              <h4 className="font-semibold text-sm">{t('sap.customerInsights') || 'Customer Insights'}</h4>
              <p className="text-xs text-gray-600">{t('sap.behavioralSegmentation') || 'Behavioral segmentation'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 text-xl">🔮</span>
              </div>
              <h4 className="font-semibold text-sm">{t('sap.demandForecasting') || 'Demand Forecasting'}</h4>
              <p className="text-xs text-gray-600">{t('sap.predictiveAnalytics') || 'Predictive analytics'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAPAnalyticsPage;
