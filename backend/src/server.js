const express = require('express');
const cors = require('cors');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicles');
const revisionRoutes = require('./routes/revisions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/revisions', revisionRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('CheckMyVehicle Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});