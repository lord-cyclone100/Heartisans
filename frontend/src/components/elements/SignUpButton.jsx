import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import axios from "axios"
import { NavLink, useNavigate } from "react-router-dom";

export const SignUpButton = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  // let userId = ""
  useEffect(()=>{
    if(user){
      // console.log(user);
      // console.log(user.imageUrl);
      const fullName = user.fullName;
      const email = user.primaryEmailAddress.emailAddress;
      // const userId = user.id;
      // console.log(userId);

      axios.post("http://localhost:5000/api/user",{
        userName:fullName,
        email:email
      }).catch((err)=>{
        console.error("Failed");
      })
    }
  },[user])
  return(
    <>
      <header className="text-2xl px-8 py-6 btn btn-success">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>

          {user && (<button className="rounded-full size-10" onClick={() => navigate(`/dashboard/${user.id}`)}>
            <img src={user.imageUrl} alt="" />
            {/* {user.id} */}
            {/* Profile */}
          </button>)}
        </SignedIn>
      </header>
    </>
  )
}