require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const axios = require('axios');

const app = express();

const cors = require('cors');

const allowedOrigins = ['http://localhost:4200', 'https://findgps-coordinates.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
    console.error('❌ Google Maps API Key is missing! Set it in the .env file.');
    process.exit(1);
}

console.log('✅ Google Maps API Key Loaded');

app.get('/api/reverse-geocode', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: 'Latitude and Longitude are required' });
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Reverse Geocode Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

app.get('/api/calculate-distance', async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) return res.status(400).json({ error: 'Origin and Destination are required' });
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Distance Calculation Error:', error.message);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on('SIGINT', () => {
    console.log('🛑 Server shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed. Exiting process.');
        process.exit(0);
    });
});