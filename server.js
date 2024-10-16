const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config(); // Load environment variables from .env

// Connect to MongoDB database
connectDB().then(() => {
  console.log("Database connected successfully.");
}).catch((error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

const app = express();
app.use(express.json());
app.use(cors());

// // Verify token middleware
// const verifyJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header is missing' });
//   }

//   const token = authHeader.split(' ')[1]; // Bearer <token>

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }

//     // Token is valid
//     req.userId = decoded.userId; // Attach userId to request object
//     next();
//   });
// }

// Routes

// Sign-up route
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token
    // const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // token, // Send token to client
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign-in route
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user._id, email: user.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );

    res.status(200).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// // Protected routes
// app.get('/admin-home', verifyJWT, (req, res) => {
//   res.status(200).json({ message: 'Welcome to Admin!' });
// });

// app.get('/student-home', verifyJWT, (req, res) => {
//   res.status(200).json({ message: 'Welcome to Student!' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
