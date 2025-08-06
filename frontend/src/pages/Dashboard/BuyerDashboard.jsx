import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { FiShoppingCart, FiDollarSign, FiPackage, FiCalendar, FiTrendingUp, FiImage, FiAlertTriangle } from 'react-icons/fi';
import { FaChartPie, FaHistory, FaBoxOpen } from 'react-icons/fa';
import { MdRecommend } from 'react-icons/md';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const buyerId = window.location.pathname.split('/').pop();
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        axios.get(`https://heartisans-1.onrender.com/api/analytics/buyer/${buyerId}`),
        axios.get(`https://heartisans-1.onrender.com/api/orders/buyer/${buyerId}`),
        axios.get('https://heartisans-1.onrender.com/api/shopcards')
      ]);

      setAnalytics(analyticsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));

      const purchasedProductIds = new Set(
        ordersRes.data.map(order => order.productDetails?.productId)
      );
      const recommended = productsRes.data
        .filter(product => !purchasedProductIds.has(product._id.toString()))
        .slice(0, 4);
      setRecommendedProducts(recommended);

      setLoading(false);
    } catch (err) {
      console.error("Failed to load data", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [buyerId]);

  // Adjust these loading/error states to account for the navbar space as well.
  // The min-h-screen ensures content pushes footer down, if any.
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Spacer div similar to Shop.jsx */}
      <div className="w-full h-[10vh]"></div>
      <div className="flex justify-center items-center h-full"> {/* Use h-full to center within remaining space */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        {/* Spacer div similar to Shop.jsx */}
        <div className="w-full h-[10vh]"></div>
        <div className="flex-grow flex items-center justify-center w-full"> {/* Flex-grow to take available space */}
          <ErrorState error={error} onRetry={fetchData} />
        </div>
      </div>
    );
  }

  if (!analytics) return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Spacer div similar to Shop.jsx */}
      <div className="w-full h-[10vh]"></div>
      <div className="flex-grow flex items-center justify-center w-full p-8 text-center text-red-500 text-xl">
        {t('buyer.noAnalyticsData')}
      </div>
    </div>
  );

  const pieData = Object.entries(analytics.categoryStats).map(([category, stats]) => ({
    name: category,
    value: stats.total
  }));

  const barData = Object.entries(analytics.monthlyTrend).map(([month, total]) => ({
    month: month.split('-')[1],
    amount: total
  }));

  const itemsPurchased = Object.values(analytics.categoryStats).reduce((sum, cat) => sum + cat.count, 0);
  const lastPurchaseDate = recentOrders.length > 0
    ? format(new Date(recentOrders[0].createdAt), 'd MMMM yyyy')
    : t('buyer.noPurchasesYet');

  return (
    <section className="min-h-screen">
      {/* Spacer div to push content down, matching the height used by your navbar in Shop.jsx */}
      <div className="w-full h-[10vh]"></div>

      {/* Main content wrapper - removed pt-XX as spacer handles it */}
      <div className="p-6 md:p-8 max-w-screen-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">{t('buyer.title')}</h1>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<FiShoppingCart className="text-indigo-500" size={24} />}
            title={t('buyer.totalOrders')}
            value={analytics.totalOrders}
            trend={analytics.totalOrders > 0 ? 'positive' : 'neutral'}
          />
          <MetricCard
            icon={<FiDollarSign className="text-green-500" size={24} />}
            title={t('buyer.totalSpent')}
            value={`₹${analytics.totalSpent.toLocaleString()}`}
            trend="positive"
          />
          <MetricCard
            icon={<FiPackage className="text-blue-500" size={24} />}
            title={t('buyer.itemsPurchased')}
            value={itemsPurchased}
            trend={itemsPurchased > 0 ? 'positive' : 'neutral'}
          />
          <MetricCard
            icon={<FiCalendar className="text-purple-500" size={24} />}
            title={t('buyer.lastPurchase')}
            value={lastPurchaseDate}
            trend={recentOrders.length > 0 ? 'positive' : 'neutral'}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ChartCard
            title={t('buyer.spendingByCategory')}
            icon={<FaChartPie className="text-indigo-500" size={28} />}
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                  labelStyle={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fill: '#374151',
                  }}
                >
                  {pieData.map((entry, index) => (
                    // THIS IS THE CRUCIAL LINE: Ensure 'fill' is correctly set here
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={t('buyer.monthlySpendingTrend')}
            icon={<FiTrendingUp className="text-green-500" size={28} />}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 16, fontWeight: '500' }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                />
                <YAxis
                  tick={{ fontSize: 16, fontWeight: '500' }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Orders */}
        <div className="mb-10">
          <SectionHeader
            title={t('buyer.recentOrders')}
            icon={<FaHistory className="text-blue-500" size={28} />}
          />
          {recentOrders.length ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-5 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">{t('buyer.product')}</th>
                    <th className="px-8 py-5 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">{t('buyer.price')}</th>
                    <th className="px-8 py-5 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">{t('buyer.date')}</th>
                    <th className="px-8 py-5 text-left text-lg font-semibold text-gray-700 uppercase tracking-wider">{t('buyer.status')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.productDetails?.productImage && (
                            <img
                              className="h-14 w-14 rounded-lg object-cover mr-4"
                              src={order.productDetails.productImage}
                              alt={order.productDetails.productName}
                            />
                          )}
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {order.productDetails?.productName || t('buyer.unknownProduct')}
                            </div>
                            <div className="text-base text-gray-600 mt-1">
                              {order.productDetails?.productCategory || t('buyer.noCategory')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-lg font-semibold text-gray-900">
                        ₹{order.amount}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-600">
                        {format(new Date(order.createdAt), 'd MMM yyyy')}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.status || t('buyer.completed')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<FaBoxOpen className="text-gray-400" size={64} />}
              title={t('buyer.noRecentOrders')}
              description={t('buyer.noRecentOrdersDesc')}
              action={
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('buyer.browseProducts')}
                </button>
              }
            />
          )}
        </div>

        {/* Recommended Products */}
        <div className="mb-10">
          <SectionHeader
            title={t('buyer.recommendedForYou')}
            icon={<MdRecommend className="text-purple-500" size={28} />}
          />
          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MdRecommend className="text-gray-400" size={64} />}
              title={t('buyer.noRecommendations')}
              description={t('buyer.noRecommendationsDesc')}
              action={
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('buyer.browseProducts')}
                </button>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

