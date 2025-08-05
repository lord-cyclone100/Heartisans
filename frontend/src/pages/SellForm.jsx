import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../contexts/AuthContext";
import { shopCategories, shopStates } from "../constants/constants";
import { useScrollToTop } from "../hooks/useScrollToTop";

export const SellForm = () => {
  const { user } = useUser();
  
  // Update seller name when user data becomes available
  useScrollToTop();
  
  const [form, setForm] = useState({
    productName: "",
    productPrice: "",
    productState: "",
    productCategory: "",
    productSellerName: user?.fullName || user?.userName || "",
    productImage: null,
    productDescription: "",
    productMaterial: "",
    productWeight: "",
    productColor: "",
    isCodAvailable: false,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [sapAiLoading, setSapAiLoading] = useState(false);
  const [sapAiSuggestion, setSapAiSuggestion] = useState(null);
  const [pricePrediction, setPricePrediction] = useState(null);
  const [isPredictingPrice, setIsPredictingPrice] = useState(false);
  const [showPricingInsights, setShowPricingInsights] = useState(false);

  // Update seller name when user data becomes available
  useEffect(() => {
    if (user && (user.fullName || user.userName)) {
      setForm(prevForm => ({
        ...prevForm,
        productSellerName: user?.fullName || user?.userName || ""
      }));
    }
  }, [user]);

  // Debug user loading
  useEffect(() => {
    console.log('=== USER CONTEXT DEBUG ===');
    console.log('User in SellForm:', user);
    console.log('User ID:', user?._id);
    console.log('User loaded:', !!user);
    console.log('User object keys:', user ? Object.keys(user) : 'No user');
  }, [user]);

  useScrollToTop();

  const handleChange = (e) => {
    try {
      const { name, value, type, checked, files } = e.target;
      
      if (type === "checkbox") {
        setForm({ ...form, [name]: checked });
      } else if (type === "file") {
        setForm({ ...form, productImage: files[0] });
      } else {
        setForm({ ...form, [name]: value });
      }
    } catch (error) {
      console.error('Form change error:', error);
      setMsg("Form update error. Please refresh the page if issues persist.");
    }
  };



  const generateAIDescription = async () => {
    try {
      const productName = form.productName?.trim();
      const productMaterial = form.productMaterial?.trim();
      const productWeight = form.productWeight?.trim();
      
      if (!productName) {
        setMsg("Please enter a product name first");
        return;
      }

      if (!productMaterial) {
        setMsg("⚠️ Material is required for comprehensive description generation. This helps AI create detailed content about material properties.");
        return;
      }

      if (!productWeight) {
        setMsg("⚠️ Weight is required for accurate description generation. This helps AI understand product dimensions and portability.");
        return;
      }

      setAiLoading(true);
      setMsg("");
      
      const requestData = {
        productName: productName,
        productCategory: form.productCategory || "",
        productState: form.productState || "",
        productMaterial: form.productMaterial || "",
        productWeight: form.productWeight || "",
        productColor: form.productColor || "",
        additionalInfo: form.productDescription || ""
      };

      const response = await axios.post("http://localhost:5000/api/generate-description", requestData, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setAiSuggestion(response.data.description);
        setMsg("AI description generated! You can edit it before using.");
      } else {
        throw new Error('Failed to generate description');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      
      if (error.response?.data?.fallbackDescription) {
        setAiSuggestion(error.response.data.fallbackDescription);
        setMsg("Generated a basic description. AI service temporarily unavailable.");
      } else {
        setMsg("Failed to generate AI description. Please try again or refresh the page.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const useAISuggestion = () => {
    try {
      if (aiSuggestion && aiSuggestion.trim()) {
        setForm({ ...form, productDescription: aiSuggestion });
        setAiSuggestion("");
        setMsg("AI description applied! You can edit it further if needed.");
      } else {
        setMsg("No AI suggestion available to apply.");
      }
    } catch (error) {
      console.error('Error applying AI suggestion:', error);
      setMsg("Error applying AI suggestion. Please try again or refresh the page.");
    }
  };

  // Generate SAP AI Content description
  const generateSAPAIDescription = async () => {
    try {
      const productName = form.productName?.trim();
      const productMaterial = form.productMaterial?.trim();
      const productWeight = form.productWeight?.trim();
      
      if (!productName) {
        setMsg("Please enter a product name first");
        return;
      }

      if (!productMaterial) {
        setMsg("⚠️ Material is required for enterprise-grade SAP AI content generation. Premium materials enhance content quality and SEO performance.");
        return;
      }

      if (!productWeight) {
        setMsg("⚠️ Weight is required for comprehensive SAP AI description generation. This enables detailed shipping, handling, and size specifications.");
        return;
      }

      setSapAiLoading(true);
      setMsg("");
      
      const requestData = {
        productName: productName,
        productCategory: form.productCategory || "",
        productState: form.productState || "",
        productMaterial: form.productMaterial || "",
        productWeight: form.productWeight || "",
        productColor: form.productColor || "",
        additionalInfo: form.productDescription || ""
      };

      const response = await axios.post("http://localhost:5000/api/generate-sap-description", requestData, {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setSapAiSuggestion(response.data.data);
        setMsg("SAP AI Content generated! Review the enterprise-grade description below.");
      } else {
        throw new Error('Failed to generate SAP AI description');
      }
    } catch (error) {
      console.error('SAP AI Content Generation Error:', error);
      setMsg("Failed to generate SAP AI description. Please try again or refresh the page.");
    } finally {
      setSapAiLoading(false);
    }
  };

  const useSAPAISuggestion = () => {
    try {
      if (sapAiSuggestion && sapAiSuggestion.description) {
        setForm({ ...form, productDescription: sapAiSuggestion.description });
        setSapAiSuggestion(null);
        setMsg("SAP AI description applied! Enterprise-grade content ready.");
      } else {
        setMsg("No SAP AI suggestion available to apply.");
      }
    } catch (error) {
      console.error('Error applying SAP AI suggestion:', error);
      setMsg("Error applying SAP AI suggestion. Please try again or refresh the page.");
    }
  };

  // Generate SAP AI price prediction
  const generateSAPPricePrediction = async () => {
    try {
      const productName = form.productName?.trim();
      const productCategory = form.productCategory?.trim();
      const productMaterial = form.productMaterial?.trim();
      const productWeight = form.productWeight?.trim();
      
      if (!productName || !productCategory) {
        setMsg("Please fill in product name and category first");
        return;
      }

      if (!productMaterial) {
        setMsg("⚠️ Material is required for accurate price prediction. Premium materials (Gold, Silver, Silk) can increase your price by 80%+");
        return;
      }

      if (!productWeight) {
        setMsg("⚠️ Weight is required for accurate price prediction. Weight affects material cost and shipping calculations.");
        return;
      }

      setIsPredictingPrice(true);
      setMsg("");
      
      const requestData = {
        productName: productName,
        productCategory: productCategory,
        productState: form.productState || "",
        productMaterial: form.productMaterial || "",
        productWeight: form.productWeight || "",
        productColor: form.productColor || "",
        isHandmade: true,
        region: form.productState || ""
      };

      console.log('SAP AI Request:', requestData);
      
      const response = await axios.post("http://localhost:5000/api/predict-price", requestData, {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setPricePrediction(response.data.data);
        setShowPricingInsights(true);
        
        // Auto-fill suggested price
        setForm(prev => ({ 
          ...prev, 
          productPrice: response.data.data.suggestedPrice.toString() 
        }));
        
        setMsg("SAP AI price prediction generated! Check the insights below.");
      } else {
        throw new Error(response.data.error || 'Failed to generate price prediction');
      }
    } catch (error) {
      console.error('SAP AI Price prediction error:', error);
      setMsg("Failed to generate SAP AI price prediction. Please try again or refresh the page.");
    } finally {
      setIsPredictingPrice(false);
    }
  };

  const useSAPPrice = (price) => {
    try {
      if (price && !isNaN(price)) {
        setForm({ ...form, productPrice: price.toString() });
        setMsg("SAP AI suggested price applied!");
      } else {
        setMsg("Invalid price value. Please try again.");
      }
    } catch (error) {
      console.error('Error applying SAP price:', error);
      setMsg("Error applying price. Please try again or refresh the page.");
    }
  };





  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg("");
  
  // Debug user information before proceeding
  console.log('=== PRODUCT CREATION DEBUG ===');
  console.log('User object:', user);
  console.log('User ID:', user?._id);
  console.log('User Name:', user?.userName);
  console.log('User Full Name:', user?.fullName);
  
  if (!user || !user._id) {
    setMsg("User not properly loaded. Please refresh the page and try again.");
    setLoading(false);
    return;
  }
  
  try {
    // Get signature from backend
    const sigRes = await axios.get("http://localhost:5000/api/cloudinary/cloudinary-signature");
    const { signature, timestamp, apiKey, cloudName } = sigRes.data;

    // Upload image to Cloudinary
    let imageUrl = "";
    if (form.productImage) {
      const data = new FormData();
      data.append("file", form.productImage);
      data.append("api_key", apiKey);
      data.append("timestamp", timestamp);
      data.append("signature", signature);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );
      imageUrl = res.data.secure_url;
    }

    // Send product data to backend
    const payload = {
      ...form,
      productImageUrl: imageUrl,
      productSellerName: user?.fullName || user?.userName || "",
      sellerId: user._id, // Use definitive user._id (we've verified it exists above)
      productPrice: Number(form.productPrice) // Ensure price is a number
    };
    
    delete payload.productImage;
    
    console.log('=== SENDING PAYLOAD ===');
    console.log('Full payload:', payload);
    console.log('sellerId in payload:', payload.sellerId);
    console.log('sellerId type:', typeof payload.sellerId);
    
    const response = await axios.post("http://localhost:5000/api/shopcards", payload);
    console.log('=== CREATION RESPONSE ===');
    console.log('Product creation response:', response.data);
    console.log('Created product sellerId:', response.data.sellerId);
    
    setMsg("Product listed successfully!");
    
    // Reset form but keep seller info
    setForm({
      productName: "",
      productPrice: "",
      productState: "",
      productCategory: "",
      productSellerName: user?.fullName || user?.userName || "",
      productImage: null,
      productDescription: "",
      productMaterial: "",
      productWeight: "",
      productColor: "",
      isCodAvailable: false,
    });
    
  } catch (err) {
    setMsg("Failed to list product. Please try again.");
    console.error("Product listing error:", err);
    console.error("Error response:", err.response?.data);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="w-full h-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4">
              Sell on Heartisans
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto">
              Share your beautiful handcrafted products with the world. List your items and reach customers who appreciate authentic artisan work.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    placeholder="Enter your product name"
                    value={form.productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
                
                {/* Product Price Section with SAP AI */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-base sm:text-lg font-medium text-gray-700">
                      Product Price (₹) *
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          generateSAPPricePrediction();
                        } catch (error) {
                          console.error('Button click error:', error);
                          setMsg("Error occurred. Please refresh the page and try again.");
                        }
                      }}
                      disabled={isPredictingPrice || !form.productName.trim() || !form.productCategory || !form.productMaterial.trim() || !form.productWeight.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-500 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      style={{ backgroundColor: '#479626' }}
                    >
                      {isPredictingPrice ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          SAP AI Analyzing...
                        </div>
                      ) : (
                        <>
                          🧠 SAP AI Price
                        </>
                      )}
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    name="productPrice"
                    placeholder="Enter your product price in rupees"
                    value={form.productPrice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                  
                  {/* SAP AI Pricing Insights Panel */}
                  {pricePrediction && showPricingInsights && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 mt-4 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg shadow-md" style={{ backgroundColor: '#479626' }}>
                            🧠
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-green-900">SAP AI Price Intelligence</h3>
                            <p className="text-sm text-green-700">Powered by SAP Business Technology Platform</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPricingInsights(false)}
                          className="px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                        >
                          ✕
                        </button>
                      </div>

                      {/* SAP Recommended Price */}
                      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                        <h4 className="font-semibold text-lg text-gray-800 mb-3">SAP Recommended Price</h4>
                        <p className="text-3xl font-bold text-green-600 mb-2">₹{pricePrediction.suggestedPrice?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mb-4">
                          Range: ₹{pricePrediction.priceRange?.min?.toLocaleString()} - ₹{pricePrediction.priceRange?.max?.toLocaleString()}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 gap-3 mb-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                useSAPPrice(pricePrediction.suggestedPrice);
                              } catch (error) {
                                console.error('Error applying price:', error);
                                setMsg("Error occurred. Please refresh the page and try again.");
                              }
                            }}
                            className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#479626' }}
                          >
                            <span>✓</span>
                            Use This Price
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                useSAPPrice(pricePrediction.priceRange?.min);
                              } catch (error) {
                                console.error('Error applying min price:', error);
                                setMsg("Error occurred. Please refresh the page and try again.");
                              }
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <span>↓</span>
                            Use Min
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                useSAPPrice(pricePrediction.priceRange?.max);
                              } catch (error) {
                                console.error('Error applying max price:', error);
                                setMsg("Error occurred. Please refresh the page and try again.");
                              }
                            }}
                            className="px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <span>↑</span>
                            Use Max
                          </button>
                        </div>
                      </div>

                      {/* Material Impact Guide */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
                          <span>🏆</span>
                          How Material Affects Your Price
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <div className="text-2xl mb-1">🥇</div>
                            <div className="text-xs font-medium text-gray-700">Premium</div>
                            <div className="text-xs text-green-600">+80%</div>
                            <div className="text-xs text-gray-500">Gold, Silver</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <div className="text-2xl mb-1">🥈</div>
                            <div className="text-xs font-medium text-gray-700">Luxury</div>
                            <div className="text-xs text-green-600">+40%</div>
                            <div className="text-xs text-gray-500">Silk, Marble</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <div className="text-2xl mb-1">🌿</div>
                            <div className="text-xs font-medium text-gray-700">Premium Wood</div>
                            <div className="text-xs text-green-600">+30%</div>
                            <div className="text-xs text-gray-500">Teak, Rosewood</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border">
                            <div className="text-2xl mb-1">🏺</div>
                            <div className="text-xs font-medium text-gray-700">Standard</div>
                            <div className="text-xs text-gray-600">Base</div>
                            <div className="text-xs text-gray-500">Clay, Cotton</div>
                          </div>
                        </div>
                        <p className="text-xs text-amber-700 mt-3">
                          💡 Your material "{form.productMaterial}" has been factored into the SAP AI pricing above
                        </p>
                      </div>

                      {/* SAP Business Intelligence Section */}
                      {pricePrediction.sapBusinessInsights && (
                        <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                            <span>📊</span>
                            SAP Business Intelligence
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Demand Forecast */}
                            <div>
                              <h5 className="font-medium text-sm mb-2 text-gray-700">Demand Forecast</h5>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                                    style={{ width: `${pricePrediction.sapBusinessInsights.demandForecast?.score || 70}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{pricePrediction.sapBusinessInsights.demandForecast?.score || 70}/100</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Trend: <span className="font-medium">{pricePrediction.sapBusinessInsights.demandForecast?.trend || 'stable'}</span> | 
                                Seasonality: <span className="font-medium">{pricePrediction.sapBusinessInsights.demandForecast?.seasonality || 'medium'}</span>
                              </p>
                            </div>

                            {/* Competitive Analysis */}
                            <div>
                              <h5 className="font-medium text-sm mb-2 text-gray-700">Competitive Position</h5>
                              <p className="text-lg font-bold text-green-600 mb-1">
                                {pricePrediction.sapBusinessInsights.competitiveAnalysis?.position || 'challenger'}
                              </p>
                              <p className="text-xs text-gray-600">
                                Competitors: {pricePrediction.sapBusinessInsights.competitiveAnalysis?.competitorCount || 15} | 
                                Differentiation: {pricePrediction.sapBusinessInsights.competitiveAnalysis?.differentiationFactor || 75}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Performance KPIs */}
                      {pricePrediction.sapEnrichment?.performanceKPIs && (
                        <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                          <h4 className="font-semibold mb-3 text-green-800">📈 Performance KPIs</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">₹{pricePrediction.sapEnrichment.performanceKPIs.revenueProjection?.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">Monthly Revenue</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">{pricePrediction.sapEnrichment.performanceKPIs.marketSharePotential}%</p>
                              <p className="text-xs text-gray-600">Market Share</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-purple-600">₹{pricePrediction.sapEnrichment.performanceKPIs.customerAcquisitionCost}</p>
                              <p className="text-xs text-gray-600">Acquisition Cost</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-orange-600">{pricePrediction.sapEnrichment.performanceKPIs.returnOnInvestment}%</p>
                              <p className="text-xs text-gray-600">ROI</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SAP Metadata Footer */}
                      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span>🕒 {new Date(pricePrediction.timestamp).toLocaleString()}</span>
                          <span>📊 Confidence: {pricePrediction.confidence}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="font-medium text-green-600">{pricePrediction.sapVersion}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    State *
                  </label>
                  <select
                    name="productState"
                    value={form.productState}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white text-lg"
                  >
                    <option value="">Select your state</option>
                    {shopStates.map((state) => (
                      <option key={state.name} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="productCategory"
                    value={form.productCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white text-lg"
                  >
                    <option value="">Select product category</option>
                    {shopCategories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seller Info */}
              <div className="space-y-2">
                <label className="block text-base sm:text-lg font-medium text-gray-700">
                  Seller Name
                </label>
                <input
                  type="text"
                  name="productSellerName"
                  value={form.productSellerName}
                  disabled
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 text-lg"
                />
              </div>

              {/* Product Image */}
              <div className="space-y-2">
                <label className="block text-base sm:text-lg font-medium text-gray-700">
                  Product Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="productImage"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 text-lg"
                  />
                </div>
                <p className="text-base text-gray-500">Upload a clear image of your product (JPG, JPEG, PNG)</p>
              </div>

              {/* Product Description */}
              {/* <div className="space-y-2">
                <label className="block text-base sm:text-lg font-medium text-gray-700">
                  Product Description *
                </label>
                <textarea
                  name="productDescription"
                  placeholder="Describe your product, its features, craftsmanship, and what makes it special..."
                  value={form.productDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-lg"
                />
              </div> */}










                {/* AI-Enhanced Product Description Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Product Description *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          generateAIDescription();
                        } catch (error) {
                          console.error('Button click error:', error);
                          setMsg("Error occurred. Please refresh the page and try again.");
                        }
                      }}
                      disabled={aiLoading || !form.productName.trim() || !form.productMaterial.trim() || !form.productWeight.trim()}
                      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                          Generating...
                        </div>
                      ) : (
                        <>
                          🤖 Quick AI
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        try {
                          e.preventDefault();
                          e.stopPropagation();
                          generateSAPAIDescription();
                        } catch (error) {
                          console.error('Button click error:', error);
                          setMsg("Error occurred. Please refresh the page and try again.");
                        }
                      }}
                      disabled={sapAiLoading || !form.productName.trim() || !form.productMaterial.trim() || !form.productWeight.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-500 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      style={{ backgroundColor: '#479626' }}
                    >
                      {sapAiLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          SAP AI...
                        </div>
                      ) : (
                        <>
                          🧠 SAP AI Pro
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <textarea
                  name="productDescription"
                  placeholder="Describe your product, its features, craftsmanship, and what makes it special..."
                  value={form.productDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-lg"
                />
                
                {/* Quick AI Suggestion Display */}
                {aiSuggestion && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-blue-800">
                        🤖 Quick AI Generated Description
                      </h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={useAISuggestion}
                          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          Use This
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiSuggestion("")}
                          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiSuggestion}
                    </p>
                  </div>
                )}

                {/* SAP AI Content Generation Display */}
                {sapAiSuggestion && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-lg shadow-md" style={{ backgroundColor: '#479626' }}>
                          🧠
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-green-900">SAP AI Core Content Generation</h4>
                          <p className="text-xs text-green-700">Enterprise-grade content intelligence</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={useSAPAISuggestion}
                          className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-md"
                          style={{ backgroundColor: '#479626' }}
                        >
                          ✓ Use SAP Content
                        </button>
                        <button
                          type="button"
                          onClick={() => setSapAiSuggestion(null)}
                          className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
                        >
                          ✕ Dismiss
                        </button>
                      </div>
                    </div>

                    {/* Generated Description */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-400 shadow-sm">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {sapAiSuggestion.description}
                      </p>
                    </div>

                    {/* SAP Content Analytics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">SEO Score</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.seoScore || 85}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.seoScore || 85}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Readability</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.readabilityScore || 90}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.readabilityScore || 90}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Cultural Relevance</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.culturalRelevance || 88}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.culturalRelevance || 88}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Emotional Impact</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.emotionalImpact || 82}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.emotionalImpact || 82}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Conversion Potential</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.conversionPotential || 87}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.conversionPotential || 87}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Brand Alignment</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.brandAlignment || 91}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.brandAlignment || 91}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Analytics */}
                    {sapAiSuggestion.contentAnalytics && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-sm mb-2 text-green-800">📊 Content Analytics</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold text-gray-800">{sapAiSuggestion.contentAnalytics.wordCount}</p>
                            <p className="text-xs text-gray-600">Words</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">{sapAiSuggestion.contentAnalytics.sentenceCount}</p>
                            <p className="text-xs text-gray-600">Sentences</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">{sapAiSuggestion.contentAnalytics.sentimentScore}</p>
                            <p className="text-xs text-gray-600">Sentiment</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">{sapAiSuggestion.contentAnalytics.keywordDensity}%</p>
                            <p className="text-xs text-gray-600">Keyword Density</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SAP Recommendations */}
                    {sapAiSuggestion.recommendations && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-sm mb-2 text-green-800">💡 SAP AI Recommendations</h5>
                        <ul className="text-sm space-y-1">
                          {sapAiSuggestion.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SAP Metadata */}
                    <div className="text-xs text-green-600 flex items-center justify-between pt-2 border-t border-green-200">
                      <span>🕒 {new Date(sapAiSuggestion.timestamp).toLocaleString()}</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">{sapAiSuggestion.sapVersion}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>












              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Material * <span className="text-sm text-green-600 font-medium">(Critical for pricing)</span>
                  </label>
                  <input
                    type="text"
                    name="productMaterial"
                    placeholder="e.g., Gold, Silver, Silk, Teak Wood, Marble, Clay"
                    value={form.productMaterial}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                  <p className="text-sm text-gray-600">
                    📊 Premium materials (Gold, Silver, Silk) significantly increase SAP AI price predictions
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Weight (grams) *
                  </label>
                  <input
                    type="number"
                    name="productWeight"
                    placeholder="Enter weight in grams"
                    value={form.productWeight}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Primary Color *
                  </label>
                  <input
                    type="text"
                    name="productColor"
                    placeholder="e.g., Brown, Blue, Multicolor"
                    value={form.productColor}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isCodAvailable"
                    checked={form.isCodAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <span className="text-base sm:text-lg font-medium text-gray-900">Cash on Delivery Available</span>
                    <p className="text-base text-gray-500">Allow customers to pay when they receive the product</p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 px-8 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'text-white'
                  }`}
                  style={!loading ? { backgroundColor: '#ffaf27' } : {}}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </div>
                  ) : (
                    'List Your Product'
                  )}
                </button>
              </div>

              {/* Success/Error Message */}
              {msg && (
                <div className={`text-center p-4 rounded-xl ${
                  msg.includes('successfully') 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {msg.includes('successfully') ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium">{msg}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};