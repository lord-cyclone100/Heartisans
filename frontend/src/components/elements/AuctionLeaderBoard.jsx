export const AuctionLeaderBoard = ({ leaderboard, mongoUserId }) => {
  return (
    <div className="p-6">
      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No bids yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to place a bid!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((bid, idx) => (
            <div
              key={bid.userId}
              className={`relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                mongoUserId === bid.userId 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105" 
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                idx === 0 
                  ? "bg-yellow-400 text-yellow-900" 
                  : idx === 1 
                  ? "bg-gray-300 text-gray-700" 
                  : idx === 2 
                  ? "bg-amber-600 text-white" 
                  : mongoUserId === bid.userId
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {idx + 1}
              </div>
              
              {/* Crown for #1 */}
              {idx === 0 && (
                <div className="absolute -top-2 left-8">
                  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 9l5.5 3.5L12 7l3.5 5.5L21 9l-2 7H5z"/>
                  </svg>
                </div>
              )}
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-lg truncate ${
                  mongoUserId === bid.userId ? "text-white" : "text-gray-900"
                }`}>
                  {bid.userName}
                  {mongoUserId === bid.userId && (
                    <span className="ml-2 text-sm font-normal opacity-90">(You)</span>
                  )}
                </div>
                <div className={`text-sm ${
                  mongoUserId === bid.userId ? "text-white/80" : "text-gray-500"
                }`}>
                  {idx === 0 ? "Leading bidder" : `#${idx + 1} position`}
                </div>
              </div>
              
              {/* Bid Amount */}
              <div className="text-right">
                <div className={`text-xl font-bold ${
                  mongoUserId === bid.userId ? "text-white" : "text-gray-900"
                }`}>
                  ₹{bid.amount.toLocaleString()}
                </div>
                {idx === 0 && (
                  <div className={`text-sm font-medium ${
                    mongoUserId === bid.userId ? "text-white/80" : "text-green-600"
                  }`}>
                    Highest Bid
                  </div>
                )}
              </div>
              
              {/* Winner Indicator */}
              {idx === 0 && (
                <div className="absolute -right-1 -top-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{leaderboard.length}</div>
                <div className="text-sm text-gray-500">Total Bidders</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">
                  ₹{leaderboard.length > 0 ? leaderboard[0].amount.toLocaleString() : '0'}
                </div>
                <div className="text-sm text-gray-500">Highest Bid</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};