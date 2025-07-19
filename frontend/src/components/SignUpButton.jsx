import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"

export const SignUpButton = () => {
  const { user } = useUser();
  if(user){
    console.log(user);
  }
  return(
    <>
      <header className="text-2xl px-8 py-6 btn btn-primary">
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