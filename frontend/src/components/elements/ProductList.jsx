import React from 'react'
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../../hooks/useContentTranslation'
import { ShopCard } from './ShopCard'

export const ProductList = ({ products, title }) => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-8 font-mhlk">
            {title}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={product.productImageUrl}
                  alt={product.productName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  {t('products.new')}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">
                  {product.productName}
                </h3>
                
                <p className="text-gray-600 mb-2 truncate">
                  {t('product.seller')}: {product.productSellerName}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.productPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.productWeight}g
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {translateCategory(product.productCategory)}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {translateState(product.productState)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    {t('product.addToCart')}
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                    {t('products.details')}
                  </button>
                </div>
                
                <div className="mt-2 text-center">
                  {product.codAvailable ? (
                    <span className="text-green-600 text-sm font-medium">
                      {t('product.codAvailable')}
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm font-medium">
                      {t('product.codNotAvailable')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t('common.noItems')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
