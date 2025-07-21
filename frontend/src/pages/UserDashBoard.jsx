import { SignOutButton } from "@clerk/clerk-react"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const UserDashBoard = () => {
  const [user,setUser] = useState(null)
  const { id } = useParams();
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

  if (!user) {
    return <div className="text-center mt-10">Unauthorized or loading...</div>;
  }
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <div className="size-60 rounded-full bg-amber-300">
        <img src={user.imageUrl} alt="" />
      </div>
      <p>{user.userName}</p>
      <p>{user.email}</p>
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
      <SignOutButton>
        <button className="btn btn-error mt-4">Log Out</button>
      </SignOutButton>
    </>
  )
}