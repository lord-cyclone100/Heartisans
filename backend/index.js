import express from 'express'
import cors from 'cors'
import { connectDB } from './database/db.js';
import { userModel } from './models/userModel.js';
import { shopCardModel } from './models/shopCardModel.js';
import { auctionModel } from './models/auctionModel.js';
import { cartModel } from './models/cartModel.js';
import { v2 as cloudinary } from 'cloudinary';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const app = express();
const port = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  // Join auction room
  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
  });
  socket.on("placeBid", async ({ auctionId, userId, userName, amount }) => {
    try {
      const auction = await auctionModel.findById(auctionId);

      // Prevent auction creator from bidding
      if (auction.sellerId.toString() === userId.toString()) {
        socket.emit("bidError", { error: "You cannot bid on your own auction." });
        return;
      }

      // Auction time checks
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

      // Bid amount check
      const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.basePrice;
      if (amount <= highestBid) {
        socket.emit("bidError", { error: "Bid too low" });
        return;
      }

      // Add bid
      auction.bids.push({ userId, userName, amount });
      await auction.save();

      // Emit updated auction to all in the room
      io.to(auctionId).emit("auctionUpdate", auction);
    } catch (err) {
      socket.emit("bidError", { error: "Failed to place bid" });
    }
  });
});

const corsOptions = {
  origin:"http://localhost:5173",
  methods:["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials:true
}

app.use(cors(corsOptions));
app.use(express.json())

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})


const MERCHANT_ID = process.env.MERCHANT_ID
const MERCHANT_KEY = process.env.MERCHANT_KEY
const BASE_URL = process.env.BASE_URL
const STATUS_URL = process.env.STATUS_URL

const redirecturl = `http://localhost:${port}/status`
const successurl = `http://localhost:${port}/payment-success`
const failureurl = `http://localhost:${port}/payment-failure`




// const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
// const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
// const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || "https://sandbox.cashfree.com/pg";

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);


app.get('/',(req,res)=>{
  res.status(200).send("Hello World");
})

app.get('/api/cloudinary-signature', (req, res) => {
  const timestamp = Math.round((new Date).getTime()/1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.API_SECRET
  );
  res.json({
    timestamp,
    signature,
    apiKey: process.env.API_KEY || 'YOUR_API_KEY',
    cloudName: process.env.CLOUD_NAME || 'YOUR_CLOUD_NAME'
  });
});

app.post('/api/user', async (req, res) => {
  try {
    const { userName, email, imageUrl, fullName } = req.body;
    // Save user only if not exists
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({ userName, email, imageUrl, fullName });
    }
    res.status(201).json({ message: "User saved", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

// GET user by id
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.patch('/api/user/:id/artisan', async (req, res) => {
  try {
    const { isArtisan } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isArtisan },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update artisan status" });
  }
});

app.get('/api/user/email/:email', async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post('/api/shopcards', async (req, res) => {
  try {
    const card = await shopCardModel.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create shop card" });
  }
});

app.get('/api/shopcards', async (req, res) => {
  try {
    const cards = await shopCardModel.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards" });
  }
});

// Get products by category
app.get('/api/shopcards/category/:category', async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productCategory: req.params.category });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by category" });
  }
});

// Get products by state
app.get('/api/shopcards/state/:state', async (req, res) => {
  try {
    const cards = await shopCardModel.find({ productState: req.params.state });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shop cards by state" });
  }
});

app.get('/api/shopcards/:id', async (req, res) => {
  try {
    const card = await shopCardModel.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Product not found" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Create a new auction
app.post('/api/auctions', async (req, res) => {
  try {
    const auction = await auctionModel.create(req.body);
    res.status(201).json(auction);
  } catch (err) {
    console.error("Auction creation error:", err);
    res.status(500).json({ error: "Failed to create auction"});
  }
});

// Get all auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const auctions = await auctionModel.find();
    const now = Date.now();
    for (const auction of auctions) {
      const start = new Date(auction.startTime).getTime();
      const end = start + auction.duration * 60 * 1000; // duration in ms
      let changed = false;
      if (now >= start && now < end && (!auction.hasBegun || auction.hasEnded)) {
        auction.hasBegun = true;
        auction.hasEnded = false;
        changed = true;
      }
      if (now >= end && !auction.hasEnded) {
        auction.hasEnded = true;
        changed = true;
      }
      if (now < start && (auction.hasBegun || auction.hasEnded)) {
        auction.hasBegun = false;
        auction.hasEnded = false;
        changed = true;
      }
      if (changed) await auction.save();
    }
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

// Get a single auction
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await auctionModel.findById(req.params.id);
    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch auction" });
  }
});

