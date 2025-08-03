import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiShare2,
  FiStar,
  FiImage
} from 'react-icons/fi';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useScrollToTop();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shopcards/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.productName} to cart`);
  };

  const handleBuyNow = () => {
    const itemTotal = parseFloat(product.productPrice) * quantity;
    navigate('/checkout', {
      state: {
        total: itemTotal,
        sellerId: product.sellerId,
        sellerName: product.productSellerName,
        productDetails: {
          id: product._id,
          name: product.productName,
          price: product.productPrice,
          category: product.productCategory,
          image: product.productImageUrl
        },
        isSubscription: false,
        directBuy: true
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full h-[10vh]"></div>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full h-[10vh]"></div>
        <div className="flex-grow flex items-center justify-center w-full p-6">
          <div className="bg-red-50 p-6 rounded-lg text-center max-w-2xl">
            <h3 className="text-3xl font-medium text-red-800 mb-4">Error loading product</h3>
            <p className="text-xl text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-8 py-3 bg-gray-200 rounded-md hover:bg-gray-300 text-xl font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full h-[10vh]"></div>
        <div className="flex-grow flex items-center justify-center w-full p-6">
          <p className="text-center text-gray-500 text-2xl">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-[10vh]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 mb-8 hover:text-indigo-800 transition-colors text-xl"
        >
          <FiArrowLeft className="mr-3 h-8 w-8" /> Back to products
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 bg-white p-8 rounded-xl shadow-lg">
          {/* Product Images */}
          <div className="relative mb-8 lg:mb-0">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-gray-100">
              {product.productImageUrl ? (
                <div className="relative h-[32rem] flex items-center justify-center">
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="h-full w-full object-contain object-center"
                  />
                </div>
              ) : (
                <div className="h-[32rem] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FiImage className="mx-auto h-24 w-24" />
                    <p className="mt-4 text-2xl">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 sm:px-0">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
              {product.productName}
            </h1>

            <div className="mb-6">
              <h2 className="sr-only">Product information</h2>
              <p className="text-5xl font-semibold tracking-tight text-indigo-600">
                ₹{product.productPrice}
              </p>
            </div>

            {/* Reviews */}
            <div className="mb-8 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <FiStar
                    key={rating}
                    className={`h-8 w-8 flex-shrink-0 ${
                      rating < 4 ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-3 text-xl text-gray-500">
                4 out of 5 stars (24 reviews)
              </p>
            </div>

            <div className="mb-8">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-4 text-xl text-gray-700 leading-relaxed">
                <p>{product.productDescription}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-xl">
                <p><span className="font-medium">Material:</span> {product.productMaterial}</p>
                <p><span className="font-medium">Weight:</span> {product.productWeight}</p>
                <p><span className="font-medium">Color:</span> {product.productColor}</p>
                <p><span className="font-medium">Category:</span> {product.productCategory}</p>
                <p><span className="font-medium">Seller:</span> {product.productSellerName}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-8">
                <span className="text-xl font-medium mr-4">Quantity:</span>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 border rounded-l-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xl"
                >
                  -
                </button>
                <span className="px-8 py-3 border-t border-b text-center text-xl font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-3 border rounded-r-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xl"
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleBuyNow}
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-lg flex items-center justify-center text-xl py-4 px-6 font-semibold"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-lg flex items-center justify-center text-xl py-4 px-6 font-semibold"
                >
                  <FiShoppingCart className="mr-3 h-6 w-6" />
                  Add to cart
                </button>
                <button className="bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-lg flex items-center justify-center text-xl py-4 px-6 font-semibold">
                  <FiShare2 className="mr-3 h-6 w-6" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <div className="space-y-8">
            {/* Sample review */}
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <img
                  className="h-16 w-16 rounded-full"
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Emily Selman"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <FiStar
                      key={rating}
                      className={`h-7 w-7 flex-shrink-0 ${
                        rating < 4 ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <h3 className="text-2xl font-medium text-gray-900">
                  Emily Selman
                </h3>
                <p className="text-xl text-gray-500 mb-3">
                  <time dateTime="2021-07-16">July 16, 2021</time>
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  This is the best product I've ever purchased. The quality is amazing and it exceeded all my expectations. The shipping was fast and the packaging was secure. I would definitely recommend this to my friends!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;