import { useEffect } from 'react'
import './App.css'
import Lenis from 'lenis'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Auction } from './pages/Auction'
import { Shop } from './pages/Shop'
import { Resale } from './pages/Resale'
import ResaleListings from './pages/ResaleListings'
import { AppLayout } from './components/layout/AppLayout'
import { ShopDetails } from './pages/ShopDetails'
import { UserDashBoard } from './pages/UserDashBoard'
import SellerDashboard from './pages/Dashboard/SellerDashboard' // Missing import
import { BuyerDashboard } from './pages/Dashboard/BuyerDashboard' // Missing import
import { AdminPanel } from './pages/AdminPanel'
import { ProductDetails } from './pages/ProductDetails'
import { Modal } from './components/elements/Modal'
import { SellForm } from './pages/SellForm'
import { AuctionForm } from './pages/AuctionForm'
import { AuctionDetails } from './pages/AuctionDetails'
import { CartPage } from './pages/CartPage'
import { CheckoutForm } from './pages/CheckoutForm'
import { PaymentSuccess } from './pages/PaymentSuccess'
import { SubscriptionSuccess } from './pages/SubscriptionSuccess'
import { PaymentFailed } from './pages/PaymentFailed'
import { PaymentPage } from './pages/PaymentPage'
import { WalletPage } from './pages/WalletPage'
import OrderDetailsPage from './pages/OrderDetailsPage' // Missing import
import ProductDetailPage from './pages/ProductDetailPage' // Missing import
import { SAPAnalyticsPage } from './pages/SAPAnalyticsPage'
import BackToTop from './components/elements/BackToTop'
import { StoriesPage } from './pages/StoriesPage'


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
      path: "/",
      element: <AppLayout />,
      // errorElement:<ErrorPage/>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/shop/:name",
          element: <ShopDetails />,
        },
        {
          path: "/shop/:name/:id",
          element: <ProductDetails />,
        },
        {
          path: "/auction",
          element: <Auction />,
        },
        {
          path: "/auction/:id",
          element: <AuctionDetails />,
        },
        {
          path: "/resale",
          element: <Resale />,
        },
        {
          path: "/resale-listings",
          element: <ResaleListings />,
        },
        {
          path: "/sellform",
          element: <SellForm />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/auctionform",
          element: <AuctionForm />,
        },
        {
          path: "/checkout",
          element: <CheckoutForm />,
        },
        {
          path: "/modal",
          element: <Modal />,
        },
        {
          path: "/payment",
          element: <PaymentPage />,
        },
        {
          path: "/payment-success",
          element: <PaymentSuccess />,
        },
        {
          path: "/subscription-success",
          element: <SubscriptionSuccess />,
        },
        {
          path: "/payment-failure",
          element: <PaymentFailed />,
        },
        {
          path: "/wallet/:id",
          element: <WalletPage />,
        },
        {
          path: "/admin",
          element: <AdminPanel />,
        },
        {
          path: "/stories",
          element: <StoriesPage />,
        },
        {
          path:"/sap-analytics",
          element:<SAPAnalyticsPage/>,
        },
        {
          path:"/dashboard/:id",
          element:<UserDashBoard/>,
        },
        {
          path: "/dashboard/seller/:id", // Missing route
          element: <SellerDashboard />,
        },
        {
          path: "/dashboard/buyer/:id", // Missing route
          element: <BuyerDashboard />,
        },
        {
          path: "/orders/:id", // Missing route
          element: <OrderDetailsPage />,
        },
        {
          path: "/products/:id", // Missing route
          element: <ProductDetailPage />,
        },
        // Added new route for the "Buy Now" button's navigation
        {
          path: "/product/:id/buy", 
          element: <ProductDetailPage />, 
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>
      {/* <BackToTop /> */}
    </>
  );
};