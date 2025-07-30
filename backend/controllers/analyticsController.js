import { orderModel } from '../models/orderModel.js';
import { shopCardModel } from '../models/shopCardModel.js';
import mongoose from 'mongoose';

export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { range = 'monthly' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'yearly':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default: // monthly
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get orders within date range
    const orders = await orderModel.find({ 
      sellerId,
      status: 'paid',
      createdAt: { $gte: startDate }
    });

    // Basic metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const totalItemsSold = orders.reduce((sum, order) => sum + (order.productDetails ? 1 : 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Product sales data
    const productSalesMap = {};
    const categoryRevenueMap = {};
    
    orders.forEach(order => {
      if (order.productDetails && order.productDetails.productId) {
        // Track product sales
        const productId = order.productDetails.productId.toString();
        productSalesMap[productId] = (productSalesMap[productId] || 0) + 1;
        
        // Track category revenue
        const category = order.productDetails.productCategory || 'Uncategorized';
        categoryRevenueMap[category] = (categoryRevenueMap[category] || 0) + order.amount;
      }
    });

    // Get top 5 selling product IDs
    const sortedProductIds = Object.entries(productSalesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    // Get best selling products
    const validProductIds = sortedProductIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    const bestSellingProducts = await shopCardModel.find({ 
      _id: { $in: validProductIds } 
    });

    // Format best selling products with sales data
    const enhancedBestSellers = bestSellingProducts.map(product => ({
      ...product.toObject(),
      quantitySold: productSalesMap[product._id.toString()] || 0,
      totalRevenue: (productSalesMap[product._id.toString()] || 0) * parseFloat(product.productPrice || 0)
    }));

    // Sales trend data
    const salesTrend = {};
    orders.forEach(order => {
      const dateKey = range === 'weekly' 
        ? `${order.createdAt.getFullYear()}-W${Math.ceil((order.createdAt.getDate() + (order.createdAt.getDay() || 7)) / 7)}`
        : `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      
      if (!salesTrend[dateKey]) {
        salesTrend[dateKey] = { sales: 0, orders: 0 };
      }
      salesTrend[dateKey].sales += order.amount;
      salesTrend[dateKey].orders += 1;
    });

    // Format sales trend for chart
    const salesTrendArray = Object.entries(salesTrend)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        orders: data.orders
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Format category revenue for chart
    const revenueByCategory = Object.entries(categoryRevenueMap)
      .map(([category, revenue]) => ({
        category,
        revenue
      }));

    // Recent orders (last 5)
    const recentOrders = await orderModel.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId customerDetails.name createdAt status amount')
      .lean();

    res.json({
      totalRevenue,
      totalOrders,
      totalItemsSold,
      avgOrderValue,
      bestSellingProducts: enhancedBestSellers,
      salesTrend: salesTrendArray,
      revenueByCategory,
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customerDetails?.name || 'Unknown',
        orderDate: order.createdAt,
        amount: order.amount
      }))
    });

  } catch (error) {
    console.error("Error in getSellerAnalytics:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getBuyerAnalytics = async (req, res) => {
  try {
    const buyerId = req.params.id;

    const orders = await orderModel.find({ buyerId, status: 'paid' });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);

    // Category-wise stats
    const categoryStats = {};
    orders.forEach(order => {
      const category = order.productDetails?.productCategory || 'Unknown';
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, count: 0 };
      }
      categoryStats[category].total += order.amount;
      categoryStats[category].count += 1;
    });

    // Monthly trend
    const monthlyTrend = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyTrend[month]) monthlyTrend[month] = 0;
      monthlyTrend[month] += order.amount;
    });

    res.status(200).json({
      totalOrders,
      totalSpent,
      categoryStats,
      monthlyTrend
    });

  } catch (error) {
    console.error('Error fetching buyer analytics:', error);
    res.status(500).json({ message: 'Failed to fetch buyer analytics' });
  }
};