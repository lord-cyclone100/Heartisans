import { SignOutButton } from "@clerk/clerk-react"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SAPAnalyticsDashboard from "../components/elements/SAPAnalyticsDashboard";

export const UserDashBoard = () => {
  const [user,setUser] = useState(null)
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userProducts, setUserProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  // console.log(typeof id);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/user/${id}`)
    .then(res=>{
      setUser(res.data)
      // If user is an artisan, fetch their products
      if(res.data.isArtisan) {
        axios.get("http://localhost:5000/api/shopcards")
        .then(productsRes => {
          // Filter products by this user (you might want to add a seller ID field)
          const userProducts = productsRes.data.filter(product => 
            product.productSellerName === res.data.userName || 
            product.sellerId === res.data._id
          );
          setUserProducts(userProducts);
          if(userProducts.length > 0) {
            setSelectedProduct(userProducts[0]);
          }
        })
        .catch(() => setUserProducts([]));
      }
    })
    .catch(()=>setUser(null))
  },[id])

  const handleArtisanStatus = (status) => {
    axios.patch(`http://localhost:5000/api/user/${id}/artisan`, { isArtisan: status })
      .then(res => setUser(res.data))
      .catch(() => alert("Failed to update status"));
  };

  const handleProtectedRedirect = (path) => {
    if (user.isArtisan) {
      navigate(path);
    } else {
      setShowModal(true);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Unauthorized or loading...</div>;
  }

  return(
    <>
    <section className="min-h-screen bg-gray-50">
      <div className="w-full h-[10vh]"></div>
      
      {/* User Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="size-32 rounded-full bg-white/20 overflow-hidden border-4 border-white/30">
              <img src={user.imageUrl} alt={user.userName} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.userName}!</h1>
              <p className="text-blue-100 mb-2">{user.email}</p>
              <p className="text-blue-200 text-sm">
                Member since: {user.joiningDate && new Date(user.joiningDate).toLocaleDateString('en-GB')}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.isArtisan ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'
                }`}>
                  {user.isArtisan ? '✓ Verified Artisan' : 'Regular User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'products', label: 'My Products', icon: '🛍️', artisanOnly: true },
              { id: 'analytics', label: 'SAP Analytics', icon: '📊', artisanOnly: true },
              { id: 'actions', label: 'Quick Actions', icon: '⚡' }
            ].map((tab) => (
              (!tab.artisanOnly || user.isArtisan) && (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Username</label>
                  <input type="text" value={user.userName} disabled className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input type="email" value={user.email} disabled className="w-full p-3 border rounded-lg bg-gray-50" />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Artisan Status</h3>
                <div className="flex gap-4">
                  <button
                    className="btn btn-success"
                    disabled={user.isArtisan}
                    onClick={() => handleArtisanStatus(true)}
                  >
                    {user.isArtisan ? '✓ Artisan Verified' : 'Apply as Artisan'}
                  </button>
                  {user.isArtisan && (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleArtisanStatus(false)}
                    >
                      Revoke Artisan Status
                    </button>
                  )}
                </div>
                {user.isArtisan && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-sm">
                      🎉 Congratulations! You have access to advanced features including product analytics, seller tools, and SAP business intelligence.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Products Tab */}
        {activeTab === 'products' && user.isArtisan && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">My Products</h2>
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img 
                      src={product.productImageUrl} 
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.productName}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.productCategory}</p>
                    <p className="text-blue-600 font-bold text-lg">₹{product.productPrice}</p>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveTab('analytics');
                      }}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">No Products Yet</h3>
                <p className="text-gray-500 mb-6">Start selling your handcrafted items to see them here</p>
                <button
                  onClick={() => handleProtectedRedirect("/sellform")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* SAP Analytics Tab */}
        {activeTab === 'analytics' && user.isArtisan && (
          <div className="space-y-6">
            {userProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Select Product for Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => setSelectedProduct(product)}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedProduct?._id === product._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={product.productImageUrl}
                        alt={product.productName}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-semibold text-sm truncate">{product.productName}</h3>
                      <p className="text-blue-600 font-bold text-sm">₹{product.productPrice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedProduct ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">
                    SAP Analytics: {selectedProduct.productName}
                  </h3>
                  <p className="text-gray-600">Get enterprise-grade insights for your product</p>
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
                    color: selectedProduct.productColor
                  }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">No Product Selected</h3>
                <p className="text-gray-500">Select a product above to view its analytics</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'actions' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🛍️</div>
                <h3 className="text-lg font-semibold mb-2">Sell Products</h3>
                <p className="text-gray-600 text-sm mb-4">List your handcrafted items on the marketplace</p>
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleProtectedRedirect("/sellform")}
                >
                  Start Selling
                </button>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🏺</div>
                <h3 className="text-lg font-semibold mb-2">Start Auction</h3>
                <p className="text-gray-600 text-sm mb-4">Create auctions for unique or limited items</p>
                <button
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => handleProtectedRedirect("/auctionform")}
                >
                  Create Auction
                </button>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">SAP Analytics</h3>
                <p className="text-gray-600 text-sm mb-4">View comprehensive business intelligence</p>
                <button
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => navigate("/sap-analytics")}
                >
                  View Analytics
                </button>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2">My Cart</h3>
                <p className="text-gray-600 text-sm mb-4">View and manage your shopping cart</p>
                <button
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  onClick={() => navigate("/cart")}
                >
                  Go to Cart
                </button>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold mb-2">Browse Shop</h3>
                <p className="text-gray-600 text-sm mb-4">Discover amazing handcrafted products</p>
                <button
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => navigate("/shop")}
                >
                  Browse Products
                </button>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🚪</div>
                <h3 className="text-lg font-semibold mb-2">Sign Out</h3>
                <p className="text-gray-600 text-sm mb-4">Securely log out of your account</p>
                <SignOutButton>
                  <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Log Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-4">Artisan Access Required</h2>
            <p className="text-gray-600 mb-6">You must be a verified artisan to use this feature. Apply for artisan status to unlock advanced tools and analytics.</p>
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={() => {
                  setShowModal(false);
                  setActiveTab('profile');
                }}
              >
                Apply as Artisan
              </button>
              <button 
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}