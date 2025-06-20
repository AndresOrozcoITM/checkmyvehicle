-- Active: 1749782316254@@127.0.0.1@3306@checkmyvehicle
-- Create database
CREATE DATABASE IF NOT EXISTS checkmyvehicle_db;

-- Use the database
USE checkmyvehicle_db;

-- Table for Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    linea VARCHAR(100) NOT NULL,
    modelo VARCHAR(10) NOT NULL,
    mId VARCHAR(50) UNIQUE, -- Internal identifier from SOAP service
    descripcion VARCHAR(255), -- Description from SOAP service
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Revisions
CREATE TABLE IF NOT EXISTS revisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    items_revisar JSON, -- Store array of items with technical and comments as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (placa) REFERENCES vehicles(placa) ON DELETE CASCADE
);

-- Optional: Add some initial data for testing
-- INSERT INTO vehicles (placa, marca, linea, modelo, mId, descripcion) VALUES
-- ('ABC321', 'Chevrolet', 'Spark GT', '2016', 'mockMId1', 'Chevrolet Spark GT 2016'),
-- ('XYZ789', 'Nissan', 'Versa', '2020', 'mockMId2', 'Nissan Versa 2020');

-- INSERT INTO revisions (placa, fecha_hora, items_revisar) VALUES
-- ('ABC321', '2019-12-02 10:00:00', '[{"item": "Motor", "tecnico": "José Pedro Ángulo", "comentarios": "Se encontró en buen estado"}, {"item": "Aire acondicionado", "tecnico": "José Pedro Ángulo", "comentarios": "Se realizó cambio de filtro"}, {"item": "Ruedas", "tecnico": "Pepe Tamayo", "comentarios": "Se hizo cambio de las dos ruedas delanteras y se calibraron a 33"}]');