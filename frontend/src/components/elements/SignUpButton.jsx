import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import axios from "axios"

export const SignUpButton = () => {
  const { user } = useUser();
  useEffect(()=>{
    if(user){
      // console.log(user);
      const fullName = user.fullName;
      const email = user.primaryEmailAddress.emailAddress;

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
          <UserButton />
        </SignedIn>
      </header>
    </>
  )
}