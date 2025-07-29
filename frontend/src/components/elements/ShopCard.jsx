import { NavLink } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../../hooks/useContentTranslation'

export const ShopCard = ({card}) => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()
  
  return(
    <>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 overflow-hidden transform hover:scale-105 w-full max-w-sm mx-auto">
        {/* Image Section */}
        <div className="relative h-64 md:h-72 bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden">
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
              <span className="text-green-800 font-bold text-xl">₹{card.productPrice}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Product Name */}
          <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-3 line-clamp-2 group-hover:text-green-900 transition-colors">
            {card.productName}
          </h3>
          
          {/* Seller Name */}
          <p className="text-green-600 text-base md:text-lg mb-4 font-medium">
            by {card.productSellerName}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              {translateCategory(card.productCategory)}
            </span>
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              {translateState(card.productState)}
            </span>
          </div>

          {/* Action Button */}
          <NavLink to={`/shop/${card.productCategory}/${card._id}`} className="block">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {t('products.details')}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  )
}