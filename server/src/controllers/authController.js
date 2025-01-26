const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'your_new_jwt_secret'; // Ensure this matches the .env file

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'User registration failed' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header exists
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Extract the token from the header (assuming Bearer <token> format)
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Decode the token to extract its payload (NO signature validation)
    const decoded = jwt.decode(token);

    // Check if decoding was successful
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Log the decoded payload for debugging
    console.log('Decoded payload:', decoded);

    // Attach the decoded token to the request object for further use
    req.user = decoded;

    // Call the next middleware
    next();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return res.status(500).json({ message: 'Failed to process token' });
  }
};
