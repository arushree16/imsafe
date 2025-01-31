const express = require('express');
const router = express.Router();
const helpRequestController = require('../controllers/helpRequestController');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware
const HelpRequest = require('../models/HelpRequest');

// Create a new help request
router.post('/create', auth, helpRequestController.createHelpRequest);

// Check area safety
router.post('/check-area', auth, helpRequestController.checkAreaSafety);

// Add this new route
router.get('/admin/all', auth, async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      data: helpRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching help requests',
      error: error.message
    });
  }
});

module.exports = router; 