import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionCard } from "../components/elements/AuctionCard";
import { useScrollToTop } from "../hooks/useScrollToTop";

export const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [tab, setTab] = useState("Live");
  useScrollToTop();

  useEffect(() => {
    axios.get("https://heartisans-1.onrender.com/api/auctions")
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
      <section className="min-h-screen font-mhlk" style={{ background: 'linear-gradient(to bottom right, #e8f5e8, #f0f9f0)' }}>
        <div className="w-full h-[10vh]"></div>
        
        {/* Hero Section */}
        <div className="text-center py-8 md:py-12 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 font-mhlk" style={{ color: '#479626' }}>
            Live Auctions
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#479626' }}>
            Bid on unique handcrafted treasures from talented artisans
          </p>
        </div>

        {/* Content Container */}
        <div className="w-full px-4 md:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <button
              className={`px-6 py-3 md:px-8 md:py-4 rounded-full text-lg md:text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                tab === "Live" 
                  ? "text-white" 
                  : "bg-white border-2 hover:border-primary"
              }`}
              style={tab === "Live" ? { backgroundColor: '#ffaf27' } : { color: '#479626', borderColor: '#479626' }}
              onClick={() => setTab("Live")}
            >
              Live ({liveAuctions.length})
            </button>
            <button
              className={`px-6 py-3 md:px-8 md:py-4 rounded-full text-lg md:text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                tab === "Upcoming" 
                  ? "text-white" 
                  : "bg-white border-2 hover:border-primary"
              }`}
              style={tab === "Upcoming" ? { backgroundColor: '#ffaf27' } : { color: '#479626', borderColor: '#479626' }}
              onClick={() => setTab("Upcoming")}
            >
              Upcoming ({upcomingAuctions.length})
            </button>
            <button
              className={`px-6 py-3 md:px-8 md:py-4 rounded-full text-lg md:text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                tab === "Ended" 
                  ? "text-white" 
                  : "bg-white border-2 hover:border-primary"
              }`}
              style={tab === "Ended" ? { backgroundColor: '#ffaf27' } : { color: '#479626', borderColor: '#479626' }}
              onClick={() => setTab("Ended")}
            >
              Ended ({endedAuctions.length})
            </button>
          </div>

          {/* Auctions Grid */}
          <div className="w-full">
            {displayedAuctions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mx-auto max-w-2xl">
                <div className="text-center py-8">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#e8f5e8' }}>
                    <svg className="w-12 h-12" style={{ color: '#479626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: '#479626' }}>
                    No {tab} Auctions
                  </h3>
                  <p className="text-lg md:text-xl" style={{ color: '#479626' }}>
                    {tab === "Live" && "No auctions are currently live. Check upcoming auctions!"}
                    {tab === "Upcoming" && "No upcoming auctions scheduled. Check back later!"}
                    {tab === "Ended" && "No ended auctions to display."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2" style={{ color: '#479626' }}>
                    {tab} Auctions
                  </h2>
                  <p className="text-lg md:text-xl" style={{ color: '#479626' }}>
                    {displayedAuctions.length} {displayedAuctions.length === 1 ? 'auction' : 'auctions'} available
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
                  {displayedAuctions.map(auction => (
                    <AuctionCard
                      key={auction._id}
                      auction={auction}
                      isEnded={auction.hasEnded}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};