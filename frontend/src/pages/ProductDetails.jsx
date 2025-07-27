import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import SAPAnalyticsDashboard from "../components/elements/SAPAnalyticsDashboard";
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '../hooks/useContentTranslation';

export const ProductDetails = () => {
  const { t } = useTranslation();
  const { translateCategory, translateState } = useContentTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const { user } = useUser();
  const [mongoUserId, setMongoUserId] = useState("");
  const [inCart, setInCart] = useState(false);
  const [sellerId, setSellerId] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/shopcards/${id}`)
      .then(res => setCard(res.data))
      .catch(() => setCard(null));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`)
      .then(res => setMongoUserId(res.data._id))
      .catch(() => setMongoUserId(""));
  }, [user]);

  useEffect(() => {
    if (!mongoUserId || !card) return;
    axios.get(`http://localhost:5000/api/cart/${mongoUserId}`)
      .then(res => {
        const found = res.data?.items?.some(item => item.productId === card._id);
        setInCart(found);
      })
      .catch(() => setInCart(false));
  }, [mongoUserId, card]);

  // Fetch seller's _id based on seller name
  useEffect(() => {
    if (!card?.productSellerName) return;
    axios.get(`http://localhost:5000/api/user/username/${card.productSellerName}`)
      .then(res => setSellerId(res.data._id))
      .catch(() => setSellerId("Not Available"));
  }, [card]);

  const handleAddToCart = async () => {
    if (!mongoUserId || !card) return;
    await axios.post("http://localhost:5000/api/cart/add", {
      userId: mongoUserId,
      productId: card._id,
      productName: card.productName,
      productImageUrl: card.productImageUrl,
      productPrice: card.productPrice,
      productCategory: card.productCategory
    });
    setInCart(true);
  };

  const handleRemoveFromCart = async () => {
    if (!mongoUserId || !card) return;
    await axios.post("http://localhost:5000/api/cart/remove", {
      userId: mongoUserId,
      productId: card._id,
    });
    setInCart(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert(t('auth.login'));
      return;
    }
    
    if (mongoUserId === sellerId) {
      alert(t('product.cannotBuyOwn'));
      return;
    }
    
    navigate('/checkout', {
      state: {
        total: card.productPrice,
        sellerId: sellerId,
        sellerName: card.productSellerName,
        productDetails: {
          id: card._id,
          name: card.productName,
          price: card.productPrice,
          image: card.productImageUrl,
          category: card.productCategory
        }
      }
    });
  };

  // Check if current user is the seller
  const isUserSeller = mongoUserId && sellerId && mongoUserId === sellerId;

  if (!card) return <div className="text-center mt-10">{t('common.loading')}</div>;

  return (
    <>
      <section>
        <div className="bg-[#eee] font-mhlk py-10 px-20">
          <div className="w-full h-[10vh]"></div>
          <div className="flex flex-col items-center mt-10 gap-20 lg:flex-row">
            <div className="size-[80vw] bg-amber-200 lg:size-[40vw]">
              <img src={card.productImageUrl} alt={card.productName} className="size-[100%] object-cover rounded-lg" />
            </div>
            <div className="flex flex-col items-start gap-10">
              <div>
                <h1 className="text-[3rem] font-bold mt-4 lg:text-[5rem]">{card.productName}</h1>
                <p className="text-xl mt-2 lg:text-[3rem] text-wrap">{card.productDescription}</p>
              </div>
              <div>
                <p className="mt-2">{t('product.seller')}: {card.productSellerName}</p>
                <p className="mt-2">{t('product.sellerId')}: {sellerId || t('common.loading')}</p>
                <p className="mt-2">{t('product.category')}: 
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {translateCategory(card.productCategory)}
                  </span>
                </p>
                <p className="mt-2">{t('product.state')}: 
                  <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {translateState(card.productState)}
                  </span>
                </p>
                <p className="mt-2">{t('product.material')}: {card.productMaterial}</p>
                <p className="mt-2">{t('product.weight')}: {card.productWeight}g</p>
                <p className="mt-2">{t('product.color')}: {card.productColor}</p>
              </div>
              <h3 className="mt-2 font-bold text-[2rem]">Rs {card.productPrice}</h3>
              <p className="mt-2">{card.isCodAvailable ? t('product.codAvailable') : t('product.codNotAvailable')}</p>
              <div className="flex gap-8">
                <button 
                  className={`btn text-2xl p-6 ${isUserSeller ? 'btn-disabled' : 'btn-success'}`}
                  onClick={handleBuyNow}
                  disabled={isUserSeller}
                  title={isUserSeller ? t('product.cannotBuyOwn') : t('product.buyNow')}
                >
                  {isUserSeller ? t('dashboard.yourProduct') : t('product.buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SAP Analytics Cloud Dashboard */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Business Intelligence & Analytics</h2>
            <p className="text-gray-600">Powered by SAP Analytics Cloud - Enterprise-grade insights for this product</p>
          </div>
          <SAPAnalyticsDashboard 
            productData={{
              name: card.productName,
              category: card.productCategory,
              material: card.productMaterial,
              region: card.productState,
              basePrice: card.productPrice,
              seller: card.productSellerName,
              weight: card.productWeight,
              color: card.productColor
            }} 
          />
        </div>
      </section>
    </>
  );
}