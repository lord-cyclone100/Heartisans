import { NavLink } from "react-router-dom"
import { shopCategories, shopStates } from "../constants/constants"
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../hooks/useContentTranslation'
import { useScrollToTop } from "../hooks/useScrollToTop"

export const Shop = () => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()

  useScrollToTop();

  return(
    <>
      <section className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #ecfdf5, #f7fee7)' }}>
        {/* Hero Section */}
        <div className="w-full h-[10vh]"></div>
        <div className="text-center py-8 md:py-12 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-6xl xl:text-[5rem] font-bold mb-4 font-mhlk">
            Discover Handcrafted Treasures
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
            Explore authentic artisan creations from across India, organized by category and region
          </p>
        </div>

        {/* Shop by Category Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 font-mhlk" style={{ color: '#479626' }}>
              {t('home.shopByCategory')}
            </h2>
            <div className="w-16 md:w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(to right, #479626, #ffaf27)' }}></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {shopCategories.map((item, idx) => (
              <NavLink 
                to={`/shop/${item.name}`} 
                key={idx}
                className="group transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden mb-4 p-1" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
                    <img 
                      src={item.url} 
                      alt={translateCategory(item.name)}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center text-white text-xl md:text-2xl font-bold rounded-lg" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
                      {translateCategory(item.name).charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-center transition-colors px-2" style={{ color: '#479626' }}>
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 font-mhlk" style={{ color: '#479626' }}>
                {t('home.shopByStates')}
              </h2>
              <div className="w-16 md:w-24 h-1 mx-auto rounded-full mb-4" style={{ background: 'linear-gradient(to right, #479626, #ffaf27)' }}></div>
              <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto px-4" style={{ color: '#6b7280' }}>
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
                  <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-6 lg:p-8" style={{ background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', border: '1px solid #d1d5db' }}>
                    <div className="relative mb-4 md:mb-6 lg:mb-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto flex items-center justify-center shadow-lg transition-all duration-300" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }} id="item">
                        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-white flex items-center justify-center" id="item">
                          <img 
                            src={item.url} 
                            className="w-16 h-16 scale-200 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain" 
                            alt={translateState(item.name)}
                          />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-center transition-colors mb-2 md:mb-4" style={{ color: '#479626' }}>
                      {translateState(item.name)}
                    </h3>
                    <div className="text-center">
                      <span className="inline-block px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-full text-sm md:text-base lg:text-lg font-medium transition-colors" style={{ backgroundColor: '#ffaf27', color: '#ffffff' }}>
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