const express = require('express');
const { register, login, updatePassword, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/password', authenticateToken, updatePassword);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;