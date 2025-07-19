import './App.css'
import { Navbar } from './components/Navbar'
import { About } from './pages/About'
import { Ambassador } from './pages/Ambassador'
import { FeaturedCollection } from './pages/FeaturedCollection'
import { HeroSection } from './pages/HeroSection'

export const App = () => {

  return (
    <>
      <Navbar/>
      <HeroSection/>
      <About/>
      <FeaturedCollection/>
      <Ambassador/>
    </>
  )
}
