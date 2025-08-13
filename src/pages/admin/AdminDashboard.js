import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { analyticsAPI, ordersAPI, productsAPI, usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    productsGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        ordersAPI.getRecentOrders(),
        productsAPI.getTopProducts()
      ]);
      
      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data);
      setTopProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Mock data for development
      const mockStats = {
        totalRevenue: 125430.50,
        totalOrders: 1247,
        totalCustomers: 892,
        totalProducts: 156,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        customersGrowth: 15.2,
        productsGrowth: 5.1
      };
      
      const mockRecentOrders = [
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          customer: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          total: 159.99,
          status: 'processing',
          createdAt: new Date().toISOString(),
          items: [{ product: { name: "Women's Dress" }, quantity: 1 }]
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          total: 89.99,
          status: 'shipped',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          items: [{ product: { name: "Cotton T-Shirt" }, quantity: 2 }]
        },
        {
          _id: '3',
          orderNumber: 'ORD-2024-003',
          customer: { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com' },
          total: 299.99,
          status: 'delivered',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          items: [{ product: { name: "Leather Jacket" }, quantity: 1 }]
        }
      ];
      
      const mockTopProducts = [
        {
          _id: '1',
          name: "Women's Elegant Summer Dress",
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop',
          totalSold: 145,
          revenue: 12995.55,
          price: 89.99
        },
        {
          _id: '2',
          name: "Casual Cotton T-Shirt",
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
          totalSold: 234,
          revenue: 7017.66,
          price: 29.99
        },
        {
          _id: '3',
          name: "Premium Leather Wallet",
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
          totalSold: 89,
          revenue: 7119.11,
          price: 79.99
        }
      ];
      
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setTopProducts(mockTopProducts);
      toast.error('Failed to load dashboard data. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon, prefix = '', suffix = '' }) => {
    const isPositive = growth >= 0;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(growth)}%
          </span>
          <span className="text-sm text-gray-600 ml-1">from last month</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Your Store</title>
        <meta name="description" content="Admin dashboard with sales analytics, order management, and business insights." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            growth={stats.revenueGrowth}
            icon={DollarSign}
            prefix="$"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            growth={stats.ordersGrowth}
            icon={ShoppingCart}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            growth={stats.customersGrowth}
            icon={Users}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            growth={stats.productsGrowth}
            icon={Package}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {product.totalSold} sold • ${product.revenue.toFixed(2)} revenue
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
                7 Days
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                30 Days
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                90 Days
              </button>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sales chart will be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Package className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new product listing</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-medium text-gray-900">Process Orders</h3>
              <p className="text-sm text-gray-600 mt-1">Manage pending orders</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View and edit user accounts</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">Detailed sales reports</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;