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
      const response = await axios.post('https://heartisans-1.onrender.com/api/analytics/analytics-dashboard', productData);
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
        <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
            <span className="text-3xl mr-4">🔍</span>
            Market Intelligence
          </h3>
          <p className="text-xl text-gray-500">No market intelligence data available</p>
        </div>
      );
    }

    return (
      <div className="p-12 rounded-2xl font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
          <span className="text-4xl mr-4">🔍</span>
          Market Intelligence
        </h3>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-4">Market Size</h4>
              <p className="text-3xl font-bold" style={{ color: '#479626' }}>{marketData.market_size || 'N/A'}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-4">Growth Rate</h4>
              <p className="text-3xl font-bold" style={{ color: '#479626' }}>{marketData.growth_rate || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-4">Competition Level</h4>
              <p className="text-3xl font-bold" style={{ color: '#479626' }}>{marketData.competition_level || 'N/A'}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-4">Source</h4>
              <p className="text-lg font-semibold" style={{ color: '#479626' }}>{marketData.source || 'SAP Analytics Cloud'}</p>
            </div>
          </div>
          
          {marketData.key_insights && Array.isArray(marketData.key_insights) && marketData.key_insights.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-700 mb-6">Key Insights</h4>
              <ul className="space-y-4">
                {marketData.key_insights.map((insight, index) => (
                  <li key={index} className="text-lg text-gray-600 flex items-start">
                    <span className="mr-4 text-xl" style={{ color: '#479626' }}>•</span>
                    <span>{extractText(insight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {marketData.opportunities && Array.isArray(marketData.opportunities) && marketData.opportunities.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-xl text-gray-700 mb-6">Market Opportunities</h4>
              <ul className="space-y-4">
                {marketData.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-lg text-gray-600 flex items-start">
                    <span className="mr-4 text-xl" style={{ color: '#479626' }}>•</span>
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
        <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
            <span className="text-3xl mr-4">💰</span>
            Pricing Analytics
          </h3>
          <p className="text-2xl text-gray-500">No pricing analytics data available</p>
        </div>
      );
    }

    return (
      <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
          <span className="text-4xl mr-4">💰</span>
          Pricing Analytics
        </h3>
        <div className="space-y-8">
          {pricingData.optimal_price_range && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Optimal Price Range</h4>
              <div className="flex flex-wrap items-center gap-6">
                <span className="px-6 py-3 rounded-full text-xl font-semibold" style={{ backgroundColor: '#e8f5e8', color: '#479626' }}>
                  Min: ₹{pricingData.optimal_price_range?.min || 'N/A'}
                </span>
                <span className="px-6 py-3 rounded-full text-xl font-bold" style={{ backgroundColor: '#479626', color: 'white' }}>
                  Recommended: ₹{pricingData.optimal_price_range?.recommended || pricingData.optimal_price_range?.max || 'N/A'}
                </span>
                <span className="px-6 py-3 rounded-full text-xl font-semibold" style={{ backgroundColor: '#e8f5e8', color: '#479626' }}>
                  Max: ₹{pricingData.optimal_price_range?.max || 'N/A'}
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-xl text-gray-700">Pricing Strategy</h4>
              <p className="text-lg font-semibold mt-2" style={{ color: '#479626' }}>{pricingData.pricing_strategy || 'Value-based pricing'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-xl text-gray-700">Price Elasticity</h4>
              <p className="text-lg font-semibold mt-2" style={{ color: '#479626' }}>{pricingData.price_elasticity || 'Moderate'}</p>
            </div>
          </div>
          
          {pricingData.pricing_recommendations && Array.isArray(pricingData.pricing_recommendations) && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-xl text-gray-700 mb-2">Pricing Recommendations</h4>
              <ul className="space-y-1">
                {pricingData.pricing_recommendations.map((rec, index) => (
                  <li key={index} className="text-base text-gray-600 flex items-start">
                    <span className="mr-2" style={{ color: '#479626' }}>•</span>
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

  const renderCustomerSegments = () => {
    const customerData = analytics?.analytics?.customer_segments;
    
    return (
      <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #fef3e2, #fff5e6)', border: '1px solid #ffaf27' }}>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 flex items-center" style={{ color: '#ffaf27' }}>
          <span className="text-4xl mr-4">👥</span>
          Customer Segments
        </h3>
        
        {customerData ? (
          <div className="space-y-8">
            {/* Display Groq's primary_segment (singular) */}
            {customerData.primary_segment && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Primary Segment</h4>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-2xl" style={{ color: '#ffaf27' }}>{customerData.primary_segment.name}</span>
                    <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#ffaf27', color: 'white' }}>
                      {customerData.primary_segment.size}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">{customerData.primary_segment.characteristics}</p>
                </div>
              </div>
            )}
            
            {/* Display Groq's secondary_segments */}
            {customerData.secondary_segments && Array.isArray(customerData.secondary_segments) && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Secondary Segments</h4>
                <div className="space-y-4">
                  {customerData.secondary_segments.map((segment, index) => (
                    <div key={index} className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                      <span className="mr-4 text-xl" style={{ color: '#ffaf27' }}>•</span>
                      <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>{segment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display buying_behavior if available */}
            {customerData.buying_behavior && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Buying Behavior</h4>
                <p className="text-xl font-semibold" style={{ color: '#ffaf27' }}>{customerData.buying_behavior}</p>
              </div>
            )}
            
            {/* Display segment_insights if available */}
            {customerData.segment_insights && Array.isArray(customerData.segment_insights) && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Segment Insights</h4>
                <div className="space-y-4">
                  {customerData.segment_insights.map((insight, index) => (
                    <div key={index} className="flex items-start p-4">
                      <span className="mr-4 mt-1 text-xl" style={{ color: '#ffaf27' }}>•</span>
                      <span className="text-lg text-gray-600">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Original demographics structure (if available) */}
            {customerData.demographics && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Demographics</h4>
                <div className="grid grid-cols-2 gap-8 text-lg">
                  <div>
                    <span className="font-bold text-xl">Age Distribution:</span>
                    <div className="space-y-3 mt-4">
                      {Object.entries(customerData.demographics.age_groups || {}).map(([age, percent]) => (
                        <div key={age} className="flex justify-between">
                          <span className="text-lg">{age}</span>
                          <span className="text-lg font-semibold">{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xl">Income Levels:</span>
                    <div className="space-y-3 mt-4">
                      {Object.entries(customerData.demographics.income_levels || {}).map(([income, percent]) => (
                        <div key={income} className="flex justify-between">
                          <span className="text-lg">{income}</span>
                          <span className="text-lg font-semibold">{percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Default customer segments when no data available */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Primary Segments</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>Cultural Enthusiasts</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#ffaf27', color: 'white' }}>35%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>Gift Buyers</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#ffaf27', color: 'white' }}>28%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>Home Decorators</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#ffaf27', color: 'white' }}>22%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#fff5e6' }}>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>Collectors</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#ffaf27', color: 'white' }}>15%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Demographics</h4>
              <div className="grid grid-cols-2 gap-8 text-lg">
                <div>
                  <span className="font-bold text-xl">Age Distribution:</span>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg">25-34</span>
                      <span className="text-lg font-semibold">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg">35-44</span>
                      <span className="text-lg font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg">45-54</span>
                      <span className="text-lg font-semibold">24%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg">55+</span>
                      <span className="text-lg font-semibold">16%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl">Income Levels:</span>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-lg">Middle Class</span>
                      <span className="text-lg font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg">Upper Middle</span>
                      <span className="text-lg font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg">Premium</span>
                      <span className="text-lg font-semibold">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Purchase Behavior</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Average Order Value</span>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>₹2,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Repeat Purchase Rate</span>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Peak Shopping Season</span>
                  <span className="font-bold text-xl" style={{ color: '#ffaf27' }}>Festival Months</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderDemandForecast = () => {
    const forecastData = analytics?.analytics?.demand_forecast;
    
    return (
      <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
          <span className="text-4xl mr-4">🔮</span>
          Demand Forecast
        </h3>
        
        {forecastData ? (
          <div className="space-y-8">
            {/* Display Groq's monthly_forecast */}
            {forecastData.monthly_forecast && Array.isArray(forecastData.monthly_forecast) && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Monthly Forecast</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {forecastData.monthly_forecast.map((monthString, index) => {
                    // Split string like "Jan: 150 units" into month and value
                    const [month, valueWithUnits] = monthString.split(': ');
                    const numericValue = valueWithUnits ? valueWithUnits.split(' ')[0] : '0';
                    return (
                      <div key={index} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#e8f5e8' }}>
                        <div className="font-bold text-lg" style={{ color: '#479626' }}>{month}</div>
                        <div className="text-2xl font-bold mt-2" style={{ color: '#479626' }}>{numericValue}</div>
                        <div className="text-base text-gray-500">units</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Display seasonal_trends if available */}
            {forecastData.seasonal_trends && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Seasonal Trends</h4>
                <p className="text-xl font-bold mt-2" style={{ color: '#479626' }}>{forecastData.seasonal_trends}</p>
              </div>
            )}
            
            {/* Display forecast_confidence if available */}
            {forecastData.forecast_confidence && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Forecast Confidence</h4>
                <p className="text-xl font-bold mt-2" style={{ color: '#479626' }}>{forecastData.forecast_confidence}</p>
              </div>
            )}
            
            {/* Display business_impact if available */}
            {forecastData.business_impact && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Business Impact</h4>
                <p className="text-xl font-bold mt-2" style={{ color: '#479626' }}>{forecastData.business_impact}</p>
              </div>
            )}
            
            {/* Display forecast_trend if available (fallback) */}
            {forecastData.forecast_trend && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Forecast Trend</h4>
                <p className="text-xl font-bold mt-2" style={{ color: '#479626' }}>{forecastData.forecast_trend}</p>
              </div>
            )}
            
            {/* Display predicted_growth if available (fallback) */}
            {forecastData.predicted_growth && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Predicted Growth</h4>
                <p className="text-xl font-bold mt-2" style={{ color: '#479626' }}>{forecastData.predicted_growth}</p>
              </div>
            )}
            
            {/* Display seasonal_peaks if available (fallback) */}
            {forecastData.seasonal_peaks && Array.isArray(forecastData.seasonal_peaks) && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Seasonal Peaks</h4>
                <div className="space-y-4">
                  {forecastData.seasonal_peaks.map((peak, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e8f5e8' }}>
                      <span className="text-lg font-semibold" style={{ color: '#479626' }}>{typeof peak === 'object' ? peak.period : peak}</span>
                      {typeof peak === 'object' && peak.boost && (
                        <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#479626', color: 'white' }}>
                          +{peak.boost}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display demand_drivers if available */}
            {forecastData.demand_drivers && Array.isArray(forecastData.demand_drivers) && (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-6">Demand Drivers</h4>
                <div className="space-y-4">
                  {forecastData.demand_drivers.map((driver, index) => (
                    <div key={index} className="flex items-start p-4">
                      <span className="mr-4 mt-1 text-xl" style={{ color: '#479626' }}>•</span>
                      <span className="text-lg text-gray-600">{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Default forecast data when no analytics available */}
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Forecast Trend</h4>
                <p className="font-bold text-xl" style={{ color: '#479626' }}>↗️ Growing Demand</p>
                <p className="text-lg text-gray-600 mt-4">Based on market patterns and cultural events</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="font-bold text-2xl text-gray-700 mb-4">Predicted Growth</h4>
                <p className="font-bold text-xl" style={{ color: '#479626' }}>+15-25% YoY</p>
                <p className="text-lg text-gray-600 mt-4">Expected annual growth in artisan category</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Seasonal Peaks</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e8f5e8' }}>
                  <span className="text-lg font-semibold" style={{ color: '#479626' }}>🎨 Festival Season (Oct-Nov)</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#479626', color: 'white' }}>+40%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e8f5e8' }}>
                  <span className="text-lg font-semibold" style={{ color: '#479626' }}>🎁 Wedding Season (Dec-Feb)</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#479626', color: 'white' }}>+30%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e8f5e8' }}>
                  <span className="text-lg font-semibold" style={{ color: '#479626' }}>🌸 Spring Collection (Mar-Apr)</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#479626', color: 'white' }}>+20%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#e8f5e8' }}>
                  <span className="text-lg font-semibold" style={{ color: '#479626' }}>🏡 Home Decor Trends (Aug-Sep)</span>
                  <span className="px-4 py-2 rounded-xl text-lg font-semibold" style={{ backgroundColor: '#479626', color: 'white' }}>+25%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-bold text-2xl text-gray-700 mb-6">Market Insights</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Market Size Growth</span>
                  <span className="font-bold text-xl" style={{ color: '#479626' }}>₹1.5M annually</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Digital Adoption Rate</span>
                  <span className="font-bold text-xl" style={{ color: '#479626' }}>65% increase</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-600">Regional Demand Leader</span>
                  <span className="font-bold text-xl" style={{ color: '#479626' }}>{productData.region || 'Metropolitan'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRecommendations = () => (
    <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #fef3e2, #fff5e6)', border: '1px solid #ffaf27' }}>
      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 flex items-center" style={{ color: '#ffaf27' }}>
        <span className="text-4xl mr-4">💡</span>
        Strategic Recommendations
      </h3>
      {analytics?.recommendations && (
        <div className="space-y-6">
          {analytics.recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-rose-400">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-2xl text-gray-800">{rec.category}</h4>
                <div className="flex space-x-3">
                  <span className={`px-4 py-2 rounded-xl text-base font-semibold ${
                    rec.impact === 'High' ? 'bg-red-100 text-red-800' :
                    rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.impact} Impact
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-base font-semibold">
                    {rec.timeline || rec.implementation}
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ border: '1px solid #479626' }}>
        <div className="text-white p-12" style={{ background: 'linear-gradient(to right, #479626, #5ba82a, #479626)' }}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">SAP Analytics Cloud Dashboard</h2>
          <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: '#e8f5e8' }}>Enterprise-grade business intelligence and analytics for artisan marketplaces</p>
          <div className="flex flex-wrap items-center mt-8 gap-6">
            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-xl px-6 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#e8f5e8' }}></div>
              <span className="text-lg font-medium">SAP Analytics Cloud</span>
            </div>
            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-xl px-6 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#e8f5e8' }}></div>
              <span className="text-lg font-medium">Real-time Intelligence</span>
            </div>
          </div>
        </div>

        <div className="p-12">
          {!analytics ? (
            <div className="text-center">
              <div className="mb-12">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Generate Comprehensive Analytics
                </h3>
                <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Get market intelligence, pricing analytics, customer insights, and demand forecasting powered by SAP Analytics Cloud
                </p>
              </div>
              <button
                onClick={generateAnalytics}
                disabled={loading}
                className="text-white px-12 py-6 rounded-2xl font-bold text-xl sm:text-2xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ 
                  background: loading ? '#479626' : 'linear-gradient(to right, #479626, #5ba82a)',
                  ':hover': { background: 'linear-gradient(to right, #3a7d1f, #479626)' }
                }}
              >
                {loading ? (
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    <span>Analyzing with SAP Analytics Cloud...</span>
                  </div>
                ) : (
                  'Generate SAP Analytics Dashboard'
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="border-b-2 mb-12" style={{ borderColor: '#479626' }}>
                <nav className="flex flex-wrap gap-2">
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
                      className={`py-4 px-6 border-b-4 font-bold text-lg transition-all duration-300 rounded-t-xl ${
                        activeTab === tab.id
                          ? 'text-gray-500 hover:text-gray-700'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      style={{
                        borderBottomColor: activeTab === tab.id ? '#479626' : 'transparent',
                        color: activeTab === tab.id ? '#479626' : undefined,
                        backgroundColor: activeTab === tab.id ? '#e8f5e8' : undefined
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab.id) {
                          e.target.style.borderBottomColor = '#a8d5a8';
                          e.target.style.backgroundColor = '#e8f5e8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab.id) {
                          e.target.style.borderBottomColor = 'transparent';
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="mr-3 text-xl">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-12">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center" style={{ color: '#479626' }}>
                        <span className="text-3xl mr-4">📈</span>
                        Business Overview
                      </h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-6 rounded-xl">
                          <span className="font-bold text-lg text-gray-700">Overall Outlook:</span>
                          <span className="font-semibold text-lg" style={{ color: '#479626' }}>{analytics.summary?.overall_outlook}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-6 rounded-xl">
                          <span className="font-bold text-lg text-gray-700">Market Attractiveness:</span>
                          <span className="font-semibold text-lg" style={{ color: '#479626' }}>{analytics.summary?.performance_indicators?.market_attractiveness}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-6 rounded-xl">
                          <span className="font-bold text-lg text-gray-700">Growth Potential:</span>
                          <span className="font-semibold text-lg" style={{ color: '#479626' }}>{analytics.summary?.performance_indicators?.growth_potential}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-12 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, #fef3e2, #fff5e6)', border: '1px solid #ffaf27' }}>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center" style={{ color: '#ffaf27' }}>
                        <span className="text-3xl mr-4">🎯</span>
                        Key Opportunities
                      </h3>
                      <ul className="space-y-4">
                        {analytics.summary?.key_opportunities?.map((opportunity, index) => (
                          <li key={index} className="flex items-start bg-white p-6 rounded-xl">
                            <span className="mr-4 text-xl" style={{ color: '#ffaf27' }}>✓</span>
                            <span className="text-lg font-medium" style={{ color: '#ffaf27' }}>{opportunity}</span>
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

              <div className="mt-12 p-8 rounded-2xl" style={{ background: 'linear-gradient(to right, #e8f5e8, #f0f9f0)', border: '1px solid #479626' }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: '#479626' }}></div>
                      <span className="text-lg font-semibold text-gray-700">SAP Analytics Cloud Integration Active</span>
                    </div>
                    <span className="text-base text-gray-600">
                      Generated: {new Date(analytics.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={generateAnalytics}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
