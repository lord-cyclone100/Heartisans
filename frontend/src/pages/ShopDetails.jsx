import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ShopCard } from "../components/elements/ShopCard";

export const ShopDetails = () => {
  const params = useParams();
  const [cards, setCards] = useState([])
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/shopcards/category/${params.name}`)
    .then(res=>{
      if(res.data.length > 0){
        setCards(res.data)
      }
      else{
        axios.get(`http://localhost:5000/api/shopcards/state/${params.name}`)
        .then(res2=>setCards(res2.data))
        .catch(()=>setCards([]))
      }
    })
    .catch(()=>setCards([]))
  },[])
  // console.log(params);
  return(
    <>
    <section>
      <div>
        <div className="w-full h-[10vh]"></div>
        <div id="item" className="size-44 bg-emerald-300 mx-50 my-20">
          <img src={`/photos/${params.name}.svg`} className="scale-150" alt="" />
          <p>{params.name}</p>
        </div>
        <div className="w-full flex items-center justify-center gap-12 flex-wrap py-20">
          {
            cards.map((card)=>(
              <ShopCard key={card._id} card={card}/>
            ))
          }

        </div>
      </div>
    </section>
      
    </>
  )
}