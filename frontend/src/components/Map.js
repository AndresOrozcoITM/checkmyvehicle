import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

// Corregir el problema del ícono de marcador por defecto en Leaflet con React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const Map = ({ mid, plate }) => {
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocation = async () => {
            if (!mid) return;
            try {
                setLoading(true);
                const response = await api.get(`/vehicles/location/${mid}`);
                setPosition([response.data.lat, response.data.lng]);
                setError('');
            } catch (err) {
                setError('No se pudo obtener la ubicación. El proveedor puede no tener datos para este vehículo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, [mid]);

    if (loading) {
        return <p>Cargando mapa y ubicación...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    return (
        position && (
            <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="leaflet-container">
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        Ubicación actual del vehículo <br /> Placa: {plate}
                    </Popup>
                </Marker>
            </MapContainer>
        )
    );
};

export default Map;