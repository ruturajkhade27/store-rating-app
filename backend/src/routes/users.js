const express = require('express');
const { createUser, getUsers, getUserById, getDashboardStats } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, requireRole(['ADMIN']), createUser);
router.get('/', authenticateToken, requireRole(['ADMIN']), getUsers);
router.get('/stats', authenticateToken, requireRole(['ADMIN']), getDashboardStats);
router.get('/:id', authenticateToken, requireRole(['ADMIN']), getUserById);

module.exports = router;