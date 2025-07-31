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
    statusColor = "text-white";
    statusBg = "#479626";
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
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 w-full max-w-sm mx-auto" style={{ border: '1px solid #479626' }}>
        {/* Image Section */}
        <div className="relative h-48 md:h-56 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
          <img
            src={auction.productImageUrl}
            alt={auction.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${statusColor}`} style={typeof statusBg === 'string' && statusBg.startsWith('#') ? { backgroundColor: statusBg } : { backgroundColor: statusBg }}>
              {isEnded ? "ENDED" : timeLeft > 0 ? "LIVE" : "UPCOMING"}
            </span>
          </div>
          
          {/* Current Bid */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
              <div className="text-sm md:text-base font-medium" style={{ color: '#479626' }}>Current Bid</div>
              <span className="font-bold text-2xl md:text-3xl" style={{ color: '#479626' }}>₹{highestBid}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6">
          {/* Product Name */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2 transition-colors" style={{ color: '#479626' }}>
            {auction.productName}
          </h3>
          
          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl mb-4 line-clamp-2" style={{ color: '#479626' }}>
            {auction.productDescription}
          </p>

          {/* Auction Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-base md:text-lg">
              <span style={{ color: '#479626' }}>Base Price:</span>
              <span className="font-semibold" style={{ color: '#479626' }}>₹{auction.basePrice}</span>
            </div>
            <div className="flex justify-between items-center text-base md:text-lg">
              <span style={{ color: '#479626' }}>Duration:</span>
              <span className="font-semibold" style={{ color: '#479626' }}>{auction.duration} min</span>
            </div>
            <div className="flex justify-between items-center text-base md:text-lg">
              <span style={{ color: '#479626' }}>Seller:</span>
              <span className="font-semibold" style={{ color: '#479626' }}>{auction.sellerName}</span>
            </div>
          </div>

          {/* Start Time */}
          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#e8f5e8' }}>
            <div className="text-sm md:text-base font-medium mb-1" style={{ color: '#479626' }}>Auction Start</div>
            <div className="text-base md:text-lg font-semibold" style={{ color: '#479626' }}>
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
                  : "text-white"
              }`}
              style={!isEnded ? { backgroundColor: '#ffaf27' } : {}}
            >
              {isEnded ? "View Auction Results" : "View Details & Bid"}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};