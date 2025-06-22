CREATE DATABASE IF NOT EXISTS checkmyvehicle;
USE checkmyvehicle;

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(10) NOT NULL UNIQUE,
    brand VARCHAR(50),
    line VARCHAR(50),
    model VARCHAR(4),
    mid VARCHAR(50) NOT NULL UNIQUE,  -- Mobile ID from SOAP service
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE revisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE revision_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    revision_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    technician VARCHAR(100),
    comments TEXT,
    FOREIGN KEY (revision_id) REFERENCES revisions(id) ON DELETE CASCADE
);

-- Datos de ejemplo
INSERT INTO vehicles (plate, brand, line, model, mid) VALUES ('ABC123', 'Chevrolet', 'Spark GT', '2018', '12345');
INSERT INTO revisions (vehicle_id, scheduled_date, status) VALUES (1, '2023-10-28 10:00:00', 'PENDING');
INSERT INTO revision_items (revision_id, item_name) VALUES (1, 'Motor');
INSERT INTO revision_items (revision_id, item_name) VALUES (1, 'Aire acondicionado');
INSERT INTO revision_items (revision_id, item_name) VALUES (1, 'Ruedas');