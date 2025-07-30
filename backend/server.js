import http from 'http';
import { connectDB } from './database/db.js';
import app from './app.js';
import { configureSocket } from './config/socket.js';

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Configure Socket.io with enhanced error handling
configureSocket(server);

// Enhanced server startup with error handling
const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 SAP Analytics endpoints available at /api/analytics`);
    });

    server.on('error', (error) => {
      console.error('💥 Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();