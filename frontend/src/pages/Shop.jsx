import { NavLink } from "react-router-dom"
import { shopCategories, shopStates } from "../constants/constants"
import { useTranslation } from 'react-i18next'
import { useContentTranslation } from '../hooks/useContentTranslation'

export const Shop = () => {
  const { t } = useTranslation()
  const { translateCategory, translateState } = useContentTranslation()
  
  return(
    <>
      <section>
        <div className="bg-[#eee] font-mhlk py-10">
          <div className="w-full h-[10vh]"></div>
          <div>
            <h1 className="text-[3rem] text-center py-16">{t('home.shopByCategory')}</h1>
            <div className="flex gap-16 w-full items-center justify-center px-20 flex-wrap">
              {
                shopCategories.map((item,idx)=>(
                  <NavLink to={`/shop/${item.name}`} key={idx}>
                    <div id="item" className="size-44 bg-emerald-300 flex items-center justify-center text-center p-4 rounded-lg">
                      {translateCategory(item.name)}
                    </div>
                  </NavLink>
                ))
              }
            </div>
          </div>
          <div>
            <h1 className="text-[3rem] text-center py-16">{t('home.shopByStates')}</h1>
            <div className="flex gap-20 w-full items-center justify-center px-20 flex-wrap">
              {
                shopStates.map((item,idx)=>(
                  <NavLink to={`/shop/${item.name}`} key={idx}>
                    <div className="flex flex-col items-center gap-12">
                      <div className="size-44 bg-emerald-300 rounded-full">
                        <img src={item.url} className="scale-150" alt="" />
                      </div>
                      <p>{translateState(item.name)}</p>
                    </div>
                  </NavLink>
                ))
              }
            </div>
          </div>
        </div>
      </section>

    </>
  )
}