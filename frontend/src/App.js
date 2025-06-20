import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State for managing current view
  const [currentView, setCurrentView] = useState('vehicles'); // 'vehicles', 'revisions', 'new-vehicle', 'new-revision', 'vehicle-details', 'pending-review'
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]); // Mock data for vehicles
  const [revisions, setRevisions] = useState([]); // Mock data for revisions

  // Mock data for initial vehicles (replace with actual backend fetch)
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, using mock data
    setVehicles([
      { placa: 'ABC321', marca: 'Chevrolet', linea: 'Spark GT', modelo: '2016', mId: 'mockMId1' },
      { placa: 'XYZ789', marca: 'Nissan', linea: 'Versa', modelo: '2020', mId: 'mockMId2' },
    ]);
    setRevisions([
      {
        placa: 'ABC321',
        fecha: '2019-12-02T10:00', // Using ISO format for datetime-local compatibility
        items: [
          { item: 'Motor', tecnico: 'José Pedro Ángulo', comentarios: 'Se encontró en buen estado' },
          { item: 'Aire acondicionado', tecnico: 'José Pedro Ángulo', comentarios: 'Se realizó cambio de filtro' },
          { item: 'Ruedas', tecnico: 'Pepe Tamayo', comentarios: 'Se hizo cambio de las dos ruedas delanteras y se calibraron a 33' },
        ],
      },
    ]);
  }, []);

  // Function to navigate between views
  const navigateTo = (view, vehicle = null) => {
    setCurrentView(view);
    setSelectedVehicle(vehicle);
  };

  // Render different views based on currentView state
  const renderContent = () => {
    switch (currentView) {
      case 'vehicles':
        return <VehicleList vehicles={vehicles} navigateTo={navigateTo} />;
      case 'revisions':
        return <RevisionList revisions={revisions} navigateTo={navigateTo} />;
      case 'new-vehicle':
        return <NewVehicleForm navigateTo={navigateTo} addVehicle={addVehicle} />;
      case 'new-revision':
        return <NewRevisionForm selectedVehicle={selectedVehicle} navigateTo={navigateTo} addRevision={addRevision} />;
      case 'vehicle-details':
        return <VehicleDetails selectedVehicle={selectedVehicle} revisions={revisions} navigateTo={navigateTo} />;
      case 'pending-review':
        return <PendingReview selectedVehicle={selectedVehicle} revisions={revisions} navigateTo={navigateTo} updateRevisionResults={updateRevisionResults} />;
      default:
        return <VehicleList vehicles={vehicles} navigateTo={navigateTo} />;
    }
  };

  // Add a new vehicle to the list (would call backend API)
  const addVehicle = async (newVehicle) => {
    try {
      // Example of a fetch call to your backend
      // const response = await fetch('/api/vehicles', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newVehicle),
      // });
      // const data = await response.json();
      // setVehicles([...vehicles, data]); // Add the vehicle returned by the backend (with its generated ID)

      // Mocking for now:
      setVehicles([...vehicles, { ...newVehicle, mId: `mockMId-${Date.now()}` }]);
      alert('Vehículo guardado exitosamente!');
      navigateTo('vehicles');
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert('Error al guardar el vehículo.');
    }
  };

  // Add a new revision (would call backend API)
  const addRevision = async (newRevision) => {
    try {
      // const response = await fetch('/api/revisions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRevision),
      // });
      // const data = await response.json();
      // setRevisions([...revisions, data]);

      // Mocking for now:
      setRevisions([...revisions, newRevision]);
      alert('Revisión agendada exitosamente!');
      navigateTo('revisions');
    } catch (error) {
      console.error("Error adding revision:", error);
      alert('Error al agendar la revisión.');
    }
  };

  // Update revision results (would call backend API)
  const updateRevisionResults = async (placa, updatedItems) => {
    try {
      // const response = await fetch(`/api/revisions/${placa}/items`, { // Assuming an API endpoint like this
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: updatedItems }),
      // });
      // const data = await response.json();
      setRevisions(prevRevisions =>
        prevRevisions.map(rev =>
          rev.placa === placa ? { ...rev, items: updatedItems } : rev
        )
      );
      alert('Resultados de la revisión actualizados exitosamente!');
      navigateTo('vehicle-details', selectedVehicle); // Go back to vehicle details after updating
    } catch (error) {
      console.error("Error updating revision results:", error);
      alert('Error al actualizar los resultados de la revisión.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col items-center p-4">
      <header className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">CheckMyVehicle</h1>
        <nav>
          <button
            onClick={() => navigateTo('vehicles')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentView === 'vehicles' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Vehículos
          </button>
          <button
            onClick={() => navigateTo('revisions')}
            className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentView === 'revisions' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Revisiones
          </button>
        </nav>
      </header>
      <main className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {renderContent()}
      </main>
    </div>
  );
};

// Component for listing vehicles
const VehicleList = ({ vehicles, navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Vehículos</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Placa"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => { /* Implement search logic here */ }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 shadow-sm"
          >
            Buscar
          </button>
          <button
            onClick={() => navigateTo('new-vehicle')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Nuevo vehículo
          </button>
        </div>
      </div>
      {filteredVehicles.length > 0 ? (
        <ul className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <li
              key={vehicle.placa}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => navigateTo('vehicle-details', vehicle)}
            >
              <h3 className="text-lg font-medium text-gray-900">{vehicle.placa} - {vehicle.marca} {vehicle.linea}</h3>
              <p className="text-sm text-gray-600">Modelo: {vehicle.modelo}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-8">No hay vehículos registrados. ¡Crea uno nuevo!</p>
      )}
    </div>
  );
};

// Component for listing revisions
const RevisionList = ({ revisions, navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredRevisions = revisions.filter(revision =>
    revision.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Revisiones</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Placa"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => { /* Implement search logic here */ }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 shadow-sm"
          >
            Buscar
          </button>
          {/* Note: This button should ideally lead to selecting a vehicle first before creating a new revision */}
          <button
            onClick={() => navigateTo('vehicles')} // Redirect to vehicle list to select a vehicle first
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Nueva revisión
          </button>
        </div>
      </div>
      {filteredRevisions.length > 0 ? (
        <ul className="space-y-4">
          {filteredRevisions.map((revision, index) => (
            <li
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-medium text-gray-900">Placa: {revision.placa}</h3>
              <p className="text-sm text-gray-600">Fecha: {new Date(revision.fecha).toLocaleString()}</p>
              {revision.items && revision.items.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-md font-medium text-gray-700">Items Revisados:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {revision.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <strong>{item.item}:</strong> {item.comentarios} (Técnico: {item.tecnico})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-8">No hay revisiones agendadas o registradas.</p>
      )}
    </div>
  );
};

// Component for creating a new vehicle
const NewVehicleForm = ({ navigateTo, addVehicle }) => {
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [linea, setLinea] = useState('');
  const [modelo, setModelo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (placa && marca && linea && modelo) {
      addVehicle({ placa, marca, linea, modelo });
    } else {
      alert('Por favor, completa todos los campos.'); // Using alert for simplicity, replace with custom modal
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Nuevo Vehículo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa</label>
          <input
            type="text"
            id="placa"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
          <input
            type="text"
            id="marca"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="linea" className="block text-sm font-medium text-gray-700">Línea</label>
          <input
            type="text"
            id="linea"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="text"
            id="modelo"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigateTo('vehicles')}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors duration-200 shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

// Component for displaying vehicle details and latest revision
const VehicleDetails = ({ selectedVehicle, revisions, navigateTo }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  if (!selectedVehicle) {
    return <p className="text-center text-gray-500 py-8">Selecciona un vehículo para ver los detalles.</p>;
  }

  const latestRevision = revisions.find(rev => rev.placa === selectedVehicle.placa);

  // Function to fetch vehicle location from backend
  const fetchLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    try {
      // In a real application, you would fetch from your backend:
      // const response = await fetch(`/api/vehicles/${selectedVehicle.mId}/location`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch location');
      // }
      // const data = await response.json();
      // setCurrentLocation({ latitude: data.latitude, longitude: data.longitude });

      // Mocking location for now:
      const mockLocations = [
        { latitude: 6.2442, longitude: -75.5812 }, // Medellín
        { latitude: 4.7110, longitude: -74.0721 }  // Bogotá
      ];
      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      setCurrentLocation(randomLocation);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationError("No se pudo obtener la ubicación actual.");
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    // Optionally fetch location when component mounts or selectedVehicle changes
    // fetchLocation();
  }, [selectedVehicle]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Datos del Vehículo</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateTo('new-revision', selectedVehicle)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Nueva revisión
          </button>
        </div>
      </div>
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
        <p><strong className="text-gray-700">Placa:</strong> {selectedVehicle.placa}</p>
        <p><strong className="text-gray-700">Marca:</strong> {selectedVehicle.marca}</p>
        <p><strong className="text-gray-700">Línea:</strong> {selectedVehicle.linea}</p>
        <p><strong className="text-gray-700">Modelo:</strong> {selectedVehicle.modelo}</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mt-8">Última Revisión</h3>
      {latestRevision ? (
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Fecha: {new Date(latestRevision.fecha).toLocaleString()}</p>
          <div className="mt-4 space-y-4">
            {latestRevision.items && latestRevision.items.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-800">{item.item}</h4>
                <p className="text-sm text-gray-700"><strong>Técnico:</strong> {item.tecnico}</p>
                <p className="text-sm text-gray-700"><strong>Comentario:</strong> {item.comentarios}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No hay revisiones registradas para este vehículo.</p>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mt-8">Ubicación Actual</h3>
      <div className="bg-gray-200 p-8 rounded-lg text-center text-gray-600 h-64 flex flex-col items-center justify-center">
        {loadingLocation ? (
          <p>Cargando ubicación...</p>
        ) : locationError ? (
          <p className="text-red-600">{locationError}</p>
        ) : currentLocation ? (
          <p>Latitud: {currentLocation.latitude}, Longitud: {currentLocation.longitude}</p>
          // In a real app, you'd embed an OpenStreetMap iframe or library here
        ) : (
          <p>Haz clic para obtener la ubicación del vehículo.</p>
        )}
        <button
          onClick={fetchLocation}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors duration-200 shadow-md"
          disabled={loadingLocation}
        >
          {loadingLocation ? 'Obteniendo...' : 'Obtener Ubicación'}
        </button>
        {currentLocation && (
            <div className="mt-4 w-full h-full">
                {/* Placeholder for OpenStreetMap iframe */}
                <iframe
                    title="OpenStreetMap Location"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.longitude - 0.01}%2C${currentLocation.latitude - 0.01}%2C${currentLocation.longitude + 0.01}%2C${currentLocation.latitude + 0.01}&amp;layer=mapnik&amp;marker=${currentLocation.latitude}%2C${currentLocation.longitude}`}
                    style={{border: '1px solid black'}}
                ></iframe>
                <br/><small><a href={`https://www.openstreetmap.org/?mlat=${currentLocation.latitude}&mlon=${currentLocation.longitude}#map=15/${currentLocation.latitude}/${currentLocation.longitude}`}>Ver mapa más grande</a></small>
            </div>
        )}
      </div>

      <div className="flex justify-start mt-6">
        <button
          onClick={() => navigateTo('vehicles')}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors duration-200 shadow-sm"
        >
          Volver a Vehículos
        </button>
      </div>
    </div>
  );
};

// Component for scheduling a new revision
const NewRevisionForm = ({ selectedVehicle, navigateTo, addRevision }) => {
  const [fechaHora, setFechaHora] = useState('');
  const [itemsToReview, setItemsToReview] = useState([{ item: '' }]);

  useEffect(() => {
    if (!selectedVehicle) {
      // If no vehicle is selected, navigate back to vehicles list
      navigateTo('vehicles');
    }
  }, [selectedVehicle, navigateTo]);

  const handleAddItem = () => {
    setItemsToReview([...itemsToReview, { item: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = itemsToReview.filter((_, i) => i !== index);
    setItemsToReview(newItems);
  };

  const handleItemChange = (index, value) => {
    const newItems = itemsToReview.map((item, i) =>
      i === index ? { ...item, item: value } : item
    );
    setItemsToReview(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedVehicle && fechaHora && itemsToReview.every(i => i.item)) {
      addRevision({
        placa: selectedVehicle.placa,
        fecha: fechaHora,
        items: itemsToReview.map(i => ({ item: i.item, tecnico: '', comentarios: '' })), // Initialize with empty tech/comments
      });
    } else {
      alert('Por favor, completa todos los campos.'); // Using alert for simplicity, replace with custom modal
    }
  };

  if (!selectedVehicle) {
    return (
      <p className="text-center text-gray-500 py-8">
        No se ha seleccionado un vehículo para agendar una revisión. Por favor, selecciona uno de la lista de vehículos.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Creación de Nueva Revisión</h2>
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del vehículo</h3>
        <p><strong className="text-gray-700">Placa:</strong> {selectedVehicle.placa}</p>
        <p><strong className="text-gray-700">Marca:</strong> {selectedVehicle.marca}</p>
        <p><strong className="text-gray-700">Línea:</strong> {selectedVehicle.linea}</p>
        <p><strong className="text-gray-700">Modelo:</strong> {selectedVehicle.modelo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fechaHora" className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
          <input
            type="datetime-local"
            id="fechaHora"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Items a revisar</label>
          {itemsToReview.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={item.item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              {itemsToReview.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  -
                </button>
              )}
              {index === itemsToReview.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigateTo('vehicle-details', selectedVehicle)}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors duration-200 shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

// Component for reviewing and logging results of pending items
const PendingReview = ({ selectedVehicle, revisions, navigateTo, updateRevisionResults }) => {
    // Find the latest revision for the selected vehicle that might be "pending"
    // In a real app, you'd fetch this specific pending revision from the backend.
    // For this mock, we'll take the latest one.
    const initialRevision = revisions.find(rev => rev.placa === selectedVehicle?.placa);

    const [currentRevision, setCurrentRevision] = useState(() => {
        // Deep copy the initial revision to allow independent editing
        return initialRevision ? JSON.parse(JSON.stringify(initialRevision)) : null;
    });

  useEffect(() => {
    if (!selectedVehicle) {
        alert('Por favor, selecciona un vehículo para registrar los resultados de la revisión.');
        navigateTo('vehicles');
    } else if (!currentRevision) {
        alert('No hay una revisión pendiente para este vehículo.');
        navigateTo('vehicle-details', selectedVehicle);
    }
  }, [selectedVehicle, currentRevision, navigateTo]);

  const handleItemUpdate = (index, field, value) => {
    const updatedItems = [...currentRevision.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCurrentRevision({ ...currentRevision, items: updatedItems });
  };

  const handleSaveItem = (index) => {
    // In a real application, you'd send this single item update to the backend
    alert(`Resultados para ${currentRevision.items[index].item} guardados localmente!`); // Replace with custom modal
  };

  const handleSaveAll = () => {
    updateRevisionResults(selectedVehicle.placa, currentRevision.items);
  };

  if (!selectedVehicle || !currentRevision) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Revisión Pendiente y Registro de Resultados</h2>
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del Vehículo</h3>
        <p><strong className="text-gray-700">Placa:</strong> {selectedVehicle.placa}</p>
        <p><strong className="text-gray-700">Marca:</strong> {selectedVehicle.marca}</p>
        <p><strong className="text-gray-700">Línea:</strong> {selectedVehicle.linea}</p>
        <p><strong className="text-gray-700">Modelo:</strong> {selectedVehicle.modelo}</p>
        <p className="mt-2"><strong className="text-gray-700">Revisión Pendiente:</strong> {new Date(currentRevision.fecha).toLocaleString()}</p>
      </div>

      <div className="space-y-6">
        {currentRevision.items.map((item, index) => (
          <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-medium text-gray-800 mb-3">{item.item}</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor={`tecnico-${index}`} className="block text-sm font-medium text-gray-700">Técnico</label>
                <input
                  type="text"
                  id={`tecnico-${index}`}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={item.tecnico}
                  onChange={(e) => handleItemUpdate(index, 'tecnico', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`comentarios-${index}`} className="block text-sm font-medium text-gray-700">Comentarios</label>
                <textarea
                  id={`comentarios-${index}`}
                  rows="3"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={item.comentarios}
                  onChange={(e) => handleItemUpdate(index, 'comentarios', e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveItem(index)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => navigateTo('vehicle-details', selectedVehicle)}
          className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors duration-200 shadow-sm"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSaveAll}
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Guardar Todos los Resultados
        </button>
      </div>
    </div>
  );
};

export default App;
