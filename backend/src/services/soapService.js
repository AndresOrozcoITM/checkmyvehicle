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

        const result = await client.GET_MobileListAsync(args);
        
        // Log detallado de la respuesta completa del proveedor
        console.log("Respuesta completa del servicio SOAP (GET_MobileList):", JSON.stringify(result, null, 2));

        // Acceso al resultado principal, usualmente el primer elemento del array si la librería lo envuelve
        const rawResultObject = result && result[0];
        if (!rawResultObject) {
            console.error("Respuesta del proveedor vacía o en formato inesperado en el nivel superior (result[0]).");
            return [];
        }
        console.log("Objeto de resultado crudo (result[0]):", JSON.stringify(rawResultObject, null, 2));

        const responseData = rawResultObject.GET_MobileListResult;
        if (!responseData) {
            console.error("No se encontró 'GET_MobileListResult' en la respuesta del proveedor.", JSON.stringify(rawResultObject, null, 2));
            return [];
        }
        console.log("'GET_MobileListResult' encontrado:", JSON.stringify(responseData, null, 2));
        
        // Verificamos si la respuesta tiene un código de error del proveedor
        if (responseData.error_code !== 0) {
            console.error("Error reportado por el proveedor en 'GET_MobileListResult':", responseData.description || "Descripción de error no disponible", "Código:", responseData.error_code);
            return [];
        }

        // Acceso a la lista de móviles
        const mList = responseData.mList;
        if (!mList) {
            console.log("No se encontró 'mList' dentro de 'GET_MobileListResult'. La lista de vehículos podría estar vacía o la estructura de respuesta es diferente.");
            console.log("Contenido de responseData:", JSON.stringify(responseData, null, 2));
            return [];
        }
        console.log("'mList' encontrado:", JSON.stringify(mList, null, 2));

        const vehicleList = mList.Mobile;
        if (!vehicleList) {
            console.log("No se encontró 'Mobile' dentro de 'mList', o está vacío. Esto puede significar que no hay vehículos o que la estructura ha cambiado.");
            console.log("Contenido de mList:", JSON.stringify(mList, null, 2));
            return []; // No hay vehículos o la propiedad Mobile no existe.
        }
        console.log("'Mobile' encontrado. Tipo:", typeof vehicleList, "Contenido:", JSON.stringify(vehicleList, null, 2));

        // Asegurar que vehicleList es un array para un procesamiento uniforme
        const vehiclesArray = Array.isArray(vehicleList) ? vehicleList : [vehicleList];
        
        if (vehiclesArray.length === 0) {
            console.log("La lista 'Mobile' está presente pero vacía. No hay vehículos para sincronizar desde el proveedor.");
            return [];
        }

        console.log(`Mapeando ${vehiclesArray.length} vehículos.`);
        return vehiclesArray.map(v => {
            if (!v) { // Añadir un chequeo por si algún elemento del array es nulo o indefinido
                console.warn("Se encontró un vehículo nulo o indefinido en la lista del proveedor.");
                return null; // O manejarlo de otra forma apropiada
            }
            return {
                plate: v.mPlaca,
                description: v.mDescription,
                mid: v.mId,
            };
        }).filter(v => v !== null); // Filtrar cualquier vehículo nulo que se haya podido añadir

    } catch (error) {
        // Loguear el error específico de la llamada SOAP
        console.error('Error crítico durante la llamada al servicio SOAP (getVehiclesFromProvider):', error.message);
        // Si el error tiene más detalles (como la respuesta del servidor SOAP en caso de fallo), loguearlos si es posible
        if (error.root) { // la librería 'soap' a veces incluye 'root' para errores SOAP Fault
            console.error('Detalles del error SOAP (si es un Fault):', JSON.stringify(error.root, null, 2));
        }
        // Lanzar un error genérico para ser manejado por el controlador
        throw new Error('Falló la comunicación con el proveedor de vehículos. Revise los logs para más detalles.');
    }
};

const getVehicleLocationFromProvider = async (mid) => {
    try {
        const client = await soap.createClientAsync(url);
        const args = { ...auth, mId: mid };

        const result = await client.GET_LastLocationAsync(args);
        
        console.log(`Respuesta completa del servicio SOAP (GET_LastLocation para mId ${mid}):`, JSON.stringify(result, null, 2));
        
        const rawResultObject = result && result[0];
        if (!rawResultObject) {
            console.error(`Respuesta del proveedor vacía o en formato inesperado para GET_LastLocation (mId ${mid}).`);
            throw new Error('Respuesta inválida del proveedor de ubicación.');
        }
        
        const responseData = rawResultObject.GET_LastLocationResult;
        if (!responseData) {
            console.error(`No se encontró 'GET_LastLocationResult' en la respuesta del proveedor para mId ${mid}.`);
            throw new Error('Respuesta inválida del proveedor de ubicación.');
        }
        
        if (responseData.error_code !== 0) {
            console.error(`Error reportado por el proveedor en GET_LastLocation (mId ${mid}): ${responseData.description || 'N/A'}`);
            throw new Error(responseData.description || 'El proveedor no pudo encontrar la ubicación.');
        }

        const evtList = responseData.evtList;
        if (!evtList) {
            console.warn(`No se encontró 'evtList' en GET_LastLocationResult para mId ${mid}.`);
            throw new Error('Ubicación no encontrada para este vehículo (sin evtList).');
        }

        const locationEvent = evtList.EventLocation; // Puede ser un objeto o un array
        if (!locationEvent) {
            console.warn(`No se encontró 'EventLocation' en evtList para mId ${mid}.`);
            throw new Error('Ubicación no encontrada para este vehículo (sin EventLocation).');
        }
        
        // Tomar el primer evento si es un array, o el objeto directamente si no lo es
        const location = Array.isArray(locationEvent) ? locationEvent[0] : locationEvent;

        if (!location || (location.latitude === 0 && location.longitude === 0)) { // Algunos proveedores devuelven 0,0 para ubicaciones no válidas
            console.warn(`Ubicación inválida o no encontrada (lat: ${location?.latitude}, lng: ${location?.longitude}) para mId ${mid}.`);
            throw new Error('Ubicación no encontrada o inválida para este vehículo.');
        }

        return {
            lat: location.latitude,
            lng: location.longitude
        };
    } catch (error) {
        // Evitamos duplicar el mensaje de error si ya lo manejamos con throw new Error(message)
        if (error.message.includes('Ubicación no encontrada') || 
            error.message.includes('El proveedor no pudo encontrar') ||
            error.message.includes('Respuesta inválida del proveedor')) {
            throw error;
        }
        console.error(`Error crítico durante la llamada al servicio SOAP (getVehicleLocationFromProvider para mId ${mid}):`, error.message);
        if (error.root) {
            console.error('Detalles del error SOAP (si es un Fault):', JSON.stringify(error.root, null, 2));
        }
        throw new Error('Falló la comunicación con el proveedor de ubicación. Revise los logs.');
    }
};

module.exports = {
    getVehiclesFromProvider,
    getVehicleLocationFromProvider
};