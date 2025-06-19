import { useEffect, useState } from 'react'; // Importa useEffect y useState de React
import axios from 'axios'; // Importa axios para hacer peticiones HTTP

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/vehicles')
      .then(res => setVehicles(res.data));
  }, []);

  return (
    <ul>
      {vehicles.map(v => (
        <li key={v.id}>{v.placa} - {v.descripcion}</li>
      ))}
    </ul>
  );
}

export default VehicleList;