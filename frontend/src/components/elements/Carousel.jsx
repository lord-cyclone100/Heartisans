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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        {/* Carousel */}
        {products.length > 0 ? (
          <div className="relative">
            <div className="carousel rounded-box mx-4 sm:mx-8 lg:mx-20 h-[45vw] md:h-[22vw]">
              {products.map((product, index) => (
                <div
                  key={product._id || index}
                  className="carousel-item px-2 sm:px-3 lg:px-5 cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.productImageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.productName || "Artisan Product"}
                    className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  />
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