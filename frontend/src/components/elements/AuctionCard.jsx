import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export const AuctionCard = ({ auction, isEnded }) => {
  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft());

  function getInitialTimeLeft() {
    const start = new Date(auction.startTime).getTime();
    const now = Date.now();
    const durationMs = auction.duration * 60 * 1000; // duration in ms
    const end = start + durationMs;
    return Math.max(0, Math.floor((end - now) / 1000)); // in seconds
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [auction.startTime, auction.duration]);

  // Format timeLeft as hh:mm:ss
  function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  }

  // If auction hasn't started yet, show time until start
  const now = Date.now();
  const start = new Date(auction.startTime).getTime();
  let countdownDisplay = "";
  if (now < start) {
    const secsToStart = Math.max(0, Math.floor((start - now) / 1000));
    countdownDisplay = `Starts in: ${formatTime(secsToStart)}`;
  } else if (timeLeft > 0) {
    countdownDisplay = `Time left: ${formatTime(timeLeft)}`;
  } else {
    countdownDisplay = "Auction ended";
  }

  return (
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
          <p>Duration: {auction.duration} minutes</p>
          <p>Seller: {auction.sellerName}</p>
          <div className="font-bold text-lg mt-2">{countdownDisplay}</div>
        </div>
        <NavLink to={`/auction/${auction._id}`}>
          <button className="btn btn-accent w-[100%]" disabled={isEnded}>Details</button>
        </NavLink>
      </div>
    </>
  );
};