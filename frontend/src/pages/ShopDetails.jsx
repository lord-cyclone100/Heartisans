import { useParams } from "react-router-dom"

export const ShopDetails = () => {
  const params = useParams();
  // console.log(params);
  return(
    <>
      <div className="w-full h-[10vh]"></div>
      <div id="item" className="size-44 bg-emerald-300 mx-50 my-20">
        <img src={`/photos/${params.name}.svg`} className="scale-150" alt="" />
      </div>
    </>
  )
}