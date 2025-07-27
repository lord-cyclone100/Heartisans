import { useTranslation } from 'react-i18next'

export const About = () => {
  const { t } = useTranslation()
  
  return(
    <>
      <section>
        <div className="relative w-full py-20 bg-[#eee] transition-all duration-3000 ease-in-out bg-cover bg-center flex flex-col items-center justify-center gap-20 lg:flex-row lg:items-start lg:px-40">
          <div id="about-text" className="font-mhlk  flex w-[100%] flex-col gap-8">
            <h1 className="text-[6rem] leading-24 pl-12 lg:text-[7rem] lg:leading-30">{t('home.aboutTitle')}</h1>
            
            {/* <hr className=""/> */}
            <p className="px-12 text-[2rem] lg:text-[2.8rem] lg:w-[40vw]">
              <span className="text-green-500">Heartisans</span> {t('home.aboutDescription')}
            </p>
          </div>
          <div id="jigsaw" className="w-[80vw] lg:w-[60vw]">
            <img src="./photos/jigsaw.svg"  alt="" />
          </div>
        </div>
      </section>
    </>
  )
}