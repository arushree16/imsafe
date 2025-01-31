class LocationService {
  constructor() {
    this.googleMapsLoaded = false;
  }

  // Initialize Google Maps
  async initGoogleMaps() {
    if (this.googleMapsLoaded) return;

    return new Promise((resolve, reject) => {
      // Load Google Maps JavaScript API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.googleMapsLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Get location using Google Maps
  async getGoogleMapsLocation() {
    try {
      await this.initGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              // Get detailed address information
              geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK') {
                  resolve({
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                    address: results[0].formatted_address,
                    placeId: results[0].place_id
                  });
                } else {
                  reject(new Error('Geocoding failed'));
                }
              });
            },
            (error) => reject(error)
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Fallback to browser geolocation
  async getBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Main function to get location with fallback
  async getCurrentLocation() {
    try {
      // Try Google Maps first
      return await this.getGoogleMapsLocation();
    } catch (error) {
      console.warn('Google Maps location failed, falling back to browser geolocation:', error);
      // Fallback to browser geolocation
      return await this.getBrowserLocation();
    }
  }
}

// Create and export a singleton instance
const locationService = new LocationService();

// Make it available globally
window.locationService = locationService; 