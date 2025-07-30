import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiBarChart2,
  FiStar,
  FiPackage,
  FiClock
} from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SellerDashboard = () => {
  const { t } = useTranslation();
  const { id: sellerId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!sellerId) {
          throw new Error('Seller ID is not available');
        }
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://localhost:5000/api/analytics/seller/${sellerId}?range=${timeRange}`
        );
        if (!res.data) {
          throw new Error('No data received from server');
        }
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [sellerId, timeRange]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer div for navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-300 rounded-md w-72 mb-4 animate-pulse"></div> {/* Increased size */}
          <div className="h-6 bg-gray-200 rounded-md w-60 animate-pulse"></div> {/* Increased size */}
        </div>
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div> {/* Increased size */}
                <div className="ml-4 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div> {/* Increased size */}
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div> {/* Increased size */}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <div className="h-8 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div> {/* Increased size */}
              <div className="h-80 bg-gray-100 rounded animate-pulse"></div> {/* Increased size */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer div for navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="p-8 text-red-600 bg-red-100 rounded-lg shadow-md mx-auto w-[80%] mt-8 text-2xl"> {/* Increased text size */}
        <h3 className="font-semibold text-3xl mb-4">{t('dashboard.errorLoading')}</h3> {/* Increased text size */}
        <p>{error}</p>
        <p className="mt-4 text-xl"> {/* Increased text size */}
          {t('dashboard.errorMessage')}
        </p>
      </div>
    </div>
  );

  if (!analytics) return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer div for navbar */}
      <div className="w-full h-[10vh]"></div>
      <div className="p-8 text-gray-600 bg-white rounded-lg shadow-md mx-auto w-[80%] mt-8 text-center text-2xl"> {/* Increased text size */}
        <FiShoppingBag className="mx-auto h-20 w-20 text-gray-400 mb-6" /> {/* Increased icon size */}
        <h3 className="font-semibold text-3xl mb-4">{t('dashboard.noAnalyticsData')}</h3> {/* Increased text size */}
        <p>{t('dashboard.noSalesDataFound')}</p>
      </div>
    </div>
  );

  const conversionRate = analytics.totalOrders > 0 ?
    ((analytics.totalOrders / (analytics.totalOrders * 4)) * 100).toFixed(1) : 0; // Assuming page views are 4 times total orders for conversion rate

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer div to push content down, matching the height used by your navbar */}
      <div className="w-full h-[10vh]"></div> 
      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"> {/* Increased margin */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900">{t('dashboard.title')}</h1> {/* Increased text size */}
            <p className="mt-2 text-3xl text-gray-600">{t('dashboard.subtitle')}</p> {/* Increased text size */}
          </div>
          <div className="mt-6 md:mt-0 flex space-x-3"> {/* Increased margin and space */}
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-lg text-xl font-medium ${timeRange === 'weekly' // Increased text size and padding
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
              {t('dashboard.weekly')}
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-lg text-xl font-medium ${timeRange === 'monthly' // Increased text size and padding
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
              {t('dashboard.monthly')}
            </button>
            <button
              onClick={() => setTimeRange('yearly')}
              className={`px-4 py-2 rounded-lg text-xl font-medium ${timeRange === 'yearly' // Increased text size and padding
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
              {t('dashboard.yearly')}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8"> {/* Increased margin */}
          <nav className="-mb-px flex space-x-10"> {/* Increased space */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-medium text-2xl ${activeTab === 'overview' // Increased text size and padding
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t('dashboard.overview')}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-medium text-2xl ${activeTab === 'products' // Increased text size and padding
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t('dashboard.products')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap py-4 px-2 border-b-2 font-medium text-2xl ${activeTab === 'orders' // Increased text size and padding
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {t('dashboard.orders')}
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8"> {/* Increased space */}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased gap */}
              {/* Total Revenue Card */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600"> {/* Increased padding */}
                    <FiDollarSign className="h-6 w-6" /> {/* Increased icon size */}
                  </div>
                  <div className="ml-4"> {/* Increased margin */}
                    <h3 className="text-xl font-medium text-gray-500">{t('dashboard.totalRevenue')}</h3> {/* Increased text size */}
                    <p className="text-3xl font-semibold text-gray-900"> {/* Increased text size */}
                      ₹{analytics.totalRevenue?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
              {/* Total Orders Card */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50 text-green-600"> {/* Increased padding */}
                    <FiShoppingBag className="h-6 w-6" /> {/* Increased icon size */}
                  </div>
                  <div className="ml-4"> {/* Increased margin */}
                    <h3 className="text-xl font-medium text-gray-500">{t('dashboard.totalOrders')}</h3> {/* Increased text size */}
                    <p className="text-3xl font-semibold text-gray-900"> {/* Increased text size */}
                      {analytics.totalOrders || 0}
                    </p>
                  </div>
                </div>
              </div>
              {/* Average Order Value Card */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-600"> {/* Increased padding */}
                    <FiBarChart2 className="h-6 w-6" /> {/* Increased icon size */}
                  </div>
                  <div className="ml-4"> {/* Increased margin */}
                    <h3 className="text-xl font-medium text-gray-500">{t('dashboard.avgOrderValue')}</h3> {/* Increased text size */}
                    <p className="text-3xl font-semibold text-gray-900"> {/* Increased text size */}
                      ₹{analytics.avgOrderValue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Conversion Rate Card */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600"> {/* Increased padding */}
                    <FiTrendingUp className="h-6 w-6" /> {/* Increased icon size */}
                  </div>
                  <div className="ml-4"> {/* Increased margin */}
                    <h3 className="text-xl font-medium text-gray-500">{t('dashboard.conversionRate')}</h3> {/* Increased text size */}
                    <p className="text-3xl font-semibold text-gray-900"> {/* Increased text size */}
                      {conversionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Increased gap */}
              {/* Sales Trend */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <h3 className="text-3xl font-semibold mb-4">{t('dashboard.salesTrend')}</h3> {/* Increased text size */}
                <div className="h-[350px]"> {/* Increased height */}
                  {analytics.salesTrend?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.salesTrend}
                        margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        barSize={100}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" style={{ fontSize: '14px' }}/> {/* Adjusted size for readability */}
                        <YAxis style={{ fontSize: '14px' }}/> {/* Adjusted size for readability */}
                        <Tooltip
                          formatter={(value, name) => [
                            name === t('dashboard.revenue') ? `₹${value}` : value,
                            name
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: '16px' }}/> {/* Increased legend font size */}
                        <Bar
                          dataKey="sales"
                          name={t('dashboard.revenue')}
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xl"> {/* Increased text size */}
                      <FiBarChart2 className="h-8 w-8 mb-4" /> {/* Increased icon size */}
                      <p className="text-xl">{t('dashboard.noSalesData')}</p> {/* Increased text size */}
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue by Category */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <h3 className="text-3xl font-semibold mb-4">{t('dashboard.revenueByCategory')}</h3> {/* Increased text size */}
                <div className="h-[350px]"> {/* Increased height */}
                  {analytics.revenueByCategory?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.revenueByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={120} // Increased outerRadius for labels outside
                          innerRadius={60} // Adjusted innerRadius to keep the donut thickness
                          fill="#8884d8"
                          dataKey="revenue"
                          nameKey="category"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Keep percent on label
                          labelLine={true} // Re-enable label lines
                          style={{ fontSize: '16px' }} // Set a default font size for labels
                        >
                          {analytics.revenueByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString()}`, t('dashboard.revenue')]}
                          wrapperStyle={{ fontSize: '16px' }} // Increased tooltip font size
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '18px', paddingTop: '16px' }} // Increased legend font size and added padding
                          content={(props) => {
                            const { payload } = props;
                            return (
                              <div className="flex flex-wrap justify-center gap-6 mt-4"> {/* Increased gap */}
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center gap-3"> {/* Increased gap */}
                                    <div 
                                      className="w-4 h-4 rounded-full" // Increased size
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xl text-gray-700">{entry.value}</span> {/* Increased text size, removed the arrow as it's not standard for pie chart legends when labels are on slices */}
                                  </div>
                                ))}
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xl"> {/* Increased text size */}
                      <FiStar className="h-8 w-8 mb-4" /> {/* Increased icon size */}
                      <p className="text-xl">{t('dashboard.noCategoryData')}</p> {/* Increased text size */}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products and Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Increased gap */}
              {/* Top Selling Products */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <h3 className="text-3xl font-semibold mb-4">{t('dashboard.topSellingProducts')}</h3> {/* Increased text size */}
                <div className="space-y-4"> {/* Increased space */}
                  {analytics.bestSellingProducts?.length > 0 ? (
                    analytics.bestSellingProducts.slice(0, 5).map((product, index) => (
                      <div key={product._id} className="flex items-center p-3 hover:bg-gray-50 rounded transition"> {/* Increased padding */}
                        <span className="text-gray-500 w-6 text-xl">{index + 1}</span> {/* Increased text size and width */}
                        <img
                          src={product.productImageUrl || product.productImage}
                          alt={product.productName}
                          className="w-14 h-14 object-cover rounded-md ml-3" // Increased image size
                        />
                        <div className="ml-4 flex-1"> {/* Increased margin */}
                          <h5 className="text-xl font-medium">{product.productName}</h5> {/* Increased text size */}
                          <p className="text-lg text-gray-500">{product.productCategory}</p> {/* Increased text size */}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold">₹{product.totalRevenue?.toLocaleString()}</p> {/* Increased text size */}
                          <p className="text-lg text-gray-500">{product.quantitySold} {t('dashboard.sold')}</p> {/* Increased text size */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-xl"> {/* Increased height and text size */}
                      <FiPackage className="h-8 w-8 mb-4" /> {/* Increased icon size */}
                      <p className="text-xl">{t('dashboard.noTopProducts')}</p> {/* Increased text size */}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow p-6"> {/* Increased padding */}
                <h3 className="text-3xl font-semibold mb-4">{t('dashboard.recentOrders')}</h3> {/* Increased text size */}
                <div className="overflow-x-auto">
                  {analytics.recentOrders?.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"> {/* Increased text size and padding */}
                            {t('dashboard.orderId')}
                          </th>
                          <th className="px-4 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"> {/* Increased text size and padding */}
                            {t('dashboard.date')}
                          </th>
                          <th className="px-4 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"> {/* Increased text size and padding */}
                            {t('dashboard.amount')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.recentOrders.slice(0, 5).map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-xl font-medium text-blue-600"> {/* Increased text size and padding */}
                              #{order.orderId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xl text-gray-500"> {/* Increased text size and padding */}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xl font-semibold text-gray-900"> {/* Increased text size and padding */}
                              ₹{order.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-xl"> {/* Increased height and text size */}
                      <FiClock className="h-8 w-8 mb-4" /> {/* Increased icon size */}
                      <p className="text-xl">{t('dashboard.noRecentOrders')}</p> {/* Increased text size */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow p-8"> {/* Increased padding */}
            <h3 className="text-3xl font-semibold mb-6">{t('dashboard.productPerformance')}</h3> {/* Increased text size */}
            <div className="text-center py-10 text-gray-500 text-2xl"> {/* Increased padding and text size */}
              <FiStar className="mx-auto h-16 w-16 mb-6" /> {/* Increased icon size */}
              <p className="mt-2 text-2xl">{t('dashboard.comingSoon')}</p> {/* Increased text size */}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-8"> {/* Increased padding */}
            <h3 className="text-3xl font-semibold mb-6">{t('dashboard.orderManagement')}</h3> {/* Increased text size */}
            <div className="text-center py-10 text-gray-500 text-2xl"> {/* Increased padding and text size */}
              <FiShoppingBag className="mx-auto h-16 w-16 mb-6" /> {/* Increased icon size */}
              <p className="mt-2 text-2xl">{t('dashboard.comingSoon')}</p> {/* Increased text size */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;