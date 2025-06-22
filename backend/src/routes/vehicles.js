const express = require('express');
const router = express.Router();
const {
    syncVehicles,
    createVehicle,
    getVehicles,
    getVehicleByPlate,
    getVehicleLocation,
} = require('../controllers/vehicleController');

router.post('/sync', syncVehicles);
router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:plate', getVehicleByPlate);
router.get('/location/:mid', getVehicleLocation);

module.exports = router;