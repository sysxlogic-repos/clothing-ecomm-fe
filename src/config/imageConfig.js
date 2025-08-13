/**
 * Centralized Image Configuration
 * This file contains all image references used throughout the application.
 * Update image URLs here to change them globally across the app.
 */

export const imageConfig = {
  // Placeholder Images
  placeholders: {
    product: '/placeholder-product.jpg',
    user: '/placeholder-user.jpg',
    category: '/placeholder-category.jpg',
    thumbnail: '/placeholder-thumbnail.jpg',
  },

  // Brand Assets
  brand: {
    logo: '/logo.png',
    logoSmall: '/logo192.png',
    favicon: '/favicon.ico',
  },

  // Social Media Images
  social: {
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
  },

  // Hero/Banner Images
  hero: {
    mainBanner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    categoryBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    promotionalBanner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  },

  // Category Images
  categories: {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  },

  // Sample Product Images (for development/demo)
  sampleProducts: {
    laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },

  // User Avatar Placeholders
  avatars: {
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    admin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    customer: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
  },

  // Email Template Thumbnails
  emailTemplates: {
    welcome: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80',
    newsletter: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&q=80',
    promotion: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300&q=80',
    orderConfirmation: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80',
  },

  // Icon Images (if using image icons instead of icon libraries)
  icons: {
    cart: '/icons/cart.svg',
    user: '/icons/user.svg',
    search: '/icons/search.svg',
    heart: '/icons/heart.svg',
  },
};

/**
 * Helper function to get image URL with fallback
 * @param {string} category - Image category (e.g., 'placeholders', 'categories')
 * @param {string} key - Image key within the category
 * @param {string} fallback - Fallback image URL
 * @returns {string} Image URL
 */
export const getImageUrl = (category, key, fallback = imageConfig.placeholders.product) => {
  try {
    return imageConfig[category]?.[key] || fallback;
  } catch (error) {
    console.warn(`Image not found: ${category}.${key}`, error);
    return fallback;
  }
};

/**
 * Get placeholder image based on type
 * @param {string} type - Type of placeholder needed
 * @returns {string} Placeholder image URL
 */
export const getPlaceholder = (type = 'product') => {
  return imageConfig.placeholders[type] || imageConfig.placeholders.product;
};

export default imageConfig;