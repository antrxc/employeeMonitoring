const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const webhookRoutes = require('./routes/webhook');

app.use(cors());
app.use(express.json());

// Real-time socket.io
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
});

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Pass Socket.io to req
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // Mount Routes
    app.use('/webhook', webhookRoutes);

    // Basic API
    app.get('/', (req, res) => {
      res.send('Biometric attendance backend running.');
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

const leaveRoutes = require('./routes/leaves');
app.use('/leaves', leaveRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);
