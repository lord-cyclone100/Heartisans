import { NavLink } from "react-router-dom"

export const AuctionCard = ({auction}) => {
  return(
    <>
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            src={auction.productImageUrl}
            alt={auction.productName}
            className="h-60 w-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{auction.productName}</h2>
          <p>{auction.productDescription}</p>
          <p>Base Price: Rs {auction.basePrice}</p>
          <p>Starts: {new Date(auction.startTime).toLocaleString()}</p>
          <p>Duration: {auction.duration} seconds</p>
          <p>Seller: {auction.sellerName}</p>
          {/* Add a link/button to view/join the auction */}
        </div>
        <NavLink to={`/auction/${auction._id}`} ><button className="btn btn-accent w-[100%]">Details</button></NavLink>
      </div>
    </>
  )
}