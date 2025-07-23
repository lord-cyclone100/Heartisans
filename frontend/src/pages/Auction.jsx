import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionCard } from "../components/elements/AuctionCard";

export const Auction = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/auctions")
      .then(res => setAuctions(res.data))
      .catch(() => setAuctions([]));
  }, []);

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          <div className="flex flex-wrap gap-8 justify-center py-10">
            {auctions.map(auction => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};