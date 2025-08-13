import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderTracking();
  }, [orderId]);

  const fetchOrderTracking = async () => {
    try {
      setLoading(true);
      const [orderResponse, trackingResponse] = await Promise.all([
        ordersAPI.getOrder(orderId),
        ordersAPI.getOrderTracking(orderId)
      ]);
      setOrder(orderResponse.data);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      // Mock data for development
      const mockOrder = {
        _id: orderId,
        orderNumber: orderId,
        status: 'shipped',
        createdAt: '2024-01-20T10:30:00Z',
        estimatedDelivery: '2024-01-27T18:00:00Z',
        items: [
          {
            _id: '1',
            product: {
              _id: 'prod1',
              name: "Women's Elegant Summer Dress",
              image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
            },
            quantity: 1,
            price: 89.99,
            selectedSize: 'M',
            selectedColor: 'Black'
          }
        ],
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Doe',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        total: 89.99
      };
      
      const mockTracking = {
        trackingNumber: 'TRK123456789',
        carrier: 'FedEx',
        status: 'in_transit',
        estimatedDelivery: '2024-01-27T18:00:00Z',
        currentLocation: 'New York Distribution Center',
        events: [
          {
            _id: '1',
            status: 'order_placed',
            description: 'Order has been placed and confirmed',
            location: 'Online',
            timestamp: '2024-01-20T10:30:00Z',
            completed: true
          },
          {
            _id: '2',
            status: 'processing',
            description: 'Order is being prepared for shipment',
            location: 'Fulfillment Center - Newark, NJ',
            timestamp: '2024-01-21T09:15:00Z',
            completed: true
          },
          {
            _id: '3',
            status: 'shipped',
            description: 'Package has been shipped',
            location: 'Fulfillment Center - Newark, NJ',
            timestamp: '2024-01-22T14:20:00Z',
            completed: true
          },
          {
            _id: '4',
            status: 'in_transit',
            description: 'Package is in transit',
            location: 'New York Distribution Center',
            timestamp: '2024-01-23T08:45:00Z',
            completed: true
          },
          {
            _id: '5',
            status: 'out_for_delivery',
            description: 'Package is out for delivery',
            location: 'New York, NY',
            timestamp: null,
            completed: false
          },
          {
            _id: '6',
            status: 'delivered',
            description: 'Package has been delivered',
            location: '123 Main Street, New York, NY',
            timestamp: null,
            completed: false
          }
        ]
      };
      
      setOrder(mockOrder);
      setTracking(mockTracking);
      toast.error('Failed to load tracking information. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    
    switch (status) {
      case 'order_placed':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status, completed) => {
    if (completed) {
      return 'text-green-600';
    }
    
    switch (status) {
      case 'order_placed':
      case 'shipped':
      case 'in_transit':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'out_for_delivery':
        return 'text-orange-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-400';
    }
  };

  const formatStatusText = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <LoadingSpinner text="Loading tracking information..." />;
  }

  if (!order || !tracking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking Information Not Found</h2>
          <Link to="/profile?tab=orders" className="btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Track Order {order.orderNumber} | Your Store</title>
        <meta name="description" content={`Track your order ${order.orderNumber}. Get real-time updates on your package delivery status.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          {/* Back Navigation */}
          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Track Order {order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
                
                <div className="space-y-6">
                  {tracking.events.map((event, index) => (
                    <div key={event._id} className="relative">
                      {/* Timeline Line */}
                      {index < tracking.events.length - 1 && (
                        <div className="absolute left-3 top-8 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {getStatusIcon(event.status, event.completed)}
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold ${getStatusColor(event.status, event.completed)}`}>
                              {formatStatusText(event.status)}
                            </h3>
                            {event.timestamp && (
                              <span className="text-sm text-gray-500">
                                {new Date(event.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                          {event.location && (
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                          {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formatStatusText(tracking.status)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Current location: {tracking.currentLocation}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                    <p className="text-lg font-mono text-blue-700">{tracking.trackingNumber}</p>
                    <p className="text-xs text-blue-600 mt-1">Carrier: {tracking.carrier}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Estimated Delivery</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {new Date(tracking.estimatedDelivery).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Carrier Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Carrier Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tracking.carrier}</p>
                      <p className="text-sm text-gray-600">Shipping Carrier</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">1-800-GO-FEDEX</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">support@fedex.com</span>
                    </div>
                  </div>
                  
                  <button className="w-full btn-outline text-sm">
                    Track on {tracking.carrier} Website
                  </button>
                </div>
              </div>

              {/* Help */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  If you have any questions about your shipment, we're here to help.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">1-800-123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">support@yourstore.com</span>
                  </div>
                </div>
                <button className="w-full btn-primary text-sm mt-4">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTrackingPage;