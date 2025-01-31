const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String
    },
    placeId: {
      type: String
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  timeOfDay: {
    hour: {
      type: Number,
      required: true
    },
    minute: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  description: {
    type: String,
    required: true
  }
});

// Create a geospatial index for location queries
helpRequestSchema.index({ location: '2dsphere' });
helpRequestSchema.index({ 'timeOfDay.hour': 1, 'timeOfDay.minute': 1 });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

module.exports = HelpRequest; 