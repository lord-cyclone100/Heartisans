import { create } from 'zustand'

export const useUserLogin = create((set)=> ({
  isLoggedIn : false,
  setIsLoggedIn : (val) => set({isLoggedIn:val})
}))
