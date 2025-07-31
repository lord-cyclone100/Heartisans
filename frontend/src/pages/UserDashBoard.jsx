import { SignOutButton } from "@clerk/clerk-react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SAPAnalyticsDashboard from "../components/elements/SAPAnalyticsDashboard";
import { FaWallet } from "react-icons/fa";
import { ArtisanPlanModal } from "../components/elements/ArtisanPlanModal";
import { useTranslation } from "react-i18next";

export const UserDashBoard = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userProducts, setUserProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showArtisanPlanModal, setShowArtisanPlanModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/user/${id}`)
      .then((res) => {
        setUser(res.data);
        // If user is an artisan, fetch their products
        if (res.data.isArtisan) {
          axios
            .get("http://localhost:5000/api/shopcards")
            .then((productsRes) => {
              // Filter products by this user (you might want to add a seller ID field)
              const userProducts = productsRes.data.filter(
                (product) =>
                  product.productSellerName === res.data.userName ||
                  product.sellerId === res.data._id
              );
              setUserProducts(userProducts);
              if (userProducts.length > 0) {
                setSelectedProduct(userProducts[0]);
              }
            })
            .catch(() => setUserProducts([]));
        }
      })
      .catch(() => setUser(null));
  }, [id]);

  const handleArtisanStatus = (status) => {
    axios
      .patch(`http://localhost:5000/api/user/${id}/artisan`, {
        isArtisan: status,
      })
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to update status"));
  };

  const handleProtectedRedirect = (path) => {
    if (user?.isArtisan) {
      navigate(path);
    } else {
      setShowModal(true);
    }
  };

  // Product editing handlers
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      productName: product.productName || "",
      productPrice: product.productPrice || 0,
      productDescription: product.productDescription || "",
      productMaterial: product.productMaterial || "",
      productWeight: product.productWeight || 0.1,
      productColor: product.productColor || "",
      productCategory: product.productCategory || "",
      productState: product.productState || "",
      isCodAvailable: product.isCodAvailable || false,
    });
    setUpdateMessage("");
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage("");

    try {
      console.log("Updating product with data:", editForm);
      console.log("Product ID:", editingProduct._id);

      const response = await axios.patch(
        `http://localhost:5000/api/shopcards/${editingProduct._id}`,
        editForm
      );

      console.log("Update response:", response.data);

      // Update the userProducts state with the updated product
      setUserProducts((prev) =>
        prev.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );

      setUpdateMessage("Product updated successfully!");
      setTimeout(() => {
        setEditingProduct(null);
        setUpdateMessage("");
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product. Please try again.";
      setUpdateMessage(`Failed to update: ${errorMessage}`);
    }
    setUpdateLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/shopcards/${productId}`);

        // Remove the product from userProducts state
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
        setUpdateMessage("Product deleted successfully!");
        setTimeout(() => setUpdateMessage(""), 3000);
      } catch (error) {
        setUpdateMessage("Failed to delete product. Please try again.");
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent mx-auto mb-6" style={{ borderColor: '#479626', borderTopColor: 'transparent' }}></div>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold" style={{ color: '#479626' }}>
            {t("dashboard.unauthorized")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        <div className="w-full h-[10vh]"></div>

        {/* User Header */}
        <div className="text-white py-16 relative" style={{ background: 'linear-gradient(to right, #479626, #3d7a20)' }}>
          {/* Wallet Button */}
          <div
            className={`absolute top-6 right-6 ${user.isArtisan || user.isAdmin ? "block" : "hidden"
              }`}
          >
            <NavLink to={`/wallet/${user._id}`}>
              <button className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-white" style={{ backgroundColor: '#ffaf27' }}>
                <FaWallet size={20} className="text-white lg:w-6 lg:h-6" />
              </button>
            </NavLink>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="size-40 lg:size-48 rounded-full bg-white/20 overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src={user.imageUrl}
                  alt={user.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
                  {t("dashboard.welcome")}, {user.userName}!
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {user.email}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {t("dashboard.dateJoined")}:{" "}
                  {user.joiningDate &&
                    new Date(user.joiningDate).toLocaleDateString("en-GB")}
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span
                    className={`px-6 py-3 rounded-2xl text-lg sm:text-xl font-semibold shadow-lg ${user.isArtisan
                      ? "text-white"
                      : "text-white"
                      }`}
                    style={{ backgroundColor: user.isArtisan ? '#ffaf27' : '#6b7280' }}
                  >
                    {user.isArtisan ? "✓ Verified Artisan" : "Regular User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-green-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                {
                  id: "profile",
                  label: t("dashboard.profile") || "Profile",
                  icon: "👤",
                },
                {
                  id: "products",
                  label: t("dashboard.myProducts") || "My Products",
                  icon: "🛍️",
                  artisanOnly: true,
                },
                {
                  id: "manage-products",
                  label: t("dashboard.manageProducts") || "Manage Products",
                  icon: "✏️",
                  artisanOnly: true,
                },
                {
                  id: "analytics",
                  label: "SAP Analytics",
                  icon: "📊",
                  artisanOnly: true,
                },
                {
                  id: "actions",
                  label: t("dashboard.quickActions") || "Quick Actions",
                  icon: "⚡",
                },
              ].map(
                (tab) =>
                  (!tab.artisanOnly || user.isArtisan) && (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-6 px-4 border-b-4 font-bold text-lg sm:text-xl transition-all duration-300 ${activeTab === tab.id
                        ? "text-white"
                        : "border-transparent text-gray-500 hover:bg-gray-50"
                        }`}
                      style={activeTab === tab.id ? { borderColor: '#479626', backgroundColor: '#479626' } : { borderColor: 'transparent' }}
                    >
                      <span className="mr-3 text-xl">{tab.icon}</span>
                      {tab.label}
                    </button>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl p-12" style={{ border: '1px solid #479626' }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-12 text-gray-900">
                {t("dashboard.profileSettings") || "Profile Settings"}
              </h2>
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-gray-700 font-bold text-xl sm:text-2xl lg:text-3xl mb-4">
                      {t("dashboard.username") || "Username"}
                    </label>
                    <input
                      type="text"
                      value={user.userName}
                      disabled
                      className="w-full p-6 border-2 rounded-2xl bg-gray-50 text-lg sm:text-xl lg:text-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-xl sm:text-2xl lg:text-3xl mb-4">
                      {t("dashboard.email") || "Email"}
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full p-6 border-2 rounded-2xl bg-gray-50 text-lg sm:text-xl lg:text-2xl"
                    />
                  </div>
                </div>

                <div className="border-t-2 border-green-100 pt-12">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-gray-900">
                    {t("dashboard.artisanStatus") || "Artisan Status"}
                  </h3>
                  <div className="flex gap-6">
                    <button
                      className={`px-8 py-4 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${user.isArtisan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl"
                        }`}
                      disabled={user.isArtisan}
                      onClick={() => handleArtisanStatus(true)}
                    >
                      {user.isArtisan
                        ? "✓ Artisan Verified"
                        : t("dashboard.applyArtisan")}
                    </button>
                    {user.isArtisan && (
                      <button
                        className="px-8 py-4 rounded-2xl font-bold text-xl sm:text-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        onClick={() => handleArtisanStatus(false)}
                      >
                        {t("dashboard.revoke")}
                      </button>
                    )}
                  </div>
                  {user.isArtisan && (
                    <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
                      <p className="text-green-800 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                        🎉{" "}
                        {t("dashboard.congratulations") ||
                          "Congratulations! You have access to advanced features including product analytics, seller tools, and SAP business intelligence."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons in Profile */}
                <div className="border-t-2 border-green-100 pt-12">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-gray-900">
                    {t("dashboard.quickActions") || "Quick Actions"}
                  </h3>
                  <div className="flex gap-6 flex-wrap">
                    <button
                      className="px-8 py-4 rounded-2xl font-bold text-xl sm:text-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      onClick={() => handleProtectedRedirect("/auctionform")}
                    >
                      {t("dashboard.startAuction")}
                    </button>
                    <button
                      className="px-8 py-4 rounded-2xl font-bold text-xl sm:text-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      onClick={() => handleProtectedRedirect("/sellform")}
                    >
                      {t("dashboard.sellOnHeartisans")}
                    </button>
                    <button
                      className={`px-8 py-4 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${!user.isArtisan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : user.hasArtisanSubscription
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        }`}
                      disabled={!user.isArtisan || user.hasArtisanSubscription}
                      onClick={() =>
                        user.isArtisan &&
                        !user.hasArtisanSubscription &&
                        setShowArtisanPlanModal(true)
                      }
                      title={
                        !user.isArtisan
                          ? t("dashboard.becomeArtisan")
                          : user.hasArtisanSubscription
                            ? t("dashboard.subscribed")
                            : t("dashboard.artisanPlan")
                      }
                    >
                      {user.hasArtisanSubscription
                        ? t("dashboard.subscribed")
                        : t("dashboard.artisanPlan")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Products Tab */}
          {activeTab === "products" && user.isArtisan && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-12 text-gray-900">
                {t("dashboard.myProducts") || "My Products"}
              </h2>
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userProducts.map((product) => (
                    <div
                      key={product._id}
                      className="border-2 border-green-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <img
                        src={product.productImageUrl}
                        alt={product.productName}
                        className="w-full h-48 object-cover rounded-2xl mb-6 shadow-lg"
                      />
                      <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-4 text-gray-900 leading-tight">
                        {product.productName}
                      </h3>
                      <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-4">
                        {product.productCategory}
                      </p>
                      <p className="text-green-600 font-bold text-2xl sm:text-3xl lg:text-4xl mb-6">
                        ₹{product.productPrice.toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveTab("analytics");
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        {t("dashboard.viewAnalytics") || "View Analytics"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
                  <div className="text-6xl mb-8">📦</div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600 mb-6">
                    {t("dashboard.noProducts") || "No Products Yet"}
                  </h3>
                  <p className="text-gray-500 text-xl sm:text-2xl lg:text-3xl mb-12 max-w-2xl mx-auto leading-relaxed">
                    {t("dashboard.startSelling") ||
                      "Start selling your handcrafted items to see them here"}
                  </p>
                  <button
                    onClick={() => handleProtectedRedirect("/sellform")}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    {t("dashboard.addFirstProduct") || "Add Your First Product"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SAP Analytics Tab */}
          {activeTab === "analytics" && user.isArtisan && (
            <div className="space-y-12">
              {userProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-12 text-gray-900">
                    {t("dashboard.selectProduct") ||
                      "Select Product for Analytics"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {userProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => setSelectedProduct(product)}
                        className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${selectedProduct?._id === product._id
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          }`}
                      >
                        <img
                          src={product.productImageUrl}
                          alt={product.productName}
                          className="w-full h-32 object-cover rounded-2xl mb-6 shadow-lg"
                        />
                        <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-3 leading-tight">
                          {product.productName}
                        </h3>
                        <p className="text-green-600 font-bold text-xl sm:text-2xl lg:text-3xl">
                          ₹{product.productPrice.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                  <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 p-12 border-b border-green-200">
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4">
                      SAP Analytics: {selectedProduct.productName}
                    </h3>
                    <p className="text-gray-600 text-xl sm:text-2xl lg:text-3xl">
                      {t("dashboard.enterpriseInsights") ||
                        "Get enterprise-grade insights for your product"}
                    </p>
                  </div>
                  <SAPAnalyticsDashboard
                    productData={{
                      name: selectedProduct.productName,
                      category: selectedProduct.productCategory,
                      material: selectedProduct.productMaterial,
                      region: selectedProduct.productState,
                      basePrice: selectedProduct.productPrice,
                      seller: selectedProduct.productSellerName,
                      weight: selectedProduct.productWeight,
                      color: selectedProduct.productColor,
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-green-100">
                  <div className="text-6xl mb-8">📊</div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-600 mb-6">
                    {t("dashboard.noProductSelected") || "No Product Selected"}
                  </h3>
                  <p className="text-gray-500 text-xl sm:text-2xl lg:text-3xl leading-relaxed">
                    {t("dashboard.selectProductAbove") ||
                      "Select a product above to view its analytics"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Tab */}
          {/* Quick Actions Tab */}
          {activeTab === "actions" && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-12 text-gray-900">
                {t("dashboard.quickActions") || "Quick Actions"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">🛍️</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {t("dashboard.sellProducts") || "Sell Products"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {t("dashboard.listHandcrafted") ||
                      "List your handcrafted items on the marketplace"}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    onClick={() => handleProtectedRedirect("/sellform")}
                  >
                    {t("dashboard.startSelling") || "Start Selling"}
                  </button>
                </div>

                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">🏺</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {t("dashboard.startAuction") || "Start Auction"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {t("dashboard.createAuctions") ||
                      "Create auctions for unique or limited items"}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    onClick={() => handleProtectedRedirect("/auctionform")}
                  >
                    {t("dashboard.createAuction") || "Create Auction"}
                  </button>
                </div>

                {/* New Dashboard Card */}
                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">📊</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {user.isArtisan ? "Seller Dashboard" : "Buyer Dashboard"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {user.isArtisan
                      ? "Track sales, orders, and business performance"
                      : "View purchase history and account analytics"}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    onClick={() => {
                      if (user.isArtisan) {
                        navigate(`/dashboard/seller/${user._id}`);
                      } else {
                        navigate(`/dashboard/buyer/${user._id}`);
                      }
                    }}
                  >
                    {"View Dashboard"}
                  </button>
                </div>
                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">🛒</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {t("dashboard.myCart") || "My Cart"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {t("dashboard.manageCart") || "View and manage your shopping cart efficiently"}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    onClick={() => navigate("/cart")}
                  >
                    {t("dashboard.goToCart") || "Go to Cart"}
                  </button>
                </div>

                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">🏪</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {t("dashboard.browseShop") || "Browse Shop"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {t("dashboard.discoverProducts") ||
                      "Discover Handcrafted Treasures"}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    onClick={() => navigate("/shop")}
                  >
                    {t("dashboard.browseProducts") || "Browse Products"}
                  </button>
                </div>

                <div className="p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-5xl mb-6">🚪</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
                    {t("dashboard.signOut") || "Sign Out"}
                  </h3>
                  <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed">
                    {t("dashboard.secureLogout") ||
                      "Securely log out of your account"}
                  </p>
                  <SignOutButton>
                    <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                      {t("auth.logout") || "Log Out"}
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === "manage-products" && user.isArtisan && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100">
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-gray-900">
                  {t("dashboard.manageProducts") || "Manage Products"}
                </h2>
                <p className="text-gray-600 text-xl sm:text-2xl lg:text-3xl">
                  {t("dashboard.editDeleteProducts") ||
                    "Edit and manage your listed products"}
                </p>
              </div>

              {updateMessage && (
                <div
                  className={`mb-8 p-6 rounded-xl border-2 ${updateMessage.includes("success")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                    }`}
                >
                  <p className="text-lg font-semibold">{updateMessage}</p>
                </div>
              )}

              {editingProduct ? (
                // Edit Product Form
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-200">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      Edit Product: {editingProduct.productName}
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={editForm.productName}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="productPrice"
                          value={editForm.productPrice}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Category
                        </label>
                        <select
                          name="productCategory"
                          value={editForm.productCategory}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Art">Art</option>
                          <option value="Pottery">Pottery</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Crafts">Crafts</option>
                          <option value="Crochet">Crochet</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Material
                        </label>
                        <input
                          type="text"
                          name="productMaterial"
                          value={editForm.productMaterial}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="productWeight"
                          value={editForm.productWeight}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          step="0.1"
                          min="0.1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          Color
                        </label>
                        <input
                          type="text"
                          name="productColor"
                          value={editForm.productColor}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold text-lg mb-3">
                          State
                        </label>
                        <select
                          name="productState"
                          value={editForm.productState}
                          onChange={handleEditFormChange}
                          className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg"
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
                          <option value="Kerala">Kerala</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="isCodAvailable"
                            checked={editForm.isCodAvailable}
                            onChange={handleEditFormChange}
                            className="w-5 h-5 text-green-600 border-2 border-green-300 rounded focus:ring-green-500"
                          />
                          <label className="text-gray-700 font-bold text-lg">
                            Cash on Delivery Available
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-lg mb-3">
                        Description
                      </label>
                      <textarea
                        name="productDescription"
                        value={editForm.productDescription}
                        onChange={handleEditFormChange}
                        rows="4"
                        className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white text-lg resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:transform-none disabled:shadow-lg"
                      >
                        {updateLoading ? "Updating..." : "Update Product"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Products List
                <div>
                  {userProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {userProducts.map((product) => (
                        <div
                          key={product._id}
                          className="border-2 border-green-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50"
                        >
                          <img
                            src={product.productImageUrl}
                            alt={product.productName}
                            className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
                          />
                          <h3 className="font-bold text-xl mb-2 text-gray-900 leading-tight">
                            {product.productName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {product.productCategory}
                          </p>
                          <p className="text-green-600 font-bold text-2xl mb-4">
                            ₹{product.productPrice.toLocaleString()}
                          </p>
                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                            {product.productDescription}
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
                      <div className="text-6xl mb-8">📦</div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600 mb-6">
                        No Products Yet
                      </h3>
                      <p className="text-gray-500 text-xl sm:text-2xl lg:text-3xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Start selling your handcrafted items to manage them here
                      </p>
                      <button
                        onClick={() => handleProtectedRedirect("/sellform")}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-4 border border-green-200">
            <div className="text-6xl mb-8">🔒</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-gray-900">
              {t("dashboard.artisanRequired") || "Artisan Access Required"}
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-12 leading-relaxed">
              {t("dashboard.mustBeArtisan") ||
                "You must be a verified artisan to use this feature. Apply for artisan status to unlock advanced tools and analytics."}
            </p>
            <div className="flex gap-6">
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                onClick={() => {
                  setShowModal(false);
                  setActiveTab("profile");
                }}
              >
                {t("dashboard.applyArtisan") || "Apply as Artisan"}
              </button>
              <button
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-2xl font-bold text-lg sm:text-xl hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => setShowModal(false)}
              >
                {t("common.close") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ArtisanPlanModal
        isOpen={showArtisanPlanModal}
        onClose={() => setShowArtisanPlanModal(false)}
        user={user}
      />
    </>
  );
};
