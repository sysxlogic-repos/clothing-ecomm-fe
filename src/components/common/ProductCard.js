import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getPlaceholder } from '../../config/imageConfig';
import toast from 'react-hot-toast';

const ProductCard = ({ product, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const {
    id,
    name,
    price,
    originalPrice,
    image,
    images,
    rating = 0,
    reviews = 0,
    isNew = false,
    isSale = false,
    category,
    colors = [],
    sizes = [],
    stock = 0
  } = product;

  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} className="fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} className="text-secondary-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      <Link to={`/product/${id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-secondary-200 animate-pulse" />
          )}
          <img
            src={image || images?.[0] || getPlaceholder('product')}
            alt={name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {isSale && discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
            {stock === 0 && (
              <span className="bg-secondary-500 text-white text-xs font-semibold px-2 py-1 rounded">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-md transition-colors duration-200 ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-secondary-600 hover:text-red-500'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
            </button>
            <Link
              to={`/product/${id}`}
              className="p-2 bg-white text-secondary-600 hover:text-primary-600 rounded-full shadow-md transition-colors duration-200"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={16} />
              <span>{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {category && (
            <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">
              {category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {name}
          </h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {renderStars(rating)}
              </div>
              <span className="text-xs text-secondary-500 ml-1">
                ({reviews})
              </span>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-secondary-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-xs text-secondary-500 ml-1">
                  +{colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-secondary-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {stock > 0 && stock <= 5 && (
            <p className="text-xs text-orange-600 mt-1">
              Only {stock} left in stock
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;