import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get('/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSync = async () => {
        try {
            setSyncing(true);
            const response = await api.post('/vehicles/sync');
            alert(response.data.message);
            fetchVehicles(); // Recargar la lista
        } catch (error) {
            console.error("Error syncing vehicles:", error);
            alert('Falló la sincronización con el proveedor.');
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return <p>Cargando vehículos...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Listado de Vehículos</h2>
                <div>
                    <button onClick={() => navigate('/vehicles/new')} className="btn-secondary">Nuevo Vehículo</button>
                    <button onClick={handleSync} disabled={syncing} className="btn-primary" style={{ marginLeft: '10px' }}>
                        {syncing ? 'Sincronizando...' : 'Sincronizar Vehículos desde Proveedor'}
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Marca</th>
                        <th>Línea</th>
                        <th>Modelo</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length > 0 ? (
                        vehicles.map(vehicle => (
                            <tr key={vehicle.id}>
                                <td><Link to={`/vehicles/${vehicle.plate}`}>{vehicle.plate}</Link></td>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.line}</td>
                                <td>{vehicle.model}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay vehículos registrados. Intenta sincronizar o crear uno nuevo.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleList;