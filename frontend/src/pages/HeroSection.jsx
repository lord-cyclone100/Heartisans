import { useEffect, useState } from "react"
import { Navbar } from "../components/layout/Navbar"
import { homeCarousel } from "../constants/constants";
import { useTranslation } from 'react-i18next'

export const HeroSection = () => {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % homeCarousel.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  return(
    <>
      <section>
        <div className="relative h-dvh w-full bg-amber-200 transition-all duration-3000 ease-in-out bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${homeCarousel[index]})`}}>
          <div id="overlay" className="h-[100%] w-[100%] absolute bg-black top-0 opacity-30"></div>
          <div className="absolute z-3 text-white font-mhlk h-[100%] w-[100%] flex flex-col items-center justify-center text-[4rem] gap-20 md:text-[6vw] md:gap-0 ">
            <h1 className="w-[70vw] leading-[10vw] text-center md:leading-[8vw]">{t('home.heroTitle')}</h1>
            {/* <h1></h1> */}
            <h4 className="text-[4vw] md:text-[2vw]">{t('home.heroSubtitle')}</h4>
          </div>
        </div>
      </section>
      
    </>
  )
}