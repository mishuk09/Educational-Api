// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// // Generate JWT Token
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // Register User
// exports.register = async (req, res) => {
//     const { name, email, password, role } = req.body;

//     try {
//         // Check if user already exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash password before saving
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         // // Generate token
//         // const token = generateToken(user._id);

//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             // token,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Login User
// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         // Check if user exists and password matches
//         if (user && (await bcrypt.compare(password, user.password))) {
//             const token = generateToken(user._id);

//             res.json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 token,
//             });
//         } else {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
