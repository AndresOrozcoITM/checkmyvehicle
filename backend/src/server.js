require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import cors
const vehicleRoutes = require('./routes/vehicleRoutes');
const revisionRoutes = require('./routes/revisionRoutes');
const soapService = require('./services/soapService');
const dbService = require('./services/dbService'); // Import dbService

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON

// Test DB connection
dbService.testConnection();

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/revisions', revisionRoutes);

// Initial synchronization: Fetch vehicles from SOAP and save to DB
async function syncVehiclesFromSoap() {
  console.log('Attempting to sync vehicles from SOAP service...');
  try {
    const vehicles = await soapService.getMobileList();
    if (vehicles && vehicles.length > 0) {
      for (const vehicle of vehicles) {
        // Here, you would save each vehicle to your MySQL database.
        // This is a placeholder; you'll need to implement the actual DB insertion logic.
        console.log(`Simulating saving vehicle to DB: ${vehicle.Placa} - ${vehicle.Descripcion} (mId: ${vehicle.mId})`);
        await dbService.addVehicle(vehicle); // Assuming addVehicle exists in dbService
      }
      console.log(`Successfully synced ${vehicles.length} vehicles from SOAP service.`);
    } else {
      console.log('No vehicles returned from SOAP service to sync.');
    }
  } catch (error) {
    console.error('Error during initial SOAP vehicle sync:', error.message);
  }
}

// Correr la sincronización inicial de vehículos desde el servicio SOAP
syncVehiclesFromSoap();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});