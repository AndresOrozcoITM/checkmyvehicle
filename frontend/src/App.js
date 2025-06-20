import VehicleList from './VehicleList'; //Importa la lista de vehículos
import MapView from './MapView'; //Importa la vista del mapa

function App() {
  return (
    <div>
      <h1>CheckMyVehicle App</h1>
      <VehicleList />
      <MapView mid="123456789" /> // Muestra la lista de vehículos y el mapa
      {/* Puedes pasar un MID específico al componente MapView */}
    </div>
  );
}

export default App;