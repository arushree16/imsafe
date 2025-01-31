const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PlaceRating = require('../models/PlaceRating');

// Get all ratings
router.get('/', auth, async (req, res) => {
    try {
        const ratings = await PlaceRating.find()
            .populate('userId', 'name')
            .sort('-createdAt');
        res.json({ success: true, data: ratings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new rating
router.post('/add', auth, async (req, res) => {
    try {
        const { placeName, placeAddress, rating, comment } = req.body;
        const placeRating = new PlaceRating({
            userId: req.user.id,
            placeName,
            placeAddress,
            rating,
            comment
        });
        await placeRating.save();
        res.status(201).json({ success: true, data: placeRating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; 