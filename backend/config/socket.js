import { Server } from 'socket.io';
import { auctionModel } from '../models/auctionModel.js';

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinAuction", (auctionId) => {
      socket.join(auctionId);
    });

    socket.on("placeBid", async ({ auctionId, userId, userName, amount }) => {
      try {
        const auction = await auctionModel.findById(auctionId);
        if (auction.sellerId.toString() === userId.toString()) {
          socket.emit("bidError", { error: "You cannot bid on your own auction." });
          return;
        }

        const now = new Date();
        const auctionEnd = new Date(auction.startTime.getTime() + auction.duration * 60 * 1000);
        if (now < auction.startTime) {
          socket.emit("bidError", { error: "Auction not started" });
          return;
        }
        if (now > auctionEnd) {
          socket.emit("bidError", { error: "Auction ended" });
          return;
        }

        const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.basePrice;
        if (amount <= highestBid) {
          socket.emit("bidError", { error: "Bid too low" });
          return;
        }

        auction.bids.push({ userId, userName, amount });
        await auction.save();
        io.to(auctionId).emit("auctionUpdate", auction);
      } catch (err) {
        socket.emit("bidError", { error: "Failed to place bid" });
      }
    });
  });
};