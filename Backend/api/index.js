const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

// Create the app
const app = express();

// Middleware
app.use(cors({
  origin: ['https://movie-corner-frontend-sage.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

// Routes
const userRoutes = require('../src/routes/userRoutes');
app.use("/auth", userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Export handler for Vercel
module.exports = app;
