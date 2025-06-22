import React, { useState, useEffect } from 'react';

const VehicleForm = ({ initialData, onSubmit, onCancel, submitButtonText = "Guardar" }) => {
    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        line: '',
        model: ''
    });

    // useEffect se usa para poblar el formulario si se pasan datos iniciales (para un futuro "editar")
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
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
                <input type="text" name="model" placeholder="Ej: 2018" value={formData.model} onChange={handleChange} required />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{submitButtonText}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
            </div>
        </form>
    );
};

export default VehicleForm;