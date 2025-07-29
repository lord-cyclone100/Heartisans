import { SignInButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
export const HamBurgerMenu = () => {
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
  return(
    <>
      <div className="dropdown dropdown-end text-2xl px-8 font-mhlk lg:hidden">
        <div tabIndex={0} role="button" className="btn m-1">
          <RiMenu3Line/>
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-black rounded-box z-1 w-52 p-2 shadow-sm">
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/auction">Auction</NavLink></li>
          <li><NavLink to="/resale">Resale</NavLink></li>
          <li><NavLink to="/sap-analytics" className="text-blue-300 hover:text-white-100">SAP Analytics</NavLink></li>
          {dbUser?.isAdmin && (
            <li><NavLink to="/admin">Dashboard</NavLink></li>
          )}
        </ul>
      </div>
    </>
  )
}