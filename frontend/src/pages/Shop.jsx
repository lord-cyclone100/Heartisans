import { NavLink } from "react-router-dom"
import { shopCategories, shopStates } from "../constants/constants"
export const Shop = () => {
  return(
    <>
      <section>
        <div className="bg-[#eee] font-mhlk py-10">
          <div className="w-full h-[10vh]"></div>
          <div>
            <h1 className="text-[3rem] text-center py-16">Shop by category</h1>
            <div className="flex gap-16 w-full items-center justify-center px-20 flex-wrap">
              {
                shopCategories.map((item,idx)=>(
                  <NavLink to={`/shop/${item.name}`}>
                    <div id="item" key={idx} className="size-44 bg-emerald-300">{item.name}</div>
                  </NavLink>
                ))
              }
            </div>
          </div>
          <div>
            <h1 className="text-[3rem] text-center py-16">Shop by States</h1>
            <div className="flex gap-20 w-full items-center justify-center px-20 flex-wrap">
              {
                shopStates.map((item,idx)=>(
                  <NavLink to={`/shop/${item.name}`}>
                    <div className="flex flex-col items-center gap-12">
                      <div key={idx} className="size-44 bg-emerald-300 rounded-full">
                        <img src={item.url} className="scale-150" alt="" />
                      </div>
                      <p>{item.name}</p>
                    </div>
                  </NavLink>
                ))
              }
            </div>
          </div>
        </div>
      </section>

    </>
  )
}