import { About } from "./About"
import { Ambassador } from "./Ambassador"
import { FeaturedCollection } from "./FeaturedCollection"
import { HeroSection } from "./HeroSection"

export const Home = () => {
  return(
    <>
      <HeroSection/>
      <About/>
      <FeaturedCollection/>
      <Ambassador/>
    </>
  )
}