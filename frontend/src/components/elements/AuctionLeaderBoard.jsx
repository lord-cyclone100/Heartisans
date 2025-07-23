export const AuctionLeaderBoard = ({ leaderboard, mongoUserId }) => {
  return (
    <ul className="list bg-base-100 text-black rounded-box shadow-md p-4">
      <li className="pb-2 text-xs opacity-60 tracking-wide font-semibold">
        Leaderboard (Top 5 Bidders)
      </li>
      {leaderboard.length === 0 && (
        <li className="text-center opacity-70 py-4">No bids yet</li>
      )}
      {leaderboard.map((bid, idx) => (
        <li
          key={bid.userId}
          className={`list-row flex items-center gap-3 py-2 px-1 rounded ${
            mongoUserId === bid.userId ? "font-bold text-blue-100 bg-blue-700" : "text-black"
          }`}
        >
          <div className="text-2xl font-bold opacity-40 tabular-nums w-10 text-center">
            {(idx + 1).toString().padStart(2, "0")}
          </div>
          {/* Optionally, add a user avatar if available: */}
          {/* <div><img className="size-10 rounded-box" src={bid.userAvatarUrl || "/default-avatar.png"} /></div> */}
          <div className="list-col-grow flex-1">
            <div>{bid.userName}</div>
            {/* You can add more info here if needed */}
          </div>
          <div className="text-lg font-semibold">Rs {bid.amount}</div>
        </li>
      ))}
    </ul>
  );
};