import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateVehicle = () => {
    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        line: '',
        model: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', formData);
            alert('Vehículo creado exitosamente.');
            navigate('/vehicles');
        } catch (error) {
            console.error('Error creating vehicle:', error);
            alert('Error al crear el vehículo.');
        }
    };

    return (
        <div>
            <h2>Creación de nuevo vehículo</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Placa</label>
                    <input type="text" name="plate" value={formData.plate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Marca</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Línea</label>
                    <input type="text" name="line" value={formData.line} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Modelo</label>
                    <input type="text" name="model" value={formData.model} onChange={handleChange} required />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary">Guardar</button>
                    <button type="button" onClick={() => navigate('/vehicles')} className="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CreateVehicle;