// Place a bid
app.post('/api/auctions/:id/bid', async (req, res) => {
  try {
    const { userId, userName, amount } = req.body;
    const auction = await auctionModel.findById(req.params.id);

    // Prevent auction creator from bidding
    if (auction.sellerId.toString() === userId.toString()) {
      return res.status(400).json({ error: "You cannot bid on your own auction." });
    }

    // Check if auction has started and not ended
    const now = new Date();
    const auctionEnd = new Date(auction.startTime.getTime() + auction.duration * 1000);
    if (now < auction.startTime) return res.status(400).json({ error: "Auction not started" });
    if (now > auctionEnd) return res.status(400).json({ error: "Auction ended" });

    // Check if bid is higher than current highest or base price
    const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map(b => b.amount)) : auction.basePrice;
    if (amount <= highestBid) return res.status(400).json({ error: "Bid too low" });

    // Add bid
    auction.bids.push({ userId, userName, amount });
    await auction.save();

    res.json(auction);
  } catch (err) {
    res.status(500).json({ error: "Failed to place bid" });
  }
});

// Add item to cart
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, productName, productImageUrl, productPrice, productCategory } = req.body;
    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, productName, productImageUrl, productPrice, productCategory }]
      });
    } else {
      const item = cart.items.find(i => i.productId.toString() === productId);
      if (!item) {
        cart.items.push({ productId, productName, productImageUrl, productPrice, productCategory });
      }
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Get user's cart
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post('/api/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await cartModel.findOne({ userId });
    if (!cart) return res.json({ success: true });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

//PhonePe payment gateway
// app.post('/create-order',async(req,res)=>{
//   const {name,mobile,amount} = req.body;
//   const orderId = uuidv4()

//   const payLoad = {
//     merchantId:MERCHANT_ID,
//     merchantUserId:name,
//     mobileNumber:mobile,
//     amount:amount*100,
//     merchantTransactionId:orderId,
//     redirectUrl:`${redirecturl}/?id=${orderId}`,
//     redirectMode:'POST',
//     paymentInstrument:{
//       type:'PAY_PAGE'
//     }
//   }
//   const newPayLoad = Buffer.from(JSON.stringify(payLoad)).toString('base64');
//   const keyIndex = 1;
//   const str = newPayLoad + '/pg/v1/pay' + MERCHANT_KEY
//   const sha256 = crypto.createHash('sha256').update(str).digest('hex')
//   const checksum = sha256 + '###' + keyIndex

//   const option = {
//     method:'POST',
//     url:BASE_URL,
//     headers:{
//       accept:'application/json',
//       'Content-Type':'application/json',
//       'X-VERIFY':checksum,
//       'X-MERCHANT-ID': MERCHANT_ID
//     },
//     data:{
//       request:newPayLoad
//     }

//   }
//   try {
//     const response = await axios.request(option)
//     console.log("PhonePe API response:", response.data);
//     const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
//     res.status(200).json({ url: redirectUrl });
//   } catch (error) {
//     console.log(error);
//   }
// })





const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

app.post('/create-order', async (req, res) => {
  try{
    const { name, mobile, amount } = req.body;
    const orderId = generateOrderId();

    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: name,
        customer_email: "test@example.com", // Replace with actual email if available
        customer_phone: mobile.toString()
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-success?order_id=${orderId}`,
        // notify_url: `http://localhost:5000/api/payment/webhook`,
        payment_methods: "cc,dc,upi"
      },
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      // order_note: `Booking for ${patientName} - ${reason}`,
    };

    console.log('Creating Cashfree order with data:', orderPayload);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderPayload);
    console.log('Cashfree response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {
      res.json({
        success: true,
        message: 'Order created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create payment session');
    }
  }

  catch(error) {
    console.error('Booking error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create booking',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});







app.post('/payment/verify', async (req, res) => {
  try {
    console.log("Hello");
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    console.log(`Verifying pay for order: ${orderId}`);

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    

    // // Update booking status in database
    // const booking = await Booking.findOne({ orderId });
    // if (booking) {
    //   console.log(`Updating booking ${orderId} from status: ${booking.status} to: ${orderStatus}`);
      
    //   // Handle different payment statuses
    //   switch (orderStatus) {
    //     case 'PAID':
    //       booking.status = 'paid';
    //       booking.paymentId = paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED';
    //       booking.paymentMethod = paymentDetails.payment_method;
    //       booking.paymentTime = paymentDetails.payment_time;
    //       booking.bankReference = paymentDetails.bank_reference;
    //       console.log(`Payment verified as successful for order ${orderId}`);
    //       break;
          
    //     case 'EXPIRED':
    //       booking.status = 'cancelled';
    //       console.log(`Payment expired for order ${orderId}`);
    //       break;
          
    //     case 'FAILED':
    //       booking.status = 'failed';
    //       booking.paymentMessage = paymentDetails.payment_message;
    //       console.log(`Payment failed for order ${orderId}`);
    //       break;
          
    //     case 'PENDING':
    //       booking.status = 'pending';
    //       console.log(`Payment still pending for order ${orderId}`);
    //       break;
          
    //     default:
    //       console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
    //       booking.status = orderStatus.toLowerCase();
    //   }
      
    //   await booking.save();
    //   console.log(`Booking ${orderId} updated successfully`);

    //   // Return both verification result and booking data
    //   res.json({
    //     success: true,
    //     orderStatus: orderStatus,
    //     bookingStatus: booking.status,
    //     paymentDetails: paymentDetails,
    //     booking: {
    //       id: booking._id,
    //       patientName: booking.patientName,
    //       email: booking.email,
    //       mobileNumber: booking.mobileNumber,
    //       bookingDateTime: booking.bookingDateTime,
    //       reason: booking.reason,
    //       status: booking.status,
    //       orderId: booking.orderId,
    //       amount: booking.amount,
    //       paymentId: booking.paymentId,
    //       paymentMethod: booking.paymentMethod,
    //       paymentTime: booking.paymentTime,
    //       bankReference: booking.bankReference,
    //       paymentMessage: booking.paymentMessage,
    //       createdAt: booking.createdAt,
    //       updatedAt: booking.updatedAt
    //     }
    //   });
    // } else {
    //   console.error(`Booking not found for orderId: ${orderId}`);
    //   res.status(404).json({
    //     success: false,
    //     message: 'Booking not found',
    //     orderStatus: orderStatus
    //   });
    // }




  res.json({
      success: orderStatus === 'PAID',
      orderStatus,
      paymentDetails,
      orderId,
      amount: cashfreeResponse.data.order_amount,
      paymentMethod: paymentDetails.payment_method,
      paymentId: paymentDetails.payment_id || paymentDetails.auth_id,
      paymentTime: paymentDetails.payment_time,
      bankReference: paymentDetails.bank_reference,
      paymentMessage: paymentDetails.payment_message,
    });





  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to vrify payment',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});








// app.post('/status',async(req,res)=>{
//   const merchantTransactionId = req.query.id
//   const keyIndex = 1;
//   const str = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY
//   const sha256 = crypto.createHash('sha256').update(str).digest('hex')
//   const checksum = sha256 + '###' + keyIndex

//   const option = {
//     method:'GET',
//     url:`${STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
//     headers:{
//       accept:'application/json',
//       'Content-Type':'application/json',
//       'X-VERIFY':checksum,
//       'X-MERCHANT-ID': MERCHANT_ID
//     },

//   }
//   axios.request(option).then((response)=>{
//     if(response.data.success === true){
//       res.redirect(successurl)
//     }
//     else{
//       res.redirect(failureurl)
//     }
//   })
// })

// app.get('/payment-success', (req, res) => {
//   res.redirect('http://localhost:5173/payment-success')
// });

// app.get('/payment-failure', (req, res) => {
//   res.send('Payment Failed!');
// });


app.get('/api/wallet/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ balance: user.balance, userName: user.userName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});


connectDB().then(()=>{
  server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
  })
})