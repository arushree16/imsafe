const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const EmergencyContact = require('../models/EmergencyContact');

// Get all emergency contacts for a user
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({ userId: req.user.id });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add new emergency contact
router.post('/add', auth, async (req, res) => {
    try {
        const { name, phoneNumber, relationship } = req.body;
        const contact = new EmergencyContact({
            userId: req.user.id,
            name,
            phoneNumber,
            relationship
        });
        await contact.save();
        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete emergency contact
router.delete('/:id', auth, async (req, res) => {
    try {
        const contact = await EmergencyContact.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; 