const ErrorState = ({ error, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center p-8 bg-red-50 rounded-xl">
      <FiAlertTriangle className="mx-auto text-red-400" size={64} />
      <h3 className="mt-4 text-2xl font-semibold text-red-800">{t('buyer.errorLoading')}</h3>
      <p className="mt-2 text-lg text-red-700">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('buyer.retry')}
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ icon, title, description, action }) => (
  <div className="text-center p-8 bg-gray-50 rounded-xl">
    <div className="mx-auto w-16 h-16 text-gray-400">
      {icon}
    </div>
    <h3 className="mt-4 text-2xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-lg text-gray-600">{description}</p>
    {action && <div className="mt-8">{action}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-lg">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center mt-2">
            <div
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-base font-medium">
              {entry.name}: ₹{entry.value} {entry.percent && `(${Math.round(entry.percent * 100)}%)`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ icon, title, value, trend }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-start">
      <div className="mr-5 p-3 rounded-full bg-gray-50">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        {trend === 'positive' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 mt-2">
            {t('buyer.positive')}
          </span>
        )}
        {trend === 'neutral' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 mt-2">
            {t('buyer.neutral')}
          </span>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center mb-6">
      <div className="mr-3">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center mb-6">
    <div className="mr-3">{icon}</div>
    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
  </div>
);

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.productImageUrl ? (
          <img
            src={product.productImageUrl}
            alt={product.productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FiImage size={40} />
            <span className="mt-2 text-base">{t('buyer.noImage')}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{product.productName}</h3>
        <p className="text-base text-gray-600 mb-3">{product.productCategory}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl text-gray-900">₹{product.productPrice}</span>
          <button
            className="px-4 py-2 bg-indigo-600 text-white text-base font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}/buy`);
            }}
          >
            {t('buyer.buyNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export { BuyerDashboard };