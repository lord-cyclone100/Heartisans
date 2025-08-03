import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Carousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/shopcards");
        const allProducts = response.data;
        
        // Shuffle and get 5 random products
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 5);
        
        setProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  const handleExploreMore = () => {
    navigate("/shop");
  };

  const handleProductClick = (product) => {
    navigate(`/shop/${product.productCategory}/${product._id}`);
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto" style={{ borderColor: '#479626', borderTopColor: 'transparent' }}></div>
            <p className="mt-4 text-lg text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
        {/* Carousel */}
        {products.length > 0 ? (
          <div className="relative">
            <div className="carousel rounded-box mx-4 sm:mx-8 lg:mx-20 h-[45vw] md:h-[22vw]">
              {products.map((product, index) => (
                <div
                  key={product._id || index}
                  className="carousel-item px-2 sm:px-3 lg:px-5 cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={product.productImageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={product.productName || "Artisan Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Black Overlay with Product Details - Only appears on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-all duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                      <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 p-4">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 line-clamp-2">
                          {product.productName || "Artisan Product"}
                        </h3>
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#ffaf27' }}>
                          ₹{product.productPrice || "N/A"}
                        </p>
                        <p className="text-sm md:text-base mt-2 opacity-90">
                          by {product.productSellerName || "Unknown Artisan"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No Products Available */
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
            <p className="text-gray-500 mb-6">Check back later for amazing artisan products!</p>
          </div>
        )}

        {/* Explore More Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleExploreMore}
            className="bg-gradient-to-r from-[#479626] to-[#4da329] text-white py-4 px-8 rounded-xl font-bold text-lg sm:text-xl hover:from-[#60cb34] hover:to-[#80d65c] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore More Products
            <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}