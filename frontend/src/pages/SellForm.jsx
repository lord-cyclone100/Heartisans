import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { shopCategories, shopStates } from "../constants/constants";

export const SellForm = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    productName: "",
    productPrice: "",
    productState: "",
    productCategory: "",
    productSellerName: user?.fullName || "",
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, productImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const generateAIDescription = async () => {
    if (!form.productName.trim()) {
      setMsg("Please enter a product name first");
      return;
    }

    setAiLoading(true);
    setMsg("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/generate-description", {
        productName: form.productName,
        productCategory: form.productCategory,
        productState: form.productState,
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        additionalInfo: form.productDescription
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
        setMsg("Failed to generate AI description. Please try again.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const useAISuggestion = () => {
    setForm({ ...form, productDescription: aiSuggestion });
    setAiSuggestion("");
    setMsg("AI description applied! You can edit it further if needed.");
  };

  // Generate SAP AI Content description
  const generateSAPAIDescription = async () => {
    if (!form.productName.trim()) {
      setMsg("Please enter a product name first");
      return;
    }

    setSapAiLoading(true);
    setMsg("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/generate-sap-description", {
        productName: form.productName,
        productCategory: form.productCategory,
        productState: form.productState,
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        additionalInfo: form.productDescription
      });

      if (response.data.success) {
        setSapAiSuggestion(response.data.data);
        setMsg("SAP AI Content generated! Review the enterprise-grade description below.");
      } else {
        throw new Error('Failed to generate SAP AI description');
      }
    } catch (error) {
      console.error('SAP AI Content Generation Error:', error);
      setMsg("Failed to generate SAP AI description. Please try again.");
    } finally {
      setSapAiLoading(false);
    }
  };

  const useSAPAISuggestion = () => {
    setForm({ ...form, productDescription: sapAiSuggestion.description });
    setSapAiSuggestion(null);
    setMsg("SAP AI description applied! Enterprise-grade content ready.");
  };

  // Generate SAP AI price prediction
  const generateSAPPricePrediction = async () => {
    if (!form.productName || !form.productCategory) {
      setMsg("Please fill in product name and category first");
      return;
    }

    setIsPredictingPrice(true);
    setMsg("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/predict-price", {
        productName: form.productName,
        productCategory: form.productCategory,
        productState: form.productState,
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        isHandmade: true,
        region: form.productState
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
      setMsg("Failed to generate SAP AI price prediction. Please try again.");
    } finally {
      setIsPredictingPrice(false);
    }
  };

  const useSAPPrice = (price) => {
    setForm({ ...form, productPrice: price.toString() });
    setMsg("SAP AI suggested price applied!");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg("");
  try {
    // 1. Get signature from backend
    const sigRes = await axios.get("http://localhost:5000/api/cloudinary-signature");
    const { signature, timestamp, apiKey, cloudName } = sigRes.data;

    // 2. Upload image to Cloudinary with signature
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

    // 3. Send product data to backend
    const payload = {
      ...form,
      productImageUrl: imageUrl,
      productSellerName: user?.fullName || "",
    };
    delete payload.productImage;
    await axios.post("http://localhost:5000/api/shopcards", payload);
    setMsg("Product listed successfully!");
    setForm({
      productName: "",
      productPrice: "",
      productState: "",
      productCategory: "",
      productSellerName: user?.fullName || "",
      productImage: null,
      productDescription: "",
      productMaterial: "",
      productWeight: "",
      productColor: "",
      isCodAvailable: false,
    });
  } catch (err) {
    setMsg("Failed to list product.");
  }
  setLoading(false);
};

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Sell on Heartisans</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={form.productName}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              
              {/* SAP AI Price Prediction Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Product Price (₹)</label>
                  <button
                    type="button"
                    onClick={generateSAPPricePrediction}
                    disabled={isPredictingPrice || !form.productName.trim() || !form.productCategory}
                    className="btn btn-sm btn-outline btn-accent"
                  >
                    {isPredictingPrice ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        SAP AI Analyzing...
                      </>
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
                  placeholder="Product Price"
                  value={form.productPrice}
                  onChange={handleChange}
                  required
                  className="input input-bordered"
                />
                
                {/* SAP AI Pricing Insights Panel */}
                {pricePrediction && showPricingInsights && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white p-3 rounded-lg">
                          🧠
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-blue-900">SAP AI Price Intelligence</h3>
                          <p className="text-sm text-blue-600">Powered by SAP Business Technology Platform</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPricingInsights(false)}
                        className="btn btn-ghost btn-sm"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Suggested Price */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">SAP Recommended Price</h4>
                        <p className="text-2xl font-bold text-green-600">₹{pricePrediction.suggestedPrice?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          Range: ₹{pricePrediction.priceRange?.min?.toLocaleString()} - ₹{pricePrediction.priceRange?.max?.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => useSAPPrice(pricePrediction.suggestedPrice)}
                            className="btn btn-xs btn-primary"
                          >
                            Use This Price
                          </button>
                          <button
                            type="button"
                            onClick={() => useSAPPrice(pricePrediction.priceRange?.min)}
                            className="btn btn-xs btn-outline"
                          >
                            Use Min
                          </button>
                          <button
                            type="button"
                            onClick={() => useSAPPrice(pricePrediction.priceRange?.max)}
                            className="btn btn-xs btn-outline"
                          >
                            Use Max
                          </button>
                        </div>
                      </div>

                      {/* Market Position */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Market Position</h4>
                        <span className={`badge text-white text-sm px-3 py-2 ${
                          pricePrediction.marketPosition === 'premium' ? 'bg-purple-500' :
                          pricePrediction.marketPosition === 'mid-range' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                          {pricePrediction.marketPosition?.toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          Confidence: {pricePrediction.confidence}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${pricePrediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Profit Analysis */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Profit Analysis</h4>
                        {pricePrediction.sapBusinessInsights?.profitAnalysis && (
                          <>
                            <p className="text-xl font-bold text-green-600">
                              {pricePrediction.sapBusinessInsights.profitAnalysis.grossMargin}%
                            </p>
                            <p className="text-xs text-gray-500">Gross Margin</p>
                            <div className="mt-2">
                              <span className={`badge badge-sm ${
                                pricePrediction.sapBusinessInsights.profitAnalysis.profitHealthScore > 80 ? 'badge-success' :
                                pricePrediction.sapBusinessInsights.profitAnalysis.profitHealthScore > 60 ? 'badge-warning' :
                                'badge-error'
                              }`}>
                                Health: {pricePrediction.sapBusinessInsights.profitAnalysis.profitHealthScore}/100
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* SAP Business Intelligence Section */}
                    {pricePrediction.sapBusinessInsights && (
                      <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
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
                            <p className="text-lg font-bold text-blue-600 mb-1">
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
                        <h4 className="font-semibold mb-3 text-blue-800">📈 Performance KPIs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">₹{pricePrediction.sapEnrichment.performanceKPIs.revenueProjection?.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Monthly Revenue</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{pricePrediction.sapEnrichment.performanceKPIs.marketSharePotential}%</p>
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

                    {/* Price Factors & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price Factors */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold mb-2 text-gray-800">Price Influencing Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {pricePrediction.pricingFactors?.map((factor, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SAP Recommendations */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold mb-2 text-gray-800">SAP AI Recommendations</h4>
                        <ul className="text-sm space-y-1">
                          {pricePrediction.recommendations?.slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SAP Metadata Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span>🕒 {new Date(pricePrediction.timestamp).toLocaleString()}</span>
                        <span>📊 Confidence: {pricePrediction.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="font-medium text-blue-600">{pricePrediction.sapVersion}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <select
                name="productState"
                value={form.productState}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">Select State</option>
                {shopStates.map((state) => (
                  <option key={state.name} value={state.name}>{state.name}</option>
                ))}
              </select>
              <select
                name="productCategory"
                value={form.productCategory}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">Select Category</option>
                {shopCategories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                name="productSellerName"
                value={form.productSellerName}
                disabled
                className="input input-bordered bg-gray-100"
              />
              <input
                type="file"
                name="productImage"
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                required
                className="file-input file-input-bordered"
              />
              
              {/* AI-Enhanced Product Description Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Product Description</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={generateAIDescription}
                      disabled={aiLoading || !form.productName.trim()}
                      className="btn btn-sm btn-outline btn-secondary"
                    >
                      {aiLoading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          🤖 Quick AI
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={generateSAPAIDescription}
                      disabled={sapAiLoading || !form.productName.trim()}
                      className="btn btn-sm btn-outline btn-accent"
                    >
                      {sapAiLoading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          SAP AI...
                        </>
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
                  placeholder="Enter product description or use AI to generate one..."
                  value={form.productDescription}
                  onChange={handleChange}
                  required
                  className="textarea textarea-bordered min-h-[120px]"
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
                          className="btn btn-xs btn-primary"
                        >
                          Use This
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiSuggestion("")}
                          className="btn btn-xs btn-ghost"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {aiSuggestion}
                    </p>
                  </div>
                )}

                {/* SAP AI Content Generation Display */}
                {sapAiSuggestion && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg">
                          🧠
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-indigo-900">SAP AI Core Content Generation</h4>
                          <p className="text-xs text-indigo-600">Enterprise-grade content intelligence</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={useSAPAISuggestion}
                          className="btn btn-xs btn-primary"
                        >
                          ✓ Use SAP Content
                        </button>
                        <button
                          type="button"
                          onClick={() => setSapAiSuggestion(null)}
                          className="btn btn-xs btn-ghost"
                        >
                          ✕ Dismiss
                        </button>
                      </div>
                    </div>

                    {/* Generated Description */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-400">
                      <p className="text-sm text-gray-800 leading-relaxed">
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
                              className="bg-indigo-500 h-2 rounded-full"
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
                        <h5 className="font-medium text-sm mb-2 text-indigo-800">📊 Content Analytics</h5>
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
                        <h5 className="font-medium text-sm mb-2 text-indigo-800">💡 SAP AI Recommendations</h5>
                        <ul className="text-sm space-y-1">
                          {sapAiSuggestion.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-indigo-500 mt-1">•</span>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SAP Metadata */}
                    <div className="text-xs text-indigo-600 flex items-center justify-between pt-2 border-t border-indigo-200">
                      <span>🕒 {new Date(sapAiSuggestion.timestamp).toLocaleString()}</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">{sapAiSuggestion.sapVersion}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="text"
                name="productMaterial"
                placeholder="Product Material"
                value={form.productMaterial}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <input
                type="text"
                name="productWeight"
                placeholder="Product Weight"
                value={form.productWeight}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <input
                type="text"
                name="productColor"
                placeholder="Product Color"
                value={form.productColor}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isCodAvailable"
                  checked={form.isCodAvailable}
                  onChange={handleChange}
                  className="checkbox"
                />
                Cash on Delivery Available
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              {msg && <div className="text-center mt-2">{msg}</div>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};