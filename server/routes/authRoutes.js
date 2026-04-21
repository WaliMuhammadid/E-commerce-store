const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * Authentication Routes
 * POST /api/auth/login - Admin login
 */
router.post('/login', login);

module.exports = router;
