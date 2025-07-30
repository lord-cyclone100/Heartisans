import { NavLink } from "react-router-dom"
import { shopCategories, shopStates } from "../constants/constants"
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../hooks/useContentTranslation'

export const Shop = () => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()

  return(
    <>
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 font-mhlk">
        {/* Hero Section */}
        <div className="w-full h-[10vh]"></div>
        <div className="text-center py-8 md:py-12 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-green-800 mb-4 font-mhlk">
            Discover Handcrafted Treasures
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-green-600 max-w-2xl mx-auto leading-relaxed">
            Explore authentic artisan creations from across India, organized by category and region
          </p>
        </div>

        {/* Shop by Category Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-800 mb-4 font-mhlk">
              {t('home.shopByCategory')}
            </h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
            {shopCategories.map((item, idx) => (
              <NavLink 
                to={`/shop/${item.name}`} 
                key={idx}
                className="group transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden group-hover:from-green-500 group-hover:to-emerald-600 mb-4 p-1">
                    <img 
                      src={item.url} 
                      alt={translateCategory(item.name)}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-700 hidden items-center justify-center text-white text-xl md:text-2xl font-bold rounded-lg">
                      {translateCategory(item.name).charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-green-800 text-center group-hover:text-green-900 transition-colors px-2">
                    {translateCategory(item.name)}
                  </h3>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Shop by States Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-800 mb-4 font-mhlk">
                {t('home.shopByStates')}
              </h2>
              <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-4"></div>
              <p className="text-lg md:text-xl lg:text-2xl text-green-600 max-w-3xl mx-auto px-4">
                Discover the rich cultural heritage and traditional crafts from different states of India
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {shopStates.map((item, idx) => (
                <NavLink 
                  to={`/shop/${item.name}`} 
                  key={idx}
                  className="group transform transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 lg:p-8 border border-green-100 group-hover:border-green-300 group-hover:from-green-100 group-hover:to-emerald-100">
                    <div className="relative mb-4 md:mb-6 lg:mb-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-300" id="item">
                        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-white flex items-center justify-center" id="item">
                          <img 
                            src={item.url} 
                            className="w-16 h-16 scale-200 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain" 
                            alt={translateState(item.name)}
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-green-800 text-center group-hover:text-green-900 transition-colors mb-2 md:mb-4">
                      {translateState(item.name)}
                    </h3>
                    <div className="text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full text-sm md:text-base lg:text-lg font-medium group-hover:bg-green-200 transition-colors">
                        Explore Collection
                      </span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}