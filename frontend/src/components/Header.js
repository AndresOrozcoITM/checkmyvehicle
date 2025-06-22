import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <h1>CheckMyVehicle</h1>
            <nav className="nav-buttons">
                <NavLink to="/vehicles" className={({ isActive }) => isActive ? 'active' : ''}>
                    <button>Vehículos</button>
                </NavLink>
                <NavLink to="/revisions" className={({ isActive }) => isActive ? 'active' : ''}>
                    <button>Revisiones</button>
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;