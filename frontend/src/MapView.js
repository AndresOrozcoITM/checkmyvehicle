import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function MapView({ mid }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/location/${mid}`)
      .then(res => {
        setLocation({
          lat: parseFloat(res.data.Lat),
          lng: parseFloat(res.data.Lng)
        });
      });
  }, [mid]);

  return location ? (
    <MapContainer center={location} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={location}>
        <Popup>
          Ubicación actual del vehículo.
        </Popup>
      </Marker>
    </MapContainer>
  ) : <p>Cargando ubicación...</p>;
}

export default MapView;