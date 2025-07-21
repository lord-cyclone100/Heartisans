import { SignOutButton, useUser } from "@clerk/clerk-react"
import { useParams } from "react-router-dom";

export const UserDashBoard = () => {
  const { user } = useUser();
  const { id } = useParams();
  // console.log(typeof id);

  if (!user) {
    return <div className="text-center mt-10">Unauthorized or loading...</div>;
  }
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <div className="size-60 rounded-full bg-amber-300">
        <img src={user.imageUrl} alt="" />
      </div>
      <p>{user.fullName}</p>
      <p>{user.primaryEmailAddress.emailAddress}</p>
      <SignOutButton>
        <button className="btn btn-error mt-4">Log Out</button>
      </SignOutButton>
    </>
  )
}