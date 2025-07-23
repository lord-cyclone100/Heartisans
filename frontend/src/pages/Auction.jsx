import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionCard } from "../components/elements/AuctionCard";

export const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [tab, setTab] = useState("Live");

  useEffect(() => {
    axios.get("http://localhost:5000/api/auctions")
      .then(res => setAuctions(res.data))
      .catch(() => setAuctions([]));
  }, []);

  const liveAuctions = auctions.filter(a => a.hasBegun && !a.hasEnded);
  const upcomingAuctions = auctions.filter(a => !a.hasBegun && !a.hasEnded);
  const endedAuctions = auctions.filter(a => a.hasEnded);

  let displayedAuctions = [];
  if (tab === "Live") displayedAuctions = liveAuctions;
  if (tab === "Upcoming") displayedAuctions = upcomingAuctions;
  if (tab === "Ended") displayedAuctions = endedAuctions;

  return (
    <>
      <section>
        <div>
          <div className="w-full h-[10vh]"></div>
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              className={`btn ${tab === "Live" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab("Live")}
            >
              Live
            </button>
            <button
              className={`btn ${tab === "Upcoming" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab("Upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`btn ${tab === "Ended" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab("Ended")}
            >
              Ended
            </button>
          </div>
          <div className="flex flex-wrap gap-8 justify-center py-10">
            {displayedAuctions.length === 0 && (
              <div className="text-center text-gray-500">No auctions in this category.</div>
            )}
            {displayedAuctions.map(auction => (
              <AuctionCard
                key={auction._id}
                auction={auction}
                isEnded={auction.hasEnded}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};