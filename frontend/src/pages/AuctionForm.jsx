import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useScrollToTop } from "../hooks/useScrollToTop";

export const AuctionForm = () => {
  const { user } = useUser();
  const [mongoUserId, setMongoUserId] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productImage: null,
    productMaterial: "",
    productWeight: "",
    productColor: "",
    basePrice: "",
    startTime: "",
    duration: "",
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

  useScrollToTop();

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      axios.get(`http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`)
        .then(res => setMongoUserId(res.data._id))
        .catch(() => setMongoUserId(""));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
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
        productCategory: "Auction Item",
        productState: "India",
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        additionalInfo: `Auction item with base price ${form.basePrice}. ${form.productDescription}`
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

  // Generate SAP AI content for auction items
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
        productCategory: "Auction Item",
        productState: "India",
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        listingType: "auction",
        basePrice: form.basePrice,
        additionalInfo: `Auction item with base price ${form.basePrice}. Duration: ${form.duration}. ${form.productDescription}`
      });

      if (response.data.success) {
        setSapAiSuggestion(response.data.data);
        setMsg("SAP AI content generated with enterprise analytics!");
      } else {
        throw new Error('Failed to generate SAP AI content');
      }
    } catch (error) {
      console.error('SAP AI Generation Error:', error);
      setMsg("Failed to generate SAP AI content. Please try again.");
    } finally {
      setSapAiLoading(false);
    }
  };

  const useSAPAISuggestion = () => {
    if (sapAiSuggestion?.description) {
      setForm({ ...form, productDescription: sapAiSuggestion.description });
      setSapAiSuggestion(null);
      setMsg("SAP AI description applied! Enterprise-grade content is now active.");
    }
  };

  // Generate SAP AI price prediction for auction base price
  const generateSAPPricePrediction = async () => {
    if (!form.productName) {
      setMsg("Please fill in product name first");
      return;
    }

    setIsPredictingPrice(true);
    setMsg("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/predict-price", {
        productName: form.productName,
        productCategory: "Auction Item",
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        isHandmade: true,
        region: "India"
      });

      if (response.data.success) {
        setPricePrediction(response.data.data);
        setShowPricingInsights(true);
        
        // Suggest base price as 70% of recommended price for auction
        const suggestedBasePrice = Math.round(response.data.data.suggestedPrice * 0.7);
        setForm(prev => ({ 
          ...prev, 
          basePrice: suggestedBasePrice.toString() 
        }));
        
        setMsg("SAP AI auction pricing generated! Base price set to 70% of market value.");
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

  const useSAPPrice = (price, percentage = 0.7) => {
    const adjustedPrice = Math.round(price * percentage);
    setForm({ ...form, basePrice: adjustedPrice.toString() });
    setMsg(`SAP AI suggested base price applied! (${Math.round(percentage * 100)}% of market value)`);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // 1. Get Cloudinary signature from backend
      const sigRes = await axios.get("http://localhost:5000/api/cloudinary-signature");
      const { signature, timestamp, apiKey, cloudName } = sigRes.data;

      // 2. Upload image to Cloudinary
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

      // 3. Send auction data to backend
      const payload = {
        productName: form.productName,
        productDescription: form.productDescription,
        productImageUrl: imageUrl,
        productMaterial: form.productMaterial,
        productWeight: form.productWeight,
        productColor: form.productColor,
        sellerId: mongoUserId,
        sellerName: user?.fullName,
        basePrice: Number(form.basePrice),
        startTime: new Date(form.startTime),
        duration: Number(form.duration), // in seconds or minutes
      };
      await axios.post("http://localhost:5000/api/auctions", payload);
      setMsg("Auction created successfully!");
      setForm({
        productName: "",
        productDescription: "",
        productImage: null,
        productMaterial: "",
        productWeight: "",
        productColor: "",
        basePrice: "",
        startTime: "",
        duration: "",
      });
    } catch (err) {
      setMsg("Failed to create auction.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen py-20" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0, #e8f5e8)' }}>
        <div className="w-full h-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4">
              Start an Auction
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto">
              Create an exciting auction for your handcrafted items. Set your terms and let bidders compete for your unique artisan products.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #479626' }}>
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
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl transition-all duration-300 text-lg"
                    style={{ '--focus-ring-color': '#479626' }}
                    onFocus={(e) => e.target.style.borderColor = '#479626'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                
                {/* <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    placeholder="Enter starting bid amount"
                    value={form.basePrice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div> */}



              {/* Base Price Section with SAP AI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Base Price (₹) *
                  </label>
                  <button
                    type="button"
                    onClick={generateSAPPricePrediction}
                    disabled={isPredictingPrice || !form.productName.trim()}
                    className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPredictingPrice ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                        SAP AI Analyzing...
                      </div>
                    ) : (
                      <>
                        🧠 SAP AI Base Price
                      </>
                    )}
                  </button>
                </div>
                
                <input
                  type="number"
                  name="basePrice"
                  placeholder="Enter starting bid amount for auction"
                  value={form.basePrice}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                />
                
                {/* SAP AI Auction Pricing Insights */}
                {pricePrediction && showPricingInsights && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-600 text-white p-3 rounded-lg">
                          🎯
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-purple-900">SAP AI Auction Intelligence</h3>
                          <p className="text-sm text-purple-600">Optimized for auction dynamics</p>
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

                    {/* Auction-specific metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Market Value */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Market Value</h4>
                        <p className="text-xl font-bold text-green-600">₹{pricePrediction.suggestedPrice?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">SAP AI Estimate</p>
                      </div>

                      {/* Suggested Base Price */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Auction Base Price</h4>
                        <p className="text-xl font-bold text-purple-600">₹{Math.round(pricePrediction.suggestedPrice * 0.7)?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">70% of market value</p>
                        <button
                          type="button"
                          onClick={() => useSAPPrice(pricePrediction.suggestedPrice, 0.7)}
                          className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 mt-2"
                        >
                          Use This Base
                        </button>
                      </div>

                      {/* Expected Final Price */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-sm text-gray-600 mb-2">Expected Final Price</h4>
                        <p className="text-xl font-bold text-blue-600">₹{Math.round(pricePrediction.suggestedPrice * 1.2)?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">120% of market value</p>
                      </div>
                    </div>

                    {/* Auction Strategy Options */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
                      <h4 className="font-semibold mb-3 text-purple-800">🎯 SAP AI Auction Strategies</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => useSAPPrice(pricePrediction.suggestedPrice, 0.6)}
                          className="px-4 py-3 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <div className="text-left">
                            <div className="font-medium">Aggressive Start</div>
                            <div className="text-xs">60% base (₹{Math.round(pricePrediction.suggestedPrice * 0.6)?.toLocaleString()})</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => useSAPPrice(pricePrediction.suggestedPrice, 0.7)}
                          className="px-4 py-3 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <div className="text-left">
                            <div className="font-medium">Balanced Start</div>
                            <div className="text-xs">70% base (₹{Math.round(pricePrediction.suggestedPrice * 0.7)?.toLocaleString()})</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => useSAPPrice(pricePrediction.suggestedPrice, 0.8)}
                          className="px-4 py-3 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                          <div className="text-left">
                            <div className="font-medium">Conservative Start</div>
                            <div className="text-xs">80% base (₹{Math.round(pricePrediction.suggestedPrice * 0.8)?.toLocaleString()})</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* SAP Auction Insights */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <h4 className="font-semibold mb-2 text-purple-800">📊 SAP Auction Analytics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Bidding Activity Forecast</h5>
                          {pricePrediction.sapBusinessInsights?.demandForecast && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${pricePrediction.sapBusinessInsights.demandForecast.score}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{pricePrediction.sapBusinessInsights.demandForecast.score}/100</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Competition Level</h5>
                          <span className="badge badge-secondary">
                            {pricePrediction.sapBusinessInsights?.competitiveAnalysis?.competitorCount || 15} competitors expected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SAP Metadata */}
                    <div className="mt-4 pt-4 border-t border-purple-200 text-xs text-purple-600 flex items-center justify-between">
                      <span>🕒 {new Date(pricePrediction.timestamp).toLocaleString()}</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                        <span className="font-medium">{pricePrediction.sapVersion}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>




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
                  placeholder="Describe your product, its features, craftsmanship, and what makes it special for auction..."
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
                      onClick={generateAIDescription}
                      disabled={aiLoading || !form.productName.trim()}
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
                      onClick={generateSAPAIDescription}
                      disabled={sapAiLoading || !form.productName.trim()}
                      className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-lg hover:bg-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sapAiLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
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
                  placeholder="Describe your product, its features, craftsmanship, and what makes it special for auction..."
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
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {aiSuggestion}
                    </p>
                  </div>
                )}

                {/* SAP AI Content Generation Display */}
                {sapAiSuggestion && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-600 text-white p-2 rounded-lg">
                          🏆
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-orange-900">SAP AI Auction Content</h4>
                          <p className="text-xs text-orange-600">Enterprise auction intelligence</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={useSAPAISuggestion}
                          className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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
                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {sapAiSuggestion.description}
                      </p>
                    </div>

                    {/* Auction-Specific SAP Analytics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Auction Appeal</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.auctionAppeal || 89}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.auctionAppeal || 89}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Bidding Potential</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.biddingPotential || 92}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.biddingPotential || 92}/100</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border">
                        <h5 className="text-xs font-medium text-gray-600 mb-1">Urgency Factor</h5>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${sapAiSuggestion.sapContentMetrics?.urgencyFactor || 85}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{sapAiSuggestion.sapContentMetrics?.urgencyFactor || 85}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* SAP Metadata */}
                    <div className="text-xs text-orange-600 flex items-center justify-between pt-2 border-t border-orange-200">
                      <span>🕒 {new Date(sapAiSuggestion.timestamp).toLocaleString()}</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
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
                    Material *
                  </label>
                  <input
                    type="text"
                    name="productMaterial"
                    placeholder="e.g., Wood, Clay, Cotton"
                    value={form.productMaterial}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Weight (grams)
                  </label>
                  <input
                    type="text"
                    name="productWeight"
                    placeholder="Enter weight in grams"
                    value={form.productWeight}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Primary Color
                  </label>
                  <input
                    type="text"
                    name="productColor"
                    placeholder="e.g., Brown, Blue, Multicolor"
                    value={form.productColor}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
              </div>

              {/* Auction Timing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Auction Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-base sm:text-lg font-medium text-gray-700">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="e.g., 60 for 1 hour"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>
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
                      Creating Auction...
                    </div>
                  ) : (
                    'Start Auction'
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
                    <span className="font-medium text-base sm:text-lg">{msg}</span>
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