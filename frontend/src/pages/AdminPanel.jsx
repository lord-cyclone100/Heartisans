import { useEffect, useState } from "react"
import { ShopCard } from "../components/elements/ShopCard"
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
      <div className="w-full flex items-center justify-center gap-12 flex-wrap py-20">
        {
          cards.map((card)=>(
            <ShopCard key={card._id} card={card}/>
          ))
        }

      </div>
    </>
  )
}