CREATE DATABASE IF NOT EXISTS checkmyvehicle;
USE checkmyvehicle;
--Andres Orozco

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(20) UNIQUE,
  descripcion VARCHAR(100),
  mid VARCHAR(50)
);