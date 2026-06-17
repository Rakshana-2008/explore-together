const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const categoryMap = {
  'Nature & Parks': 'park',
  'Shopping': 'shopping_mall',
  'Study & Work Spots': 'library',
  'Entertainment': 'night_club',
  'Spiritual & Heritage': 'hindu_temple',
  'Adventure & Sports': 'stadium',
  'Hotels': 'lodging',
  'Restaurants (Veg)': 'restaurant',
  'Restaurants (Non-Veg)': 'restaurant',
  'Pharmacies': 'pharmacy',
  'Hospitals': 'hospital',
  'Cafes': 'cafe'
};

const getPhotoUrl = (photoName) => {
  if (!photoName) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${GOOGLE_API_KEY}`;
};

router.get('/nearby', protect, async (req, res) => {
  const { lat, lng, category, radius = 5000, budget } = req.query;
  try {
    const placeType = categoryMap[category] || 'tourist_attraction';
    const body = {
      includedTypes: [placeType],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: parseFloat(radius)
        }
      }
    };
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos.name,places.location,places.regularOpeningHours'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!data.places) return res.json([]);
    const budgetFilter = { 'Free': 0, 'Under ₹200': 1, '₹200–₹500': 2, '₹500–₹1000': 3, '₹1000+': 4 };
    let places = data.places;
    if (budget && budgetFilter[budget] !== undefined) {
      places = places.filter(p => {
        if (budget === 'Free') return !p.priceLevel || p.priceLevel === 0;
        return p.priceLevel <= budgetFilter[budget];
      });
    }
    const results = places.map(place => ({
      placeId: place.id,
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      priceLevel: place.priceLevel || 0,
      photo: place.photos?.[0]?.name ? getPhotoUrl(place.photos[0].name) : null,
      location: place.location,
      isOpen: place.regularOpeningHours?.openNow || null,
      category
    }));
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
    const placeType = category ? categoryMap[category] : 'tourist_attraction';
    const body = {
      includedTypes: [placeType],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: coords.lat, longitude: coords.lng },
          radius: 2000
        }
      }
    };
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos.name,places.location'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!data.places) return res.json([]);
    const results = data.places.map(place => ({
      placeId: place.id,
      name: place.displayName?.text || 'Unknown',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      priceLevel: place.priceLevel || 0,
      photo: place.photos?.[0]?.name ? getPhotoUrl(place.photos[0].name) : null,
      location: place.location,
      category: category || 'General'
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;