import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Filter,
  Eye,
  Download,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import propertyURLs from '../../config/property';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'processing', label: 'Processing', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { value: 'shipped', label: 'Shipped', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { value: 'delivered', label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'returned', label: 'Returned', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'paid', label: 'Paid', color: 'text-green-600' },
    { value: 'failed', label: 'Failed', color: 'text-red-600' },
    { value: 'refunded', label: 'Refunded', color: 'text-blue-600' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, selectedStatus, selectedPaymentStatus, dateRange, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        dateRange,
        sortBy,
        sortOrder
      };
      
      const response = await ordersAPI.getOrders(params);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for development
      const mockOrders = [
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567'
          },
          items: [
            {
              product: {
                name: "Women's Elegant Summer Dress",
                image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&h=100&fit=crop'
              },
              quantity: 2,
              price: 89.99
            }
          ],
          totalAmount: 179.98,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T14:20:00Z'
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          customer: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 987-6543'
          },
          items: [
            {
              product: {
                name: "Casual Cotton T-Shirt",
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
              },
              quantity: 3,
              price: 29.99
            }
          ],
          totalAmount: 89.97,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'PayPal',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          createdAt: '2024-01-19T15:45:00Z',
          updatedAt: '2024-01-20T09:15:00Z'
        },
        {
          _id: '3',
          orderNumber: 'ORD-2024-003',
          customer: {
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+1 (555) 456-7890'
          },
          items: [
            {
              product: {
                name: "Premium Leather Wallet",
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop'
              },
              quantity: 1,
              price: 79.99
            }
          ],
          totalAmount: 79.99,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'Credit Card',
          shippingAddress: {
            street: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA'
          },
          createdAt: '2024-01-21T08:20:00Z',
          updatedAt: '2024-01-21T08:20:00Z'
        }
      ];
      setOrders(mockOrders);
      setTotalPages(1);
      toast.error('Failed to load orders. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o._id));
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first');
      return;
    }

    try {
      switch (action) {
        case 'export':
          await ordersAPI.exportOrders(selectedOrders);
          toast.success(`${selectedOrders.length} orders exported`);
          break;
        case 'print':
          window.print();
          break;
        default:
          break;
      }
      setSelectedOrders([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'returned': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = orderStatuses.find(option => option.value === status);
    return statusOption ? { color: statusOption.color, bgColor: statusOption.bgColor } : { color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const getPaymentStatusColor = (status) => {
    const statusOption = paymentStatuses.find(option => option.value === status);
    return statusOption ? statusOption.color : 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Order Management | Admin Dashboard</title>
        <meta name="description" content="Manage customer orders, track shipments, and process payments." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Manage customer orders and track shipments</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-outline flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk Actions</option>
                    <option value="export">Export Selected</option>
                    <option value="print">Print Selected</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field"
                  >
                    <option value="">All Status</option>
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => {
                      setSelectedPaymentStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field"
                  >
                    <option value="">All Payment Status</option>
                    {paymentStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="last90days">Last 90 Days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                      setCurrentPage(1);
                    }}
                    className="input-field"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="totalAmount-desc">Highest Amount</option>
                    <option value="totalAmount-asc">Lowest Amount</option>
                    <option value="orderNumber-asc">Order Number (A-Z)</option>
                    <option value="orderNumber-desc">Order Number (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <LoadingSpinner />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('orderNumber')}
                      >
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalAmount')}
                      >
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const statusColors = getStatusColor(order.status);
                      return (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order._id)}
                              onChange={() => handleSelectOrder(order._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.customer.name}</p>
                              <p className="text-sm text-gray-500">{order.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {order.items.slice(0, 2).map((item, index) => (
                                <img
                                  key={index}
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-8 h-8 object-cover rounded bg-gray-100"
                                />
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-sm text-gray-500">+{order.items.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bgColor} ${statusColors.color}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{orderStatuses.find(s => s.value === order.status)?.label}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {paymentStatuses.find(s => s.value === order.paymentStatus)?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                {orderStatuses.map(status => (
                                  <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                              </select>
                              <button className="p-2 text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderManagement;