const jwt = require('jsonwebtoken');

// In-memory admin for demo
const admin = {
  _id: '1',
  email: 'admin@mumtazstore.com',
  password: 'admin123' // Plain text for demo (use bcrypt in production)
};

/**
 * Generate JWT Token for admin authentication
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check credentials
    if (email !== admin.email || password !== admin.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return token and admin info
    res.json({
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = { login };
