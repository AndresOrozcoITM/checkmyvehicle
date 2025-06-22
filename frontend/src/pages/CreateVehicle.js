import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VehicleForm from '../components/VehicleForm'; // <-- Importamos el nuevo componente

const CreateVehicle = () => {
    const navigate = useNavigate();

    // La lógica de la API permanece aquí, en el componente de "página"
    const handleCreateVehicle = async (formData) => {
        try {
            await api.post('/vehicles', formData);
            alert('Vehículo creado exitosamente.');
            navigate('/vehicles');
        } catch (error) {
            console.error('Error creating vehicle:', error);
            alert('Error al crear el vehículo.');
        }
    };

    const handleCancel = () => {
        navigate('/vehicles');
    };

    // La UI del formulario se delega al componente VehicleForm
    return (
        <div>
            <h2>Creación de nuevo vehículo</h2>
            <VehicleForm 
                onSubmit={handleCreateVehicle}
                onCancel={handleCancel}
                initialData={{ plate: '', brand: '', line: '', model: '' }} // Datos iniciales vacíos
                submitButtonText="Guardar"
            />
        </div>
    );
};

export default CreateVehicle;