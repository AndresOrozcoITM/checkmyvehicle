const soap = require('soap');
require('dotenv').config();

const url = 'https://b2b.sonartelematics.com/Service.asmx';

const auth = {
    User: process.env.SOAP_USER,
    Password: process.env.SOAP_PASSWORD,
};

const getVehiclesFromProvider = async () => {
    try {
        const client = await soap.createClientAsync(url);
        const args = {
            ...auth,
            FleetId: '2549'
        };

        const result = await client.GET_MobileListAsync({ ...args });
        
        const vehicleList = result[0]?.GET_MobileListResult?.ListMobile?.Mobile;
        
        if (!vehicleList) {
            console.log("No vehicles found or incorrect response structure.");
            return [];
        }

        const vehicles = Array.isArray(vehicleList) ? vehicleList : [vehicleList];
        
        return vehicles.map(v => ({
            plate: v.Plate,
            description: v.Description,
            mid: v.mId,
        }));

    } catch (error) {
        console.error('Error fetching vehicles from SOAP service:', error.message);
        throw new Error('Failed to fetch vehicles from provider.');
    }
};

const getVehicleLocationFromProvider = async (mid) => {
    try {
        const client = await soap.createClientAsync(url);
        const args = {
            ...auth,
            mId: mid,
        };

        const result = await client.GET_LastLocationAsync({ ...args });
        
        const location = result[0]?.GET_LastLocationResult;
        
        if (!location || location.Lat === 0 && location.Lon === 0) {
            throw new Error('Location not found for this vehicle.');
        }

        return {
            lat: location.Lat,
            lng: location.Lon
        };
    } catch (error) {
        console.error(`Error fetching location for mId ${mid}:`, error.message);
        throw new Error('Failed to fetch location from provider.');
    }
};

module.exports = {
    getVehiclesFromProvider,
    getVehicleLocationFromProvider
};