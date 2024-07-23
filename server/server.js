const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

require('./config/db');

const paypal = require('./paypal/paypal_config');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  }
});

const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(cookieParser());


// Importing models
const Message = require('./model/Message.js');

const userRouter = require('./api/User');
const otpRouter = require('./api/Otp.js');
// const admin_route = require('./api/Admin.js');
const friendrequest = require('./api/Friend_request.js');
const paypalRouter = require('./api/PaypalRoute.js');
const messageRouter = require('./api/MessageRoutes.js');

app.use('/user', userRouter);
app.use('/otp', otpRouter);
app.use('/friend', friendrequest);
// app.use('/admin', admin_route);
app.use('/paypal', paypalRouter);
app.use('/api', messageRouter); // Use message routes

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

let users = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ userId }) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', { senderId, message });
    }

    // Save the message to the database
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
