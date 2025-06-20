const mysql = require('mysql2/promise'); // Using mysql2/promise for async/await
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

let pool;

// Function to initialize the connection pool
async function initializePool() {
    try {
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('MySQL connection pool initialized.');
    } catch (error) {
        console.error('Failed to initialize MySQL connection pool:', error);
        process.exit(1); // Exit if cannot connect to DB
    }
}

// Ensure pool is initialized when this module is required
initializePool();

// Test the database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database!');
        connection.release(); // Release the connection
    } catch (error) {
        console.error('Failed to connect to MySQL database:', error.message);
        console.error('Please ensure MySQL server is running and credentials are correct in .env');
    }
}

// Helper to execute queries
async function executeQuery(sql, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, params);
        return rows;
    } finally {
        if (connection) connection.release(); // Always release the connection
    }
}

// Vehicle operations
async function addVehicle(vehicle) {
    const { placa, marca, linea, modelo, mId, descripcion } = vehicle;
    // Check if vehicle already exists by mId or placa to avoid duplicates
    const existingVehicle = await executeQuery('SELECT * FROM vehicles WHERE mId = ? OR placa = ?', [mId, placa]);
    if (existingVehicle.length > 0) {
        console.log(`Vehicle with mId ${mId} or placa ${placa} already exists. Skipping.`);
        return { message: 'Vehicle already exists' };
    }
    const sql = `INSERT INTO vehicles (placa, marca, linea, modelo, mId, descripcion) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [placa, marca, linea, modelo, mId, descripcion || null];
    return executeQuery(sql, params);
}

async function getAllVehicles() {
    const sql = `SELECT * FROM vehicles ORDER BY placa`;
    return executeQuery(sql);
}

// Revision operations
async function addRevision(revision) {
    const { placa, fecha, items } = revision;
    const itemsJson = JSON.stringify(items); // Store items as JSON string
    const sql = `INSERT INTO revisions (placa, fecha_hora, items_revisar) VALUES (?, ?, ?)`;
    const params = [placa, fecha, itemsJson];
    return executeQuery(sql, params);
}

async function getAllRevisions() {
    const sql = `SELECT * FROM revisions ORDER BY fecha_hora DESC`;
    const revisions = await executeQuery(sql);
    // Parse the JSON string back to object for 'items_revisar'
    return revisions.map(rev => ({
        ...rev,
        items_revisar: rev.items_revisar ? JSON.parse(rev.items_revisar) : []
    }));
}

async function getRevisionsByPlaca(placa) {
    const sql = `SELECT * FROM revisions WHERE placa = ? ORDER BY fecha_hora DESC`;
    const revisions = await executeQuery(sql, [placa]);
    // Parse the JSON string back to object for 'items_revisar'
    return revisions.map(rev => ({
        ...rev,
        items_revisar: rev.items_revisar ? JSON.parse(rev.items_revisar) : []
    }));
}

async function updateRevisionItems(revisionId, items) {
    const itemsJson = JSON.stringify(items);
    const sql = `UPDATE revisions SET items_revisar = ? WHERE id = ?`;
    const params = [itemsJson, revisionId];
    return executeQuery(sql, params);
}

module.exports = {
    testConnection,
    addVehicle,
    getAllVehicles,
    addRevision,
    getAllRevisions,
    getRevisionsByPlaca,
    updateRevisionItems
};