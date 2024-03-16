const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Importing database connection
require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the actual origin of your frontend application
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as needed
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


// Routes
const userRouter = require('./api/User');
app.use('/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
