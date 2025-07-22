import { NavLink } from "react-router-dom"

export const ShopCard = ({card}) => {
  return(
    <>
      <div className="card bg-base-100 w-96 shadow-2xl border-1">
        <figure>
          <img
            src={card.productImageUrl}
            alt={card.productName} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {card.productName}
            <div className="badge badge-secondary">NEW</div>
          </h2>
          <p>{card.productSellerName}</p>
          <h1>{`Rs ${card.productPrice}`}</h1>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">{card.productCategory}</div>
            <div className="badge badge-outline">{card.productState}</div>
          </div>
          <NavLink to={`/shop/${card.productCategory}/${card._id}`} ><button className="btn btn-accent w-[100%]">Details</button></NavLink>
        </div>
      </div>
    </>
  )
}