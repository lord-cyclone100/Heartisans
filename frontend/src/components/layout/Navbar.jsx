import { SignUpButton } from '../elements/SignUpButton';
import { NavLink } from "react-router-dom"
import { useUser } from '@clerk/clerk-react';

export const Navbar = () => {
  const { user } = useUser();
  return (
    <>
      <nav className='h-[10vh] w-full bg-black/70 backdrop-blur-lg border-b border-white/40  px-40 flex items-center justify-between fixed z-10 font-mhlk text-white'>
        <div>
          <NavLink to="/">
            <img src="./photos/primary-logo.svg" className='h-20' alt="" />
          </NavLink>
        </div>
        <div className='flex  gap-[4vw]'>
          <div>
            <ul className={`menu menu-horizontal px-1 text-2xl gap-[2vw] ${user ? "flex" : "hidden"}`}>
              <li><NavLink to="/shop">Shop</NavLink></li>
              <li><NavLink to="/auction">Auction</NavLink></li>
              <li><NavLink to="/resale">Resale</NavLink></li>
            </ul>
          </div>
          <SignUpButton/>
        </div>
      </nav>
    </>
    
  );
}
