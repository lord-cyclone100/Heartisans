// DEMO: Complete Translation Implementation Guide
// This file demonstrates how to use the i18n system throughout your app

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../hooks/useContentTranslation'

export const TranslationDemo = () => {
  const { t, i18n } = useTranslation()
  const { translateCategory, translateState, translateProduct } = useContentTranslation()
  
  // Sample product data from database
  const [products, setProducts] = useState([
    {
      _id: '1',
      productName: 'Beautiful Handmade Vase',
      productCategory: 'pottery',
      productState: 'west bengal',
      productPrice: 1500,
      productSellerName: 'Artisan Kumar',
      productImageUrl: './photos/pottery.jpg',
      codAvailable: true
    },
    {
      _id: '2',
      productName: 'Traditional Jewelry Set',
      productCategory: 'jewelry',
      productState: 'rajasthan',
      productPrice: 5000,
      productSellerName: 'Artisan Sharma',
      productImageUrl: './photos/jewelry.jpg',
      codAvailable: false
    }
  ])

  const [loading, setLoading] = useState(false)

  // Simulate data fetching
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('home.heroTitle')}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {t('home.heroSubtitle')}
        </p>
        
        {/* Language switcher demo */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button 
            onClick={() => changeLanguage('en')}
            className={`px-4 py-2 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t('language.english')}
          </button>
          <button 
            onClick={() => changeLanguage('hi')}
            className={`px-4 py-2 rounded ${i18n.language === 'hi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t('language.hindi')}
          </button>
          <button 
            onClick={() => changeLanguage('bn')}
            className={`px-4 py-2 rounded ${i18n.language === 'bn' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t('language.bengali')}
          </button>
          <button 
            onClick={() => changeLanguage('ta')}
            className={`px-4 py-2 rounded ${i18n.language === 'ta' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t('language.tamil')}
          </button>
          <button 
            onClick={() => changeLanguage('te')}
            className={`px-4 py-2 rounded ${i18n.language === 'te' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t('language.telugu')}
          </button>
        </div>
      </div>

      {/* Static content translation demo */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{t('home.aboutTitle')}</h2>
        <p className="text-lg text-gray-700 mb-4">
          <span className="text-green-500 font-bold">Heartisans</span> {t('home.aboutDescription')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">{t('home.shopByCategory')}</h3>
            <p className="text-gray-600">{t('nav.shop')}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">{t('home.shopByStates')}</h3>
            <p className="text-gray-600">{t('nav.shop')}</p>
          </div>
        </div>
      </section>

      {/* Dynamic database content translation demo */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{t('products.details')}</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{product.productName}</h3>
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                      {t('products.new')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p><strong>{t('product.seller')}:</strong> {product.productSellerName}</p>
                    <p><strong>{t('product.price')}:</strong> ₹{product.productPrice}</p>
                    
                    {/* Dynamic category translation */}
                    <p><strong>{t('product.category')}:</strong> 
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {translateCategory(product.productCategory)}
                      </span>
                    </p>
                    
                    {/* Dynamic state translation */}
                    <p><strong>{t('product.state')}:</strong> 
                      <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                        {translateState(product.productState)}
                      </span>
                    </p>
                    
                    {/* COD availability with translation */}
                    <p>
                      <span className={`font-medium ${product.codAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {product.codAvailable ? t('product.codAvailable') : t('product.codNotAvailable')}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                      {t('product.addToCart')}
                    </button>
                    <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                      {t('product.buyNow')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form demo with translations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{t('common.search')}</h2>
        <form className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('form.name')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg"
                placeholder={t('form.name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('form.email')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                className="w-full p-3 border rounded-lg"
                placeholder={t('form.email')}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              {t('form.message')} <span className="text-gray-500">({t('form.optional')})</span>
            </label>
            <textarea 
              className="w-full p-3 border rounded-lg h-24"
              placeholder={t('form.message')}
            />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {t('common.submit')}
            </button>
            <button 
              type="button"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </section>

      {/* Current language info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold mb-2">Translation System Status:</h3>
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>Available Languages:</strong> {Object.keys(i18n.store.data).join(', ')}</p>
        <p><strong>Loaded Keys:</strong> {Object.keys(t('', { returnObjects: true })).length} translation keys</p>
      </div>
    </div>
  )
}

export default TranslationDemo
