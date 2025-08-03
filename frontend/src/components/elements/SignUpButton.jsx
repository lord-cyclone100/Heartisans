import { useEffect, useState } from "react";
import axios from "axios"
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";

export const SignUpButton = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [dbUserId, setDbUserId] = useState(null);

  useEffect(() => {
    if (user && isSignedIn) {
      setDbUserId(user._id);
    }
  }, [user, isSignedIn]);

  return (
    <>
      <header className="">
        {!isSignedIn ? (
          <button 
            className="text-2xl px-8 py-6 btn btn-success"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        ) : (
          user && dbUserId && (
            <button 
              className="rounded-full size-12 overflow-hidden" 
              onClick={() => navigate(`/dashboard/${dbUserId}`)}
            >
              <img src={user.imageUrl || '/photos/primary-logo.svg'} alt="Profile" />
            </button>
          )
        )}
      </header>
    </>
  )
}