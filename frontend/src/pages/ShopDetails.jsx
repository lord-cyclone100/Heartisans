import { useParams } from "react-router-dom"

export const ShopDetails = () => {
  const params = useParams();
  // console.log(params);
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <div id="item" className="size-50 bg-emerald-300">{params.name}</div>
    </>
  )
}