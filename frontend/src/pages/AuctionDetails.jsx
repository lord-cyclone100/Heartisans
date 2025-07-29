import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { AuctionLeaderBoard } from "../components/elements/AuctionLeaderBoard";

const socket = io("http://localhost:5000");

export const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDisabled, setBidDisabled] = useState(true);
  const [msg, setMsg] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [mongoUserId, setMongoUserId] = useState("");

  // Fetch MongoDB user ID using Clerk email
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      axios
        .get(
          `http://localhost:5000/api/user/email/${user.emailAddresses[0].emailAddress}`
        )
        .then((res) => setMongoUserId(res.data._id))
        .catch(() => setMongoUserId(""));
    }
  }, [user]);

  // Fetch auction details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auctions/${id}`)
      .then((res) => setAuction(res.data))
      .catch(() => setAuction(null));
  }, [id]);

  // Socket.io: join auction room and listen for updates
  useEffect(() => {
    if (!auction) return;
    socket.emit("joinAuction", id);

    socket.on("auctionUpdate", (updatedAuction) => {
      setAuction(updatedAuction);
      setMsg("New bid placed!");
    });

    socket.on("bidError", (err) => {
      setMsg(err.error);
    });

    return () => {
      socket.off("auctionUpdate");
      socket.off("bidError");
    };
  }, [auction, id]);

// Update leaderboard whenever auction changes
useEffect(() => {
  if (!auction) return;
  // Map to keep only the highest bid per user
  const userHighestBids = {};
  auction.bids.forEach(bid => {
    if (
      !userHighestBids[bid.userId] ||
      bid.amount > userHighestBids[bid.userId].amount
    ) {
      userHighestBids[bid.userId] = bid;
    }
  });
  // Get all highest bids and sort descending
  const sorted = Object.values(userHighestBids)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  setLeaderboard(sorted);
}, [auction]);

  // Find highest bid and highest bidder
  const highestBid = auction && auction.bids.length > 0
    ? Math.max(...auction.bids.map((b) => b.amount))
    : auction?.basePrice;

  const highestBidObj = auction && auction.bids.length > 0
    ? auction.bids.reduce((max, b) => (b.amount > max.amount ? b : max), auction.bids[0])
    : null;

  const isCurrentUserHighestBidder =
    highestBidObj && highestBidObj.userId === mongoUserId;

  // Enable/disable bid button logic
  const isAuctionCreator = auction && mongoUserId === auction.sellerId;
  useEffect(() => {
  if (!auction || !mongoUserId) {
    setBidDisabled(true);
    return;
  }
  if (
    isAuctionCreator || // Prevent creator from bidding
    isCurrentUserHighestBidder ||
    (
      auction.bids.length === 0
        ? Number(bidAmount) < auction.basePrice || Number(bidAmount) <= 0
        : Number(bidAmount) <= highestBid || Number(bidAmount) <= 0
    )
  ) {
    setBidDisabled(true);
  } else {
    setBidDisabled(false);
  }
}, [bidAmount, auction, mongoUserId, isCurrentUserHighestBidder, isAuctionCreator]);

  // Place bid handler
  const handleBid = () => {
    if (!mongoUserId || !auction) return;
    setBidDisabled(true);
    setMsg("");
    socket.emit("placeBid", {
      auctionId: id,
      userId: mongoUserId,
      userName: user.fullName,
      amount: Number(bidAmount),
    });
    setBidAmount("");
  };

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center font-mhlk">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto mb-4"></div>
          <p className="text-2xl text-green-700 font-semibold">Loading auction details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 min-h-screen py-40 font-mhlk">
        <div className="w-full h-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Auction Image and Basic Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={auction.productImageUrl}
                    alt={auction.productName}
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Live Auction
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {auction.productName}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                    {auction.productDescription}
                  </p>
                  
                  {/* Current Bid Display */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-90">Base Price</p>
                        <p className="text-2xl font-bold">₹{auction.basePrice}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Current Highest</p>
                        <p className="text-2xl font-bold">₹{highestBid}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Auction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Seller</p>
                      <p className="text-lg font-semibold text-gray-900">{auction.sellerName}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{auction.duration} minutes</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <p className="text-sm font-medium text-gray-500 mb-1">Start Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(auction.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bidding Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Place Your Bid</h2>
                
                {/* Status Messages */}
                {isCurrentUserHighestBidder && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <p className="text-green-800 font-semibold text-lg">
                        You are currently the highest bidder!
                      </p>
                    </div>
                  </div>
                )}
                
                {isAuctionCreator && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      <p className="text-orange-800 font-semibold text-lg">
                        You cannot bid on your own auction.
                      </p>
                    </div>
                  </div>
                )}
                
                {msg && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <p className="text-red-800 font-semibold text-lg">{msg}</p>
                    </div>
                  </div>
                )}
                
                {/* Bid Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={
                        auction.bids.length === 0
                          ? auction.basePrice
                          : highestBid + 1
                      }
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={
                        auction.bids.length === 0
                          ? `Enter bid ≥ ₹${auction.basePrice}`
                          : `Enter bid > ₹${highestBid}`
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    />
                  </div>
                  
                  <button
                    className={`w-full py-4 px-8 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      bidDisabled
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                    disabled={bidDisabled}
                    onClick={handleBid}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
              
              {/* Leaderboard */}
              <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <h3 className="text-xl font-bold text-white">Bid Leaderboard</h3>
                </div>
                <AuctionLeaderBoard leaderboard={leaderboard} mongoUserId={mongoUserId} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};