import { NavLink } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../../hooks/useContentTranslation'

export const ShopCard = ({card}) => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()
  
  return(
    <>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 w-full max-w-sm mx-auto" style={{ border: '1px solid #479626' }}>
        {/* Image Section */}
        <div className="relative h-64 md:h-72 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
          <img
            src={card.productImageUrl}
            alt={card.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          />
          {/* New Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {t('products.new')}
            </span>
          </div>
          {/* Price Tag */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <span className="font-bold text-xl" style={{ color: '#479626' }}>₹{card.productPrice}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Product Name */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 transition-colors" style={{ color: '#479626' }}>
            {card.productName}
          </h3>
          
          {/* Seller Name */}
          <p className="text-base md:text-lg mb-4 font-medium" style={{ color: '#479626' }}>
            by {card.productSellerName}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#479626' }}>
              {translateCategory(card.productCategory)}
            </span>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#479626' }}>
              {translateState(card.productState)}
            </span>
          </div>

          {/* Action Button */}
          <NavLink to={`/shop/${card.productCategory}/${card._id}`} className="block">
            <button className="w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" style={{ backgroundColor: '#ffaf27' }}>
              {t('products.details')}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  )
}