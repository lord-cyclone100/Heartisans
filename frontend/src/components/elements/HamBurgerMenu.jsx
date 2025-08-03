// HamBurgerMenu.jsx
import { RiMenu3Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";

export const HamBurgerMenu = () => {
    // Get user and isSignedIn directly from the hook.
    // No need for local state (dbUser) or a useEffect.
    const { user, isSignedIn } = useUser();
    
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
                    <li><NavLink to="/stories">Stories</NavLink></li>
                    <li><NavLink to="/sap-analytics" className="text-blue-300 hover:text-white-100">SAP Analytics</NavLink></li>
                    {user?.isAdmin && (
                        <li><NavLink to="/admin">Dashboard</NavLink></li>
                    )}
                </ul>
            </div>
        </>
    )
}