import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import VehicleList from './pages/VehicleList';
import Revisions from './pages/Revisions';
import CreateVehicle from './pages/CreateVehicle';
import VehicleDetails from './pages/VehicleDetails';
import ScheduleRevision from './pages/ScheduleRevision';
import './App.css';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/vehicles" />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/new" element={<CreateVehicle />} />
            <Route path="/vehicles/:plate" element={<VehicleDetails />} />
            <Route path="/vehicles/:plate/revisions/new" element={<ScheduleRevision />} />
            <Route path="/revisions" element={<Revisions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;