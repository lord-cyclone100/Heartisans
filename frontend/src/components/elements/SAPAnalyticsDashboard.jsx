import React, { useState } from 'react';
import axios from 'axios';

const SAPAnalyticsDashboard = ({ productData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to extract text from different data formats
  const extractText = (item) => {
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'object' && item !== null) {
      // Try to extract meaningful text from object
      if (item.insight) return item.insight;
      if (item.opportunity) return item.opportunity;
      if (item.text) return item.text;
      if (item.description) return item.description;
      if (item.name) return item.name;
      // Fallback to first string value found
      const values = Object.values(item);
      const firstString = values.find(v => typeof v === 'string');
      if (firstString) return firstString;
      // Last resort: stringify but clean it up
      return JSON.stringify(item).replace(/[{}\"]/g, '').replace(/[:,]/g, ': ');
    }
    return String(item);
  };

  const generateAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/sac/analytics-dashboard', productData);
      console.log('SAC Dashboard Response:', response.data);
      setAnalytics(response.data.dashboard);
    } catch (error) {
      console.error('Analytics generation failed:', error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const renderMarketIntelligence = () => {
    const marketData = analytics?.analytics?.market_intelligence;
    
    if (!marketData) {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            🔍 Market Intelligence
          </h3>
          <p className="text-gray-500">No market intelligence data available</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          🔍 Market Intelligence
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Market Size</h4>
              <p className="text-blue-600">{marketData.market_size || 'N/A'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Growth Rate</h4>
              <p className="text-blue-600">{marketData.growth_rate || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Competition Level</h4>
              <p className="text-blue-600">{marketData.competition_level || 'N/A'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Source</h4>
              <p className="text-blue-600 text-xs">{marketData.source || 'SAP Analytics Cloud'}</p>
            </div>
          </div>
          
          {marketData.key_insights && Array.isArray(marketData.key_insights) && marketData.key_insights.length > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Key Insights</h4>
              <ul className="space-y-1">
                {marketData.key_insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{extractText(insight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {marketData.opportunities && Array.isArray(marketData.opportunities) && marketData.opportunities.length > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Market Opportunities</h4>
              <ul className="space-y-1">
                {marketData.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{extractText(opportunity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPricingAnalytics = () => {
    const pricingData = analytics?.analytics?.pricing_trends;
    
    if (!pricingData) {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            💰 Pricing Analytics
          </h3>
          <p className="text-gray-500">No pricing analytics data available</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          💰 Pricing Analytics
        </h3>
        <div className="space-y-4">
          {pricingData.optimal_price_range && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Optimal Price Range</h4>
              <div className="flex items-center space-x-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Min: ₹{pricingData.optimal_price_range?.min || 'N/A'}
                </span>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Recommended: ₹{pricingData.optimal_price_range?.recommended || pricingData.optimal_price_range?.max || 'N/A'}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Max: ₹{pricingData.optimal_price_range?.max || 'N/A'}
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Pricing Strategy</h4>
              <p className="text-green-600">{pricingData.pricing_strategy || 'Value-based pricing'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Price Elasticity</h4>
              <p className="text-green-600">{pricingData.price_elasticity || 'Moderate'}</p>
            </div>
          </div>
          
          {pricingData.pricing_recommendations && Array.isArray(pricingData.pricing_recommendations) && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Pricing Recommendations</h4>
              <ul className="space-y-1">
                {pricingData.pricing_recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{extractText(rec)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCustomerSegments = () => (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
        👥 Customer Segments
      </h3>
      {analytics?.analytics?.customer_segments && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Primary Segments</h4>
            <div className="space-y-2">
              {analytics.analytics.customer_segments.primary_segments?.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="font-medium text-purple-700">{segment.name}</span>
                  <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                    {segment.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          {analytics.analytics.customer_segments.demographics && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Demographics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Age Distribution:</span>
                  <div className="space-y-1 mt-1">
                    {Object.entries(analytics.analytics.customer_segments.demographics.age_groups || {}).map(([age, percent]) => (
                      <div key={age} className="flex justify-between">
                        <span>{age}</span>
                        <span>{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Income Levels:</span>
                  <div className="space-y-1 mt-1">
                    {Object.entries(analytics.analytics.customer_segments.demographics.income_levels || {}).map(([income, percent]) => (
                      <div key={income} className="flex justify-between">
                        <span>{income}</span>
                        <span>{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDemandForecast = () => (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
        🔮 Demand Forecast
      </h3>
      {analytics?.analytics?.demand_forecast && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Forecast Trend</h4>
              <p className="text-orange-600">{analytics.analytics.demand_forecast.forecast_trend}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700">Predicted Growth</h4>
              <p className="text-orange-600">{analytics.analytics.demand_forecast.predicted_growth}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Seasonal Peaks</h4>
            <div className="space-y-2">
              {analytics.analytics.demand_forecast.seasonal_peaks?.map((peak, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-orange-700">{typeof peak === 'object' ? peak.period : peak}</span>
                  {typeof peak === 'object' && peak.boost && (
                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">
                      +{peak.boost}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="bg-gradient-to-br from-rose-50 to-pink-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-rose-800 mb-4 flex items-center">
        💡 Strategic Recommendations
      </h3>
      {analytics?.recommendations && (
        <div className="space-y-3">
          {analytics.recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-rose-400">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{rec.category}</h4>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    rec.impact === 'High' ? 'bg-red-100 text-red-800' :
                    rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {rec.timeline || rec.implementation}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">SAP Analytics Cloud Dashboard</h2>
          <p className="text-blue-100">Enterprise-grade business intelligence and analytics</p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">SAP Analytics Cloud</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Real-time Intelligence</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!analytics ? (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Generate Comprehensive Analytics
                </h3>
                <p className="text-gray-600">
                  Get market intelligence, pricing analytics, customer insights, and demand forecasting
                </p>
              </div>
              <button
                onClick={generateAnalytics}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing with SAP Analytics Cloud...</span>
                  </div>
                ) : (
                  'Generate SAP Analytics Dashboard'
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Debug Section - Shows data structure */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Debug: Analytics Data</h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>Success: {String(analytics.success)}</div>
                  <div>Source: {analytics.source}</div>
                  <div>Has Analytics: {String(!!analytics.analytics)}</div>
                  {analytics.analytics && (
                    <>
                      <div>Market Intelligence: {String(!!analytics.analytics.market_intelligence)}</div>
                      <div>Pricing Trends: {String(!!analytics.analytics.pricing_trends)}</div>
                      <div>Customer Segments: {String(!!analytics.analytics.customer_segments)}</div>
                      <div>Demand Forecast: {String(!!analytics.analytics.demand_forecast)}</div>
                      {analytics.analytics.market_intelligence && (
                        <div>MI Market Size: {analytics.analytics.market_intelligence.market_size}</div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'market', label: 'Market Intel', icon: '🔍' },
                    { id: 'pricing', label: 'Pricing', icon: '💰' },
                    { id: 'customers', label: 'Customers', icon: '👥' },
                    { id: 'forecast', label: 'Forecast', icon: '🔮' },
                    { id: 'recommendations', label: 'Insights', icon: '💡' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-indigo-800 mb-4">📈 Business Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Overall Outlook:</span>
                          <span className="text-indigo-600">{analytics.summary?.overall_outlook}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Market Attractiveness:</span>
                          <span className="text-indigo-600">{analytics.summary?.performance_indicators?.market_attractiveness}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Growth Potential:</span>
                          <span className="text-indigo-600">{analytics.summary?.performance_indicators?.growth_potential}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-emerald-800 mb-4">🎯 Key Opportunities</h3>
                      <ul className="space-y-2">
                        {analytics.summary?.key_opportunities?.map((opportunity, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            <span className="text-emerald-700 text-sm">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === 'market' && renderMarketIntelligence()}
                {activeTab === 'pricing' && renderPricingAnalytics()}
                {activeTab === 'customers' && renderCustomerSegments()}
                {activeTab === 'forecast' && renderDemandForecast()}
                {activeTab === 'recommendations' && renderRecommendations()}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">SAP Analytics Cloud Integration Active</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Generated: {new Date(analytics.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={generateAnalytics}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Refresh Analytics
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SAPAnalyticsDashboard;
