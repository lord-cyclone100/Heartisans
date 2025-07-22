import { useEffect, useState } from "react"
import axios from "axios"

export const AdminPanel = () => {
  const [cards, setCards] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:5000/api/shopcards")
    .then(res=>setCards(res.data))
    .catch(()=>setCards([]))
  },[])
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <h1>Admin</h1>
      
    </>
  )
}