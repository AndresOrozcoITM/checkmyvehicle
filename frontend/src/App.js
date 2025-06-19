import VehicleList from './VehicleList'; //Importa la lista de vehículos
import MapView from './MapView'; //Importa la vista del mapa

function App() {
  return (
    <div>
      <h1>CheckMyVehicle App</h1>
      <VehicleList />
      <MapView mid="123456789" />
    </div>
  );
}

export default App;