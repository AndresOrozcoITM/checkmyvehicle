const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');
const soapService = require('../services/soapService');

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await dbService.getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// Add a new vehicle
router.post('/', async (req, res) => {
  const { placa, marca, linea, modelo } = req.body;
  if (!placa || !marca || !linea || !modelo) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    // In a real scenario, you might also get the mId from SOAP if creating a new vehicle there
    const newVehicle = { placa, marca, linea, modelo, mId: `MID-${Date.now()}` }; // Mock mId for now
    const result = await dbService.addVehicle(newVehicle);
    res.status(201).json({ message: 'Vehicle added successfully', id: result.insertId, ...newVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error adding vehicle', error: error.message });
  }
});

// Get last location of a vehicle by mId
router.get('/:mId/location', async (req, res) => {
  const { mId } = req.params;
  try {
    const location = await soapService.getLastLocation(mId);
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle location', error: error.message });
  }
});

module.exports = router;