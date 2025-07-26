const express = require('express');
const {
  createStore,
  getStores,
  getStoreById,
  getOwnerDashboard
} = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/owner/dashboard', authenticateToken, requireRole(['STORE_OWNER']), getOwnerDashboard);

router.post('/', authenticateToken, requireRole(['ADMIN']), createStore);

router.get('/', authenticateToken, getStores);
router.get('/:id', authenticateToken, getStoreById);

module.exports = router;
