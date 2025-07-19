import { useState } from 'react';
import { SignUpButton } from './SignUpButton';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className='h-[10vh] w-full bg-white/10 backdrop-blur-lg border-b border-white/40  px-40 flex items-center justify-between fixed z-10'>
        <div>
          <h1 className='text-4xl font-black text-white'>Heartisans</h1>
        </div>
        <SignUpButton/>
      </nav>
    </>
    
  );
}
