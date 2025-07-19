import { Carousel } from "../components/Carousel"

export const FeaturedCollection = () => {
  return(
    <>
      <section>
        <div className="relative w-full py-20 bg-[#fefefe] flex flex-col items-center font-mhlk gap-20">
          <h1 className="text-[12vw] text-center leading-[12vw] md:leading md:text-[8vw] lg:text-[5vw]">Featured Collection</h1>
          <Carousel/>
        </div>
      </section>
    </>
  )
}