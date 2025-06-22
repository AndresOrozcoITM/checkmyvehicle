import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ScheduleRevision = () => {
    const { plate } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [items, setItems] = useState(['Motor', 'Aire acondicionado', 'Ruedas']);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        // Obtenemos los datos del vehículo para tener su ID
        const fetchVehicle = async () => {
            try {
                const response = await api.get(`/vehicles/${plate}`);
                setVehicle(response.data.vehicle);
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };
        fetchVehicle();
    }, [plate]);

    const handleAddItem = () => {
        if (newItem.trim() !== '' && !items.includes(newItem.trim())) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (itemToRemove) => {
        setItems(items.filter(item => item !== itemToRemove));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vehicle) {
            alert('Error: No se pudo encontrar el vehículo.');
            return;
        }
        try {
            await api.post('/revisions', {
                vehicleId: vehicle.id,
                scheduledDate,
                items
            });
            alert('Revisión agendada exitosamente.');
            navigate(`/vehicles/${plate}`);
        } catch (error) {
            console.error('Error scheduling revision:', error);
            alert('Error al agendar la revisión.');
        }
    };

    if (!vehicle) return <p>Cargando...</p>;
    
    return (
        <div>
            <h2>Agendar Nueva Revisión para {plate}</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Fecha y Hora</label>
                    <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
                </div>

                <h3>Items a revisar</h3>
                <ul>
                    {items.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            {item}
                            <button type="button" onClick={() => handleRemoveItem(item)} style={{ marginLeft: '10px', background: '#dc3545', color: 'white' }}>-</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" placeholder="Nuevo item" value={newItem} onChange={e => setNewItem(e.target.value)} />
                    <button type="button" onClick={handleAddItem} style={{ marginLeft: '10px' }} className="btn-primary">+</button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary">Guardar</button>
                    <button type="button" onClick={() => navigate(`/vehicles/${plate}`)} className="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ScheduleRevision;