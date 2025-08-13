# Image Configuration Guide

## Overview

This directory contains the centralized image configuration system for the e-commerce application. All image references should be managed through this system to ensure consistency and easy maintenance.

## Files

### `imageConfig.js`

**Location**: `src/config/imageConfig.js`

This is the main configuration file that contains all image URLs and references used throughout the application.

## Usage

### Importing the Configuration

```javascript
// Import the entire config
import imageConfig from '../config/imageConfig';

// Import specific helper functions
import { getImageUrl, getPlaceholder } from '../config/imageConfig';
```

### Using Image URLs

#### 1. Direct Access
```javascript
// Access specific images
const logoUrl = imageConfig.brand.logo;
const heroImage = imageConfig.hero.mainBanner;
const categoryImage = imageConfig.categories.electronics;
```

#### 2. Using Helper Functions
```javascript
// Get image with fallback
const productImage = getImageUrl('sampleProducts', 'laptop', '/fallback.jpg');

// Get placeholder images
const userPlaceholder = getPlaceholder('user');
const productPlaceholder = getPlaceholder('product');
```

### Example Implementation

```javascript
import React from 'react';
import { getPlaceholder, getImageUrl } from '../config/imageConfig';

const ProductCard = ({ product }) => {
  return (
    <div>
      <img 
        src={product.image || getPlaceholder('product')} 
        alt={product.name}
      />
      {/* Rest of component */}
    </div>
  );
};
```

## Image Categories

### 1. Placeholders
- `product`: Default product image placeholder
- `user`: Default user avatar placeholder
- `category`: Default category image placeholder
- `thumbnail`: Default thumbnail placeholder

### 2. Brand Assets
- `logo`: Main application logo
- `logoSmall`: Small version of logo
- `favicon`: Website favicon

### 3. Social Media
- `ogImage`: Open Graph image for social sharing
- `twitterImage`: Twitter card image

### 4. Hero/Banner Images
- `mainBanner`: Main homepage banner
- `categoryBanner`: Category page banner
- `promotionalBanner`: Promotional content banner

### 5. Category Images
- `electronics`: Electronics category image
- `clothing`: Clothing category image
- `home`: Home & Garden category image
- `books`: Books category image
- `sports`: Sports category image
- `beauty`: Beauty & Personal Care category image

### 6. Sample Product Images
- `laptop`: Sample laptop image
- `smartphone`: Sample smartphone image
- `headphones`: Sample headphones image
- `watch`: Sample watch image
- `shoes`: Sample shoes image
- `bag`: Sample bag image

### 7. User Avatars
- `default`: Default user avatar
- `admin`: Admin user avatar
- `customer`: Customer user avatar

### 8. Email Templates
- `welcome`: Welcome email template thumbnail
- `newsletter`: Newsletter template thumbnail
- `promotion`: Promotional email template thumbnail
- `orderConfirmation`: Order confirmation template thumbnail

## Best Practices

### 1. Always Use the Configuration
- ❌ Don't hardcode image URLs in components
- ✅ Use the centralized configuration system

```javascript
// ❌ Bad
<img src="/images/product-placeholder.jpg" alt="Product" />

// ✅ Good
<img src={getPlaceholder('product')} alt="Product" />
```

### 2. Provide Fallbacks
- Always provide fallback images for dynamic content
- Use appropriate placeholder types

```javascript
// ✅ Good
<img 
  src={product.image || getPlaceholder('product')} 
  alt={product.name}
/>
```

### 3. Use Helper Functions
- Prefer helper functions over direct access for better error handling
- Helper functions provide automatic fallbacks

### 4. Update Images Centrally
- When changing images, update only the configuration file
- All components will automatically use the new images

## Adding New Images

### 1. Add to Configuration
```javascript
// In imageConfig.js
export const imageConfig = {
  // ... existing categories
  newCategory: {
    newImage: 'https://example.com/new-image.jpg',
  },
};
```

### 2. Use in Components
```javascript
import { getImageUrl } from '../config/imageConfig';

const MyComponent = () => {
  const newImage = getImageUrl('newCategory', 'newImage');
  return <img src={newImage} alt="New Image" />;
};
```

## Image Optimization Tips

### 1. Use Appropriate Formats
- **JPEG**: For photographs and complex images
- **PNG**: For images with transparency
- **SVG**: For icons and simple graphics
- **WebP**: For modern browsers (better compression)

### 2. Optimize Image Sizes
- Use responsive images with different sizes
- Compress images before uploading
- Consider lazy loading for better performance

### 3. CDN Usage
- Store images on a CDN for better performance
- Use Unsplash or similar services for demo images
- Ensure images have proper caching headers

## Troubleshooting

### Common Issues

1. **Image not loading**
   - Check if the URL is correct in the configuration
   - Verify network connectivity
   - Ensure fallback images are available

2. **Placeholder not showing**
   - Verify the placeholder type exists in the configuration
   - Check if the helper function is imported correctly

3. **Images not updating**
   - Clear browser cache
   - Restart development server
   - Check if the configuration file was saved properly

## Migration Guide

To migrate existing hardcoded image references:

1. **Find all image references**
   ```bash
   grep -r "\.(jpg|jpeg|png|gif|svg|webp)" src/
   ```

2. **Replace with configuration**
   - Import the image configuration
   - Replace hardcoded URLs with configuration references
   - Add appropriate fallbacks

3. **Test thoroughly**
   - Verify all images load correctly
   - Test error scenarios (broken URLs)
   - Check responsive behavior

## Support

For questions or issues related to the image configuration system:

1. Check this documentation first
2. Review the `imageConfig.js` file for available options
3. Test with the helper functions for debugging
4. Ensure proper imports and usage patterns