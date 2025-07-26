import { SignOutButton } from "@clerk/clerk-react"
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaWallet } from "react-icons/fa";

export const UserDashBoard = () => {
  const [user,setUser] = useState(null)
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // console.log(typeof id);

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/user/${id}`)
    .then(res=>setUser(res.data))
    .catch(()=>setUser(null))
  },[id])

  const handleArtisanStatus = (status) => {
    axios.patch(`http://localhost:5000/api/user/${id}/artisan`, { isArtisan: status })
      .then(res => setUser(res.data))
      .catch(() => alert("Failed to update status"));
  };

  const handleProtectedRedirect = (path) => {
    if (user.isArtisan) {
      navigate(path);
    } else {
      setShowModal(true);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Unauthorized or loading...</div>;
  }
  return(
    <>
    <section>
      <div className="">
        <div className="w-full h-[10vh]"></div>
        <div className="w-full h-[5vh] flex items-center justify-end">
          <NavLink to={`/wallet/${user._id}`} className={`h-[100%] ${user.isArtisan || user.isAdmin ? 'block':'hidden'}`}><button className="h-[90%] w-[8vh] bg-emerald-400 rounded-2xl flex items-center justify-center">
            <FaWallet size={20}/>
          </button></NavLink>
        </div>
        <div className="flex flex-col items-center py-20">
          <div className="size-40 rounded-full bg-amber-300 overflow-hidden">
            <img src={user.imageUrl} alt="" />
          </div>
          <p>Welcome {user.userName}</p>
          <p>{user.email}</p>
          <p>
            Date joined :- {user.joiningDate && new Date(user.joiningDate).toLocaleDateString('en-GB')}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-success"
              disabled={user.isArtisan}
              onClick={() => handleArtisanStatus(true)}
            >
              Apply as Artisan
            </button>
            <button
              className="btn btn-warning"
              disabled={!user.isArtisan}
              onClick={() => handleArtisanStatus(false)}
            >
              Revoke
            </button>
          </div>
          <div className="flex gap-4 mt-8">
              <button
                className="btn btn-primary"
                onClick={() => handleProtectedRedirect("/auctionform")}
              >
                Start Auction
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleProtectedRedirect("/sellform")}
              >
                Sell on Heartisans
              </button>
            </div>
          <SignOutButton>
            <button className="btn btn-error mt-4">Log Out</button>
          </SignOutButton>
        </div>
      </div>
    </section>
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Access Denied</h2>
            <p>You must be an Artisan to use this feature.</p>
            <button className="btn btn-primary mt-4" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}