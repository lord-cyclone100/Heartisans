import { useEffect, useState } from "react"
import axios from "axios"
import SAPAnalyticsDashboard from "../components/elements/SAPAnalyticsDashboard"

export const AdminPanel = () => {
  const [cards, setCards] = useState([])
  const [users, setUsers] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(()=>{
    // Fetch products
    axios.get("http://localhost:5000/api/shopcards")
    .then(res=>{
      setCards(res.data)
      if(res.data.length > 0) setSelectedProduct(res.data[0])
    })
    .catch(()=>setCards([]))
    
    // Fetch users (admin function)
    axios.get("http://localhost:5000/api/users")
    .then(res=>setUsers(res.data))
    .catch(()=>setUsers([]))
  },[])
  
  const totalRevenue = cards.reduce((sum, card) => sum + (card.productPrice || 0), 0)
  const artisans = users.filter(user => user.isArtisan)
  
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-indigo-100">Platform management and SAP business intelligence</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-2xl font-bold">{cards.length}</h3>
                <p className="text-indigo-200">Total Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-2xl font-bold">{users.length}</h3>
                <p className="text-indigo-200">Total Users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-2xl font-bold">{artisans.length}</h3>
                <p className="text-indigo-200">Verified Artisans</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-indigo-200">Total Inventory Value</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'products', label: 'Product Management', icon: '🛍️' },
                  { id: 'users', label: 'User Management', icon: '👥' },
                  { id: 'analytics', label: 'SAP Analytics', icon: '📈' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
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
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Platform Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
                      <div className="space-y-3">
                        {cards.slice(0, 5).map((card) => (
                          <div key={card._id} className="flex items-center space-x-3">
                            <img src={card.productImageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{card.productName}</p>
                              <p className="text-xs text-gray-600">₹{card.productPrice}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Active Products:</span>
                          <span className="font-semibold">{cards.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <span className="font-semibold">{users.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Artisans:</span>
                          <span className="font-semibold">{artisans.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Product Price:</span>
                          <span className="font-semibold">
                            ₹{cards.length > 0 ? Math.round(totalRevenue / cards.length) : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Product Management</h2>
                    <span className="text-gray-600">{cards.length} products total</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                      <div key={card._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img 
                          src={card.productImageUrl} 
                          alt={card.productName}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-sm mb-1">{card.productName}</h3>
                        <p className="text-xs text-gray-600 mb-1">{card.productCategory}</p>
                        <p className="text-xs text-gray-600 mb-2">Seller: {card.productSellerName}</p>
                        <p className="text-blue-600 font-bold">₹{card.productPrice}</p>
                        <button
                          onClick={() => {
                            setSelectedProduct(card);
                            setActiveTab('analytics');
                          }}
                          className="mt-2 w-full bg-indigo-600 text-white py-1 px-2 rounded text-xs hover:bg-indigo-700 transition-colors"
                        >
                          View Analytics
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <span className="text-gray-600">{users.length} users total</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isArtisan 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isArtisan ? 'Artisan' : 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.joiningDate && new Date(user.joiningDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">SAP Analytics Cloud - Admin View</h2>
                  
                  {cards.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Select Product for Analysis</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {cards.map((card) => (
                          <div
                            key={card._id}
                            onClick={() => setSelectedProduct(card)}
                            className={`cursor-pointer p-2 rounded border-2 transition-all ${
                              selectedProduct?._id === card._id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <img
                              src={card.productImageUrl}
                              alt={card.productName}
                              className="w-full h-16 object-cover rounded mb-1"
                            />
                            <p className="text-xs font-medium truncate">{card.productName}</p>
                            <p className="text-xs text-indigo-600">₹{card.productPrice}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedProduct ? (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b">
                        <h3 className="text-lg font-bold">
                          Admin Analytics: {selectedProduct.productName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Comprehensive business intelligence for platform optimization
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
                          color: selectedProduct.productColor
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Product</h3>
                      <p className="text-gray-500">Choose a product above to view detailed analytics</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {cards.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
              <p className="text-gray-500">Platform data will appear here once products and users are added</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}