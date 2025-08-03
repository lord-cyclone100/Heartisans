import { SignUpButton } from '../elements/SignUpButton';
import { LanguageSelector } from '../elements/LanguageSelector';
import { NavLink } from "react-router-dom"
import { useUser } from '../../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HamBurgerMenu } from '../elements/HamBurgerMenu';
import { FaCartShopping } from "react-icons/fa6";

export const Navbar = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { t } = useTranslation();
  const [dbUser, setDbUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const lastUserIdRef = useRef(null);

  useEffect(() => {
    // Don't make API calls until auth is loaded
    if (!isLoaded) return;
    
    if (user && isSignedIn && user._id) {
      // Prevent repeated calls for the same user
      if (lastUserIdRef.current === user._id) return;
      lastUserIdRef.current = user._id;
      
      setDbUser(user);
      // Fetch cart count for this user - only if we have a valid user ID
      const userId = user._id;
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      axios.get(`${API_BASE_URL}/cart/${userId}`)
        .then(cartRes => {
          setCartCount(cartRes.data?.items?.length || 0);
        })
        .catch(error => {
          console.log('Cart fetch error (normal if user has no cart):', error.message);
          setCartCount(0);
        });
    } else {
      lastUserIdRef.current = null;
      setDbUser(null);
      setCartCount(0);
    }
  }, [user?._id, isSignedIn, isLoaded]); // Only depend on user ID, signed in status, and loaded state

  const getNavLinkColor = ({isActive}) => {
    return{
      color:isActive ? "#80d65c" : "white",
    };
  }

  return (
    <>
      <nav className='h-[10vh] w-full bg-black/70 backdrop-blur-lg border-b border-white/40 px-4 sm:px-8 md:px-16 lg:px-40 flex items-center justify-between fixed z-20 font-mhlk text-white'>
        <div>
          <NavLink to="/">
            <img src={`${import.meta.env.BASE_URL}photos/primary-logo.svg`} className='h-12 sm:h-16 md:h-18 lg:h-20' alt="Heartisans Logo" />
          </NavLink>
        </div>
        <div className='flex  gap-[4vw] items-center'>
          <div className='hidden lg:block'>
            <ul className={`menu menu-horizontal px-1 text-2xl gap-[2vw] ${user ? "flex" : "hidden"}`}>
              <li><NavLink to="/shop" style={getNavLinkColor}>{t('nav.shop')}</NavLink></li>
              <li><NavLink to="/auction" style={getNavLinkColor}>{t('nav.auction')}</NavLink></li>
              <li><NavLink to="/resale" style={getNavLinkColor}>{t('nav.resale')}</NavLink></li>
              <li><NavLink to="/stories" style={getNavLinkColor}>{t('nav.stories')}</NavLink></li>
              <li><NavLink to="/sap-analytics" style={getNavLinkColor}>SAP Analytics</NavLink></li>
              {dbUser?.isAdmin && (
                <li><NavLink to="/admin" style={getNavLinkColor}>{t('nav.admin')}</NavLink></li>
              )}
            </ul>
          </div>
          <LanguageSelector />
          {/* <div className='flex items-start relative'>
            <NavLink to='/cart'><FaCartShopping size={20} /></NavLink>
            <div className='size-6 rounded-full bg-red-500 flex items-center justify-center absolute left-5 bottom-5'>
              {cartCount}
            </div>
          </div> */}
          <SignUpButton/>
          <HamBurgerMenu/>
        </div>
      </nav>
    </>
  );
}