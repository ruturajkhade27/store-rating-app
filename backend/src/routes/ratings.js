const express = require('express');
const { submitRating, getUserRatings } = require('../controllers/ratingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();


router.post('/', authenticateToken, requireRole(['USER']), submitRating);
router.get('/my-ratings', authenticateToken, requireRole(['USER']), getUserRatings);

module.exports = router;