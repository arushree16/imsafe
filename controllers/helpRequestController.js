const HelpRequest = require('../models/HelpRequest');

const helpRequestController = {
  // Create a new help request
  async createHelpRequest(req, res) {
    try {
      const { description, location } = req.body;
      
      if (!location || !location.latitude || !location.longitude || !description) {
        return res.status(400).json({
          success: false,
          message: 'Location data and description are required'
        });
      }

      const now = new Date();
      const helpRequest = new HelpRequest({
        userId: req.user.id,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
          address: location.address,
          placeId: location.placeId
        },
        timeOfDay: {
          hour: now.getHours(),
          minute: now.getMinutes()
        },
        description
      });

      await helpRequest.save();
      
      res.status(201).json({
        success: true,
        message: 'Help request created successfully',
        data: helpRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating help request',
        error: error.message
      });
    }
  },

  // Check for previous incidents in the area and time
  async checkAreaSafety(req, res) {
    try {
      const { location } = req.body;
      
      if (!location || !location.latitude || !location.longitude) {
        return res.status(400).json({
          success: false,
          message: 'Location data is required'
        });
      }

      // Get safety score from Python service
      const safetyData = await getSafetyScore(location.latitude, location.longitude);

      // Location check: 500 meters radius
      const maxDistance = 500;
      
      // Time check
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Find incidents within the time window (1 hour before and after current time)
      const timeQuery = {
        $or: [
          // Same hour
          {
            'timeOfDay.hour': currentHour,
            'timeOfDay.minute': {
              $gte: currentMinute - 30,
              $lte: currentMinute + 30
            }
          },
          // Hour before
          {
            'timeOfDay.hour': currentHour - 1,
            'timeOfDay.minute': {
              $gte: currentMinute + 30
            }
          },
          // Hour after
          {
            'timeOfDay.hour': currentHour + 1,
            'timeOfDay.minute': {
              $lte: currentMinute - 30
            }
          }
        ]
      };

      const previousIncidents = await HelpRequest.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            $maxDistance: maxDistance
          }
        },
        ...timeQuery,
        timestamp: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }).populate('userId', 'name');

      // Group incidents by time of day
      const incidentsByTime = previousIncidents.reduce((acc, incident) => {
        const timeKey = `${incident.timeOfDay.hour}:${incident.timeOfDay.minute.toString().padStart(2, '0')}`;
        if (!acc[timeKey]) {
          acc[timeKey] = [];
        }
        acc[timeKey].push(incident);
        return acc;
      }, {});

      const warningMessage = previousIncidents.length > 0
        ? `Warning: ${previousIncidents.length} help requests were made in this area around this time of day. Be extra cautious between ${Object.keys(incidentsByTime).join(', ')} hours.`
        : 'No recent incidents reported in this area during this time';

      res.status(200).json({
        success: true,
        data: {
          previousIncidents: previousIncidents.length,
          incidents: previousIncidents.map(incident => ({
            date: incident.timestamp,
            time: `${incident.timeOfDay.hour}:${incident.timeOfDay.minute.toString().padStart(2, '0')}`,
            description: incident.description,
            address: incident.location.address
          })),
          message: warningMessage,
          safetyScore: safetyData?.safety_score || null,
          policeStations: safetyData?.police_stations || 0,
          crimeCount: safetyData?.crime_count || 0
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking area safety',
        error: error.message
      });
    }
  }
};

async function getSafetyScore(latitude, longitude) {
  try {
    const response = await fetch(`/safety-api/get_safety_score?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching safety score:', error);
    return null;
  }
}

module.exports = helpRequestController; 