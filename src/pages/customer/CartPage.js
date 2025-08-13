import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (loading) {
    return <LoadingSpinner text="Loading cart..." />;
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart ({getCartItemsCount()}) | Your Store</title>
        <meta name="description" content="Review your selected items and proceed to checkout. Free shipping on orders over $50." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                      <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || item.images?.[0]}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item._id}`}
                              className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                            
                            <div className="mt-1 space-y-1">
                              {item.selectedSize && (
                                <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                              )}
                              {item.selectedColor && (
                                <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                              )}
                              {item.brand && (
                                <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                              )}
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="text-sm text-gray-500 line-through">
                                ${(item.originalPrice * item.quantity).toFixed(2)}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({getCartItemsCount()} items)</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      
                      {shipping > 0 && (
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <p>💡 Add ${(50 - subtotal).toFixed(2)} more to get free shipping!</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      className="w-full mt-6 btn-primary py-3 text-lg"
                    >
                      Proceed to Checkout
                    </button>
                    
                    <div className="mt-4 text-center">
                      <Link
                        to="/products"
                        className="text-primary-600 hover:text-primary-700 transition-colors text-sm"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Security & Trust */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Why Shop With Us?</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>30-day easy returns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;