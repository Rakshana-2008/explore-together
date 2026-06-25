const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const categoryMap = {
  'Nature & Parks': '["leisure"="park"]',
  'Shopping': '["shop"="mall"]',
  'Study & Work Spots': '["amenity"="library"]',
  'Entertainment': '["amenity"="cinema"]',
  'Spiritual & Heritage': '["amenity"="place_of_worship"]',
  'Adventure & Sports': '["leisure"="sports_centre"]',
  'Hotels': '["tourism"="hotel"]',
  'Restaurants (Veg)': '["amenity"="restaurant"]',
  'Restaurants (Non-Veg)': '["amenity"="restaurant"]',
  'Pharmacies': '["amenity"="pharmacy"]',
  'Hospitals': '["amenity"="hospital"]',
  'Cafes': '["amenity"="cafe"]'
};

const categoryPhotos = {
  'Nature & Parks': 'park nature green',
  'Shopping': 'shopping mall retail',
  'Study & Work Spots': 'library study cafe',
  'Entertainment': 'cinema entertainment',
  'Spiritual & Heritage': 'temple heritage india',
  'Adventure & Sports': 'sports adventure',
  'Hotels': 'hotel lobby',
  'Restaurants (Veg)': 'vegetarian food indian',
  'Restaurants (Non-Veg)': 'restaurant food',
  'Pharmacies': 'pharmacy medicine',
  'Hospitals': 'hospital medical',
  'Cafes': 'cafe coffee',
  'General': 'chennai india'
};

const getUnsplashPhoto = async (category) => {
  try {
    const query = categoryPhotos[category] || 'chennai india';
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_KEY}`
        }
      }
    );
    const data = await response.json();
    return data.urls?.regular || null;
  } catch (e) {
    return null;
  }
};

const buildOverpassQuery = (tagFilter, lat, lng, radius) => {
  return `[out:json][timeout:25];
(
  node${tagFilter}(around:${radius},${lat},${lng});
  way${tagFilter}(around:${radius},${lat},${lng});
);
out center 30;`;
};

const queryOverpass = async (query) => {
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query
  });
  return response.json();
};

const mapOsmResults = async (elements, category) => {
  const photo = await getUnsplashPhoto(category);
  
  return elements
    .filter(el => el.tags && el.tags.name)
    .map(el => {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const addressParts = [
        el.tags['addr:housenumber'],
        el.tags['addr:street'],
        el.tags['addr:suburb'] || el.tags['addr:neighbourhood'],
        el.tags['addr:city'] || 'Chennai'
      ].filter(Boolean);

      return {
        placeId: `osm-${el.type}-${el.id}`,
        name: el.tags.name,
        address: addressParts.length > 0 ? addressParts.join(', ') : 'Chennai, Tamil Nadu',
        rating: null,
        priceLevel: 0,
        photo: photo,
        location: { latitude: lat, longitude: lon },
        isOpen: null,
        category
      };
    });
};

router.get('/nearby', protect, async (req, res) => {
  const { lat, lng, category, radius = 5000 } = req.query;
  try {
    const tagFilter = categoryMap[category] || '["tourism"="attraction"]';
    const query = buildOverpassQuery(tagFilter, lat, lng, radius);
    const data = await queryOverpass(query);
    if (!data.elements) return res.json([]);
    const results = await mapOsmResults(data.elements, category);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/station/:stationName', protect, async (req, res) => {
  const { stationName } = req.params;
  const { category } = req.query;

  const stationCoords = {
    'Chennai Central': { lat: 13.0827, lng: 80.2707 },
    'Egmore': { lat: 13.0732, lng: 80.2609 },
    'Nehru Park': { lat: 13.0784, lng: 80.2496 },
    'Kilpauk': { lat: 13.0839, lng: 80.2394 },
    "Pachaiyappa's College": { lat: 13.0889, lng: 80.2328 },
    'Shenoy Nagar': { lat: 13.0856, lng: 80.2214 },
    'Anna Nagar East': { lat: 13.0869, lng: 80.2126 },
    'Anna Nagar Tower': { lat: 13.0889, lng: 80.2058 },
    'Thirumangalam': { lat: 13.0889, lng: 80.1983 },
    'Koyambedu': { lat: 13.0694, lng: 80.1948 },
    'CMBT': { lat: 13.0694, lng: 80.1948 },
    'Arumbakkam': { lat: 13.0694, lng: 80.2058 },
    'Vadapalani': { lat: 13.0530, lng: 80.2126 },
    'Ashok Nagar': { lat: 13.0530, lng: 80.2214 },
    'Ekkattuthangal': { lat: 13.0530, lng: 80.2328 },
    'Alandur': { lat: 13.0024, lng: 80.2005 },
    'St. Thomas Mount': { lat: 13.0024, lng: 80.2126 },
    'Wimco Nagar Depot': { lat: 13.1469, lng: 80.2987 },
    'Wimco Nagar': { lat: 13.1469, lng: 80.3058 },
    'Tiruvotriyur': { lat: 13.1469, lng: 80.3058 },
    'Tiruvotriyur Theradi': { lat: 13.1400, lng: 80.3058 },
    'Kaladipet': { lat: 13.1339, lng: 80.2987 },
    'Tollgate': { lat: 13.1209, lng: 80.2987 },
    'New Washermenpet': { lat: 13.1079, lng: 80.2987 },
    'Tondiarpet': { lat: 13.1079, lng: 80.2987 },
    'Sir Theagaraya College': { lat: 13.0949, lng: 80.2847 },
    'Washermenpet': { lat: 13.0949, lng: 80.2847 },
    'Mannadi': { lat: 13.0889, lng: 80.2777 },
    'High Court': { lat: 13.0827, lng: 80.2777 },
    'Government Estate': { lat: 13.0757, lng: 80.2777 },
    'LIC': { lat: 13.0694, lng: 80.2707 },
    'Thousand Lights': { lat: 13.0594, lng: 80.2567 },
    'AG-DMS': { lat: 13.0530, lng: 80.2496 },
    'Teynampet': { lat: 13.0430, lng: 80.2496 },
    'Nandanam': { lat: 13.0330, lng: 80.2394 },
    'Saidapet': { lat: 13.0230, lng: 80.2214 },
    'Little Mount': { lat: 13.0130, lng: 80.2214 },
    'Guindy': { lat: 13.0024, lng: 80.2126 },
    'Nanganallur Road': { lat: 12.9924, lng: 80.2058 },
    'Meenambakkam': { lat: 12.9824, lng: 80.1983 },
    'Airport': { lat: 12.9824, lng: 80.1769 }
  };

  try {
    const coords = stationCoords[stationName];
    if (!coords) return res.status(404).json({ message: 'Station not found' });
    const tagFilter = category ? (categoryMap[category] || '["tourism"="attraction"]') : '["amenity"="restaurant"]';
    const query = buildOverpassQuery(tagFilter, coords.lat, coords.lng, 2000);
    const data = await queryOverpass(query);
    if (!data.elements) return res.json([]);
    const results = await mapOsmResults(data.elements, category || 'General');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;