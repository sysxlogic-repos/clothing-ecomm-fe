import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner, { CardSkeleton } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import propertyURLs from '../../config/property';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [featuredRes, newArrivalsRes, bestSellersRes] = await Promise.all([
        productsAPI.getFeatured(),
        productsAPI.getNewArrivals(),
        productsAPI.getBestSellers()
      ]);

      setFeaturedProducts(featuredRes.data.products || []);
      setNewArrivals(newArrivalsRes.data.products || []);
      setBestSellers(bestSellersRes.data.products || []);
    } catch (error) {
      console.error('Error loading home data:', error);
      toast.error('Failed to load products');
      // Set mock data for development
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Elegant Summer Dress',
        price: 89.99,
        originalPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
        rating: 4.5,
        reviews: 128,
        isNew: true,
        category: 'dresses'
      },
      {
        id: 2,
        name: 'Casual Cotton Top',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        rating: 4.3,
        reviews: 89,
        category: 'tops'
      },
      {
        id: 3,
        name: 'Designer Handbag',
        price: 159.99,
        originalPrice: 199.99,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
        rating: 4.8,
        reviews: 203,
        category: 'accessories'
      },
      {
        id: 4,
        name: 'High-Waist Jeans',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
        rating: 4.6,
        reviews: 156,
        category: 'bottoms'
      }
    ];

    setFeaturedProducts(mockProducts);
    setNewArrivals(mockProducts.slice(0, 3));
    setBestSellers(mockProducts.slice(1, 4));
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your payment information is safe'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Customer support available anytime'
    }
  ];

  const categories = [
    {
      name: 'Dresses',
      image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=400',
      path: '/products/dresses'
    },
    {
      name: 'Tops',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      path: '/products/tops'
    },
    {
      name: 'Bottoms',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      path: '/products/bottoms'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      path: '/products/accessories'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Women's Fashion Store - Latest Trends & Styles</title>
        <meta name="description" content="Discover the latest trends in women's fashion. Shop dresses, tops, accessories and more with fast delivery and easy returns." />
        <meta name="keywords" content="women's clothing, fashion, dresses, tops, accessories, online shopping" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative container-custom py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block text-primary-200">Perfect Style</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-primary-100 leading-relaxed">
              Explore our curated collection of the latest fashion trends. 
              From elegant dresses to casual wear, find pieces that make you feel confident and beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/products?category=new-arrivals"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800"
            alt="Fashion Model"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore our diverse collection of women's fashion essentials
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl lg:text-2xl font-bold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600">
                Handpicked favorites from our collection
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden sm:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <CardSkeleton count={4} />
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-lg text-secondary-600">
                Fresh styles just added to our collection
              </p>
            </div>
            <Link
              to="/products?category=new-arrivals"
              className="hidden sm:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <CardSkeleton count={3} />
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, style tips, and early access to new collections.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

<div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
  <img
    src={propertyURLs.mainBanner}
    alt="Fashion Model"
    className="w-full h-full object-cover opacity-80"
  />
</div>