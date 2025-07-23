import { SignUpButton } from '../elements/SignUpButton';
import { NavLink } from "react-router-dom"
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HamBurgerMenu } from '../elements/HamBurgerMenu';

export const Navbar = () => {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      axios.get(`http://localhost:5000/api/user/email/${user.primaryEmailAddress.emailAddress}`)
        .then(res => setDbUser(res.data))
        .catch(() => setDbUser(null));
    } else {
      setDbUser(null);
    }
  }, [user]);
  return (
    <>
      <nav className='h-[10vh] w-full bg-black/70 backdrop-blur-lg border-b border-white/40  px-40 flex items-center justify-between fixed z-10 font-mhlk text-white'>
        <div>
          <NavLink to="/">
            <img src={`${import.meta.env.BASE_URL}photos/primary-logo.svg`} className='h-20' alt="" />
          </NavLink>
        </div>
        <div className='flex  gap-[4vw]'>
          <div className='hidden lg:block'>
            <ul className={`menu menu-horizontal px-1 text-2xl gap-[2vw] ${user ? "flex" : "hidden"}`}>
              <li><NavLink to="/shop">Shop</NavLink></li>
              <li><NavLink to="/auction">Auction</NavLink></li>
              <li><NavLink to="/resale">Resale</NavLink></li>
              {dbUser?.isAdmin && (
                <li><NavLink to="/admin">Dashboard</NavLink></li>
              )}
            </ul>
          </div>
          <SignUpButton/>
          <HamBurgerMenu/>
        </div>
      </nav>
    </>
    
  );
}
