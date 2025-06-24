const soap = require('soap');
require('dotenv').config();

const url = 'https://b2b.sonartelematics.com/Service.asmx?WSDL';

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

        const result = await client.GET_MobileListAsync(args);
        
        // Imprimimos para depurar, por si acaso
        console.log("Respuesta del servicio SOAP (GET_MobileList):", JSON.stringify(result, null, 2));

        // --- INICIO DE LA CORRECCIÓN ---
        // Basado en el WSDL, la ruta correcta debería ser a través de 'mList'
        // El [0] es porque la librería soap envuelve la respuesta en un array.
        const responseData = result[0]?.GET_MobileListResult;

        // Verificamos si la respuesta tiene un código de error
        if (!responseData || responseData.error_code !== 0) {
            console.error("Error en la respuesta del proveedor:", responseData?.description || "Respuesta inválida");
            return [];
        }

        const vehicleList = responseData?.mList?.Mobile;
        // --- FIN DE LA CORRECCIÓN ---
        
        if (!vehicleList) {
            console.log("No se encontró la lista de vehículos (mList.Mobile) en la respuesta, o está vacía.");
            return [];
        }

        const vehicles = Array.isArray(vehicleList) ? vehicleList : [vehicleList];
        
        // Mapeamos usando los nombres de campo correctos del WSDL (mPlaca, mDescription)
        return vehicles.map(v => ({
            plate: v.mPlaca,
            description: v.mDescription,
            mid: v.mId,
        }));

    } catch (error) {
        console.error('Error al llamar al servicio SOAP (getVehiclesFromProvider):', error.message);
        throw new Error('Falló la comunicación con el proveedor de vehículos.');
    }
};

const getVehicleLocationFromProvider = async (mid) => {
    try {
        const client = await soap.createClientAsync(url);
        const args = { ...auth, mId: mid };

        const result = await client.GET_LastLocationAsync(args);
        
        console.log(`Respuesta del servicio SOAP (GET_LastLocation para mId ${mid}):`, JSON.stringify(result, null, 2));
        
        // --- INICIO DE LA CORRECCIÓN ---
        // El WSDL dice que la respuesta es de tipo 'EventListResponse'
        const responseData = result[0]?.GET_LastLocationResult;
        
        if (!responseData || responseData.error_code !== 0) {
            console.error("Error en la respuesta del proveedor para ubicación:", responseData?.description || "Respuesta inválida");
            throw new Error('El proveedor no pudo encontrar la ubicación.');
        }

        // El primer evento en la lista es la última ubicación
        const locationEvent = responseData?.evtList?.EventLocation;
        const location = Array.isArray(locationEvent) ? locationEvent[0] : locationEvent;
        // --- FIN DE LA CORRECCIÓN ---

        if (!location || (location.latitude === 0 && location.longitude === 0)) {
            throw new Error('Ubicación no encontrada para este vehículo.');
        }

        return {
            lat: location.latitude,
            lng: location.longitude
        };
    } catch (error) {
        // Evitamos duplicar el mensaje de error si ya lo manejamos
        if (error.message.includes('Ubicación no encontrada') || error.message.includes('El proveedor no pudo encontrar')) {
            throw error;
        }
        console.error(`Error al llamar al servicio SOAP (getVehicleLocationFromProvider):`, error.message);
        throw new Error('Falló la comunicación con el proveedor de ubicación.');
    }
};

module.exports = {
    getVehiclesFromProvider,
    getVehicleLocationFromProvider
};