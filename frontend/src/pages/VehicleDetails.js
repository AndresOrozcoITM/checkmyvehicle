import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Map from '../components/Map';

const VehicleDetails = () => {
    const { plate } = useParams();
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/vehicles/${plate}`);
                setVehicleData(response.data);
            } catch (error) {
                console.error("Error fetching vehicle details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicleDetails();
    }, [plate]);

    if (loading) return <p>Cargando detalles del vehículo...</p>;
    if (!vehicleData) return <p>Vehículo no encontrado.</p>;

    const { vehicle, lastRevision } = vehicleData;

    return (
        <div>
            <h2>Detalles del Vehículo - {vehicle.plate}</h2>
            <div className="details-grid">
                <div className="vehicle-info">
                    <h3>Datos del vehículo</h3>
                    <p><strong>Placa:</strong> {vehicle.plate}</p>
                    <p><strong>Marca:</strong> {vehicle.brand}</p>
                    <p><strong>Línea:</strong> {vehicle.line}</p>
                    <p><strong>Modelo:</strong> {vehicle.model}</p>
                    <button onClick={() => navigate(`/vehicles/${plate}/revisions/new`)} className="btn-primary">
                        Agendar Nueva Revisión
                    </button>
                    <button onClick={() => setShowMap(!showMap)} className="btn-secondary" style={{ marginTop: '10px' }}>
                        {showMap ? 'Ocultar Mapa' : 'Consultar Ubicación Actual'}
                    </button>
                </div>
                <div className="revision-info">
                    <h3>Última revisión</h3>
                    {lastRevision && lastRevision.items ? (
                        <>
                            <p><strong>Fecha:</strong> {new Date(lastRevision.date).toLocaleString()}</p>
                            {lastRevision.items.map((item, index) => (
                                <div key={index} className="revision-item">
                                    <h4>{item.item_name}</h4>
                                    <p><strong>Técnico:</strong> {item.technician || 'N/A'}</p>
                                    <p><strong>Comentarios:</strong> {item.comments || 'N/A'}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No hay revisiones completadas para este vehículo.</p>
                    )}
                </div>
            </div>
            {showMap && <Map mid={vehicle.mid} plate={vehicle.plate} />}
        </div>
    );
};

export default VehicleDetails;