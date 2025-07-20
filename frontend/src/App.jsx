import { useEffect } from 'react'
import './App.css'
import Lenis from 'lenis'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Auction } from './pages/Auction'
import { Shop } from './pages/Shop'
import { Resale } from './pages/Resale'
import { AppLayout } from './components/layout/AppLayout'
import { ShopDetails } from './pages/ShopDetails'

export const App = () => {

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      wheelMultiplier: 0.7,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const router = createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      // errorElement:<ErrorPage/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/shop",
          element:<Shop/>
        },
        {
          path:"/shop/:name",
          element:<ShopDetails/>
        },
        {
          path:"/auction",
          element:<Auction/>,
        },
        {
          path:"/resale",
          element:<Resale/>,
        },
      ]
    },    
  ]);
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}
