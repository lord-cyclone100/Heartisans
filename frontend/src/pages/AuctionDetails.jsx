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
      <section>
        <div className="w-full h-[10vh]"></div>
        <div className="text-center mt-10">Loading or not found...</div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
            <img
              src={auction.productImageUrl}
              alt={auction.productName}
              className="size-full object-cover mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{auction.productName}</h2>
            <p className="mb-2">{auction.productDescription}</p>
            <p className="mb-1">Base Price: Rs {auction.basePrice}</p>
            <p className="mb-1">
              Current Highest Bid: Rs {highestBid}
            </p>
            <p className="mb-1">
              Starts: {new Date(auction.startTime).toLocaleString()}
            </p>
            <p className="mb-1">Duration: {auction.duration} minutes</p>
            <p className="mb-1">Seller: {auction.sellerName}</p>

            {/* Bid input and button */}
            <div className="flex gap-2 mt-4">
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
                    ? `Enter bid ≥ Rs ${auction.basePrice}`
                    : `Enter bid > Rs ${highestBid}`
                }
                className="input input-bordered flex-1"
              />
              <button
                className="btn btn-primary"
                disabled={bidDisabled}
                onClick={handleBid}
              >
                Bid
              </button>
            </div>
            {isCurrentUserHighestBidder && (
              <div className="mt-2 text-center text-green-600">
                You are currently the highest bidder!
              </div>
            )}
            {msg && (
              <div className="mt-2 text-center text-red-500">{msg}</div>
            )}
            {isAuctionCreator && (
              <div className="mt-2 text-center text-orange-600">
                You cannot bid on your own auction.
              </div>
            )}

            <AuctionLeaderBoard leaderboard={leaderboard} mongoUserId={mongoUserId} />
          </div>
        </div>
      </section>
    </>
  );
};