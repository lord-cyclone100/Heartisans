import { SignUpButton } from '../elements/SignUpButton';
import { LanguageSelector } from '../elements/LanguageSelector';
import { NavLink } from "react-router-dom"
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HamBurgerMenu } from '../elements/HamBurgerMenu';
import { FaCartShopping } from "react-icons/fa6";

export const Navbar = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [dbUser, setDbUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      axios.get(`http://localhost:5000/api/user/email/${user.primaryEmailAddress.emailAddress}`)
        .then(res => {
          setDbUser(res.data);
          // Fetch cart count for this user
          axios.get(`http://localhost:5000/api/cart/${res.data._id}`)
            .then(cartRes => setCartCount(cartRes.data?.items?.length || 0))
            .catch(() => setCartCount(0));
        })
        .catch(() => {
          setDbUser(null);
          setCartCount(0);
        });
    } else {
      setDbUser(null);
      setCartCount(0);
    }
  }, [user]);

  return (
    <>
      <nav className='h-[10vh] w-full bg-black/70 backdrop-blur-lg border-b border-white/40 px-4 sm:px-8 md:px-16 lg:px-40 flex items-center justify-between fixed z-10 font-mhlk text-white'>
        <div>
          <NavLink to="/">
            <img src={`${import.meta.env.BASE_URL}photos/primary-logo.svg`} className='h-12 sm:h-16 md:h-18 lg:h-20' alt="Heartisans Logo" />
          </NavLink>
        </div>
        <div className='flex  gap-[4vw] items-center'>
          <div className='hidden lg:block'>
            <ul className={`menu menu-horizontal px-1 text-2xl gap-[2vw] ${user ? "flex" : "hidden"}`}>
              <li><NavLink to="/shop">{t('nav.shop')}</NavLink></li>
              <li><NavLink to="/auction">{t('nav.auction')}</NavLink></li>
              <li><NavLink to="/resale">{t('nav.resale')}</NavLink></li>
              <li><NavLink to="/stories">{t('nav.stories')}</NavLink></li>
              <li><NavLink to="/sap-analytics" className="text-blue-300 hover:text-white-100">SAP Analytics</NavLink></li>
              {dbUser?.isAdmin && (
                <li><NavLink to="/admin">{t('nav.admin')}</NavLink></li>
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