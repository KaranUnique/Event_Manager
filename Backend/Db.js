const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Login = require('./Routes/Login');
const SignUp = require('./Routes/Signup');
const Event = require('./Routes/Event');

require('dotenv').config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // adjust as needed
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Server port
const PORT = process.env.SERVER_PORT || 7120;

// MongoDB Atlas connection string
const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.8sjynal.mongodb.net/Event_Management_System?retryWrites=true&w=majority`;

// Connect to MongoDB Atlas
mongoose.connect(connectionString)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas Successfully 🚀");

    // Routes
    app.use('/login', Login);
    app.use('/user', SignUp);
    app.use('/event', Event);

    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB Atlas:", error.message);
    process.exit(1); // Exit process if DB connection fails
  });
