import { useScrollToTop } from "../hooks/useScrollToTop"
import { About } from "./About"
import { Ambassador } from "./Ambassador"
import { FeaturedCollection } from "./FeaturedCollection"
import { HeroSection } from "./HeroSection"
import { Teams } from "./Teams"

export const Home = () => {
  useScrollToTop();
  return(
    <>
      <HeroSection/>
      <About/>
      <FeaturedCollection/>
      <Teams/>
      <Ambassador/>
    </>
  )
}