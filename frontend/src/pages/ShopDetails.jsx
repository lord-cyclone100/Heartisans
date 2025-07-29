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

  return(
    <>
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 font-mhlk">
        <div className="w-full h-[10vh]"></div>
        
        {/* Header Section */}
        <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-green-800 mb-4 font-mhlk">
              {params.name}
            </h1>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl lg:text-2xl text-green-600 max-w-2xl mx-auto">
              Discover authentic handcrafted items from {params.name}
            </p>
          </div>

          {/* Products Grid */}
          <div className="w-full">
            {cards.length > 0 ? (
              <>
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-2">
                    Featured Products
                  </h2>
                  <p className="text-lg md:text-xl text-green-600">
                    {cards.length} {cards.length === 1 ? 'item' : 'items'} available
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
                  {cards.map((card) => (
                    <ShopCard key={card._id} card={card}/>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 lg:p-12 mx-auto max-w-2xl">
                <div className="text-center py-8 md:py-16">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-green-800 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-lg md:text-xl text-green-600 mb-6">
                    We're currently updating our {params.name} collection. Please check back soon!
                  </p>
                  <button 
                    onClick={() => window.history.back()} 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}