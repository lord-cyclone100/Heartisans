import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react";
import axios from "axios"
import { NavLink, useNavigate } from "react-router-dom";

export const SignUpButton = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dbUserId, setDbUserId] = useState(null);
  // let userId = ""
  useEffect(()=>{
    if(user){
      console.log(user);
      const imageUrl = user.imageUrl;
      const fullName = user.fullName;
      const email = user.primaryEmailAddress.emailAddress;
      // const userId = user.id;
      // console.log(userId);

      axios.post("http://localhost:5000/api/user",{
        userName:fullName,
        email:email,
        imageUrl:imageUrl,
        fullName:fullName
      }).then(res => {
        setDbUserId(res.data.user._id);
      })
      .catch((err)=>{
        console.error("Failed");
      })
    }
  },[user])
  return(
    <>
      <header className="">
        <button className={`text-2xl px-8 py-6 btn btn-success ${user ? 'hidden' : 'flex'}`}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </button>
        <SignedIn>

          {user && dbUserId && (<button className="rounded-full size-12 overflow-hidden " onClick={() => navigate(`/dashboard/${dbUserId}`)}>
            <img src={user.imageUrl} alt="" />
            {/* {user.id} */}
            {/* Profile */}
          </button>)}
        </SignedIn>
      </header>
    </>
  )
}