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
  let statusColor = "";
  let statusBg = "";
  
  if (now < start) {
    const secsToStart = Math.max(0, Math.floor((start - now) / 1000));
    countdownDisplay = `Starts in: ${formatTime(secsToStart)}`;
    statusColor = "text-blue-600";
    statusBg = "bg-blue-100";
  } else if (timeLeft > 0) {
    countdownDisplay = `Time left: ${formatTime(timeLeft)}`;
    statusColor = "text-green-600";
    statusBg = "bg-green-100";
  } else {
    countdownDisplay = "Auction ended";
    statusColor = "text-gray-600";
    statusBg = "bg-gray-100";
  }

  const highestBid = auction.bids && auction.bids.length > 0 
    ? Math.max(...auction.bids.map(b => b.amount)) 
    : auction.basePrice;

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 overflow-hidden transform hover:scale-105 w-full max-w-sm mx-auto">
        {/* Image Section */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden">
          <img
            src={auction.productImageUrl}
            alt={auction.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`${statusBg} ${statusColor} px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
              {isEnded ? "ENDED" : timeLeft > 0 ? "LIVE" : "UPCOMING"}
            </span>
          </div>
          
          {/* Current Bid */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
              <div className="text-sm md:text-base text-green-600 font-medium">Current Bid</div>
              <span className="text-green-800 font-bold text-2xl md:text-3xl">₹{highestBid}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6">
          {/* Product Name */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 mb-3 line-clamp-2 group-hover:text-green-900 transition-colors">
            {auction.productName}
          </h3>
          
          {/* Description */}
          <p className="text-green-600 text-base md:text-lg lg:text-xl mb-4 line-clamp-2">
            {auction.productDescription}
          </p>

          {/* Auction Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-base md:text-lg">
              <span className="text-green-600">Base Price:</span>
              <span className="font-semibold text-green-800">₹{auction.basePrice}</span>
            </div>
            <div className="flex justify-between items-center text-base md:text-lg">
              <span className="text-green-600">Duration:</span>
              <span className="font-semibold text-green-800">{auction.duration} min</span>
            </div>
            <div className="flex justify-between items-center text-base md:text-lg">
              <span className="text-green-600">Seller:</span>
              <span className="font-semibold text-green-800">{auction.sellerName}</span>
            </div>
          </div>

          {/* Start Time */}
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="text-sm md:text-base text-green-600 font-medium mb-1">Auction Start</div>
            <div className="text-base md:text-lg font-semibold text-green-800">
              {new Date(auction.startTime).toLocaleDateString()} at{" "}
              {new Date(auction.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Countdown */}
          <div className={`${statusBg} rounded-lg p-3 mb-4`}>
            <div className={`font-bold text-xl md:text-2xl lg:text-3xl text-center ${statusColor}`}>
              {countdownDisplay}
            </div>
          </div>

          {/* Action Button */}
          <NavLink to={`/auction/${auction._id}`} className="block">
            <button 
              className={`w-full py-3 rounded-xl text-xl md:text-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isEnded 
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600" 
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              }`}
            >
              {isEnded ? "View Auction Results" : "View Details & Bid"}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};