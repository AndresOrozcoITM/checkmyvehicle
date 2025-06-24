const pool = require('../config/db');
const { getVehiclesFromProvider, getVehicleLocationFromProvider } = require('../services/soapService');

const syncVehicles = async (req, res) => {
    try {
        const vehiclesFromProvider = await getVehiclesFromProvider();
        if (vehiclesFromProvider.length === 0) {
            return res.status(200).json({ message: 'No new vehicles to sync or provider unavailable.' });
        }

        const conn = await pool.getConnection();
        let syncedCount = 0;

        for (const vehicle of vehiclesFromProvider) {
            const { plate, description, mid } = vehicle;

            // --- INICIO DE LA LÓGICA DE PARSEO MEJORADA ---
            const parts = description.split(' ');
            let brand = '';
            let line = '';
            let model = ''; // Por defecto, vacío

            // Busca una parte que parezca un año (4 dígitos) para asignarla como modelo
            const modelIndex = parts.findIndex(part => /^\d{4}$/.test(part));

            if (modelIndex > -1) {
                // Si encontramos un año, lo asignamos como modelo
                model = parts[modelIndex];
                const brandAndLineParts = parts.slice(0, modelIndex);
                brand = brandAndLineParts[0] || '';
                line = brandAndLineParts.slice(1).join(' ');
            } else {
                // Si no hay año, asumimos que todo es marca y línea
                brand = parts[0] || '';
                line = parts.slice(1).join(' ');
            }
            // --- FIN DE LA LÓGICA DE PARSEO MEJORADA ---


            // Usamos REPLACE INTO que es un atajo de MySQL para INSERT o UPDATE.
            // Si la placa ya existe, la actualiza. Si no, la inserta.
            await conn.query(
                'REPLACE INTO vehicles (plate, brand, line, model, mid) VALUES (?, ?, ?, ?, ?)',
                [plate, brand, line, model, mid]
            );
            syncedCount++;
        }

        conn.release();
        res.status(200).json({ message: `Sync completed. ${syncedCount} vehicles processed.` });
    } catch (error) {
        console.error('ERROR DURANTE LA SINCRONIZACIÓN:', error); // Mensaje de error más claro
        res.status(500).json({ error: 'Failed to sync vehicles.' });
    }
};

// const createVehicle = async (req, res) => {
//     try {
//         const { plate, brand, line, model } = req.body;
//         // Asignamos un mId 'local' para poder usarlo, ya que no viene del proveedor
//         const mid = `local-${plate}-${Date.now()}`;
//         const conn = await pool.getConnection();
//         const [result] = await conn.query(
//             'INSERT INTO vehicles (plate, brand, line, model, mid) VALUES (?, ?, ?, ?, ?)',
//             [plate, brand, line, model, mid]
//         );
//         conn.release();
//         res.status(201).json({ id: result.insertId, ...req.body });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to create vehicle.' });
//     }
// };

const createVehicle = async (req, res) => {
    try {
        // 1. ¿Llegan los datos correctamente?
        const { plate, brand, line, model } = req.body;
        console.log('Recibido para crear:', req.body);

        // 2. ¿El mId se genera bien?
        const mid = `local-${plate}-${Date.now()}`;        
        const conn = await pool.getConnection();

        // 3. ¿La consulta SQL es correcta?
        const [result] = await conn.query(
            'INSERT INTO vehicles (plate, brand, line, model, mid) VALUES (?, ?, ?, ?, ?)',
            [plate, brand, line, model, mid]
        );
        
        conn.release();
        res.status(201).json({ id: result.insertId, ...req.body });

    } catch (error) {
        // 4. ¿Qué error se está capturando?
        console.error('ERROR AL CREAR VEHÍCULO:', error);
        res.status(500).json({ error: 'Failed to create vehicle.' });
    }
};


const getVehicles = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query('SELECT id, plate, brand, line, model, mid FROM vehicles ORDER BY created_at DESC');
        conn.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicles.' });
    }
};


const getVehicleByPlate = async (req, res) => {
    try {
        const { plate } = req.params;
        const conn = await pool.getConnection();
        
        // Obtener datos del vehículo
        const [vehicleRows] = await conn.query('SELECT * FROM vehicles WHERE plate = ?', [plate]);
        if (vehicleRows.length === 0) {
            conn.release();
            return res.status(404).json({ message: 'Vehicle not found.' });
        }
        const vehicle = vehicleRows[0];

        // Obtener la última revisión
        const [lastRevisionRows] = await conn.query(`
            SELECT r.id, r.scheduled_date, ri.item_name, ri.technician, ri.comments
            FROM revisions r
            JOIN revision_items ri ON r.id = ri.revision_id
            WHERE r.vehicle_id = ? AND r.status = 'COMPLETED'
            ORDER BY r.scheduled_date DESC
        `, [vehicle.id]);
        
        conn.release();
        
        const lastRevision = {};
        if (lastRevisionRows.length > 0) {
            lastRevision.date = lastRevisionRows[0].scheduled_date;
            lastRevision.items = lastRevisionRows.reduce((acc, row) => {
                if (!acc.some(item => item.item_name === row.item_name)) {
                     acc.push({
                        item_name: row.item_name,
                        technician: row.technician,
                        comments: row.comments
                    });
                }
                return acc;
            }, []);
        }

        res.json({ vehicle, lastRevision });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicle details.' });
    }
};

const getVehicleLocation = async (req, res) => {
    try {
        const { mid } = req.params;
        const location = await getVehicleLocationFromProvider(mid);
        res.json(location);
    } catch (error) {
        // Diferenciar si el error es del proveedor o nuestro
        if(error.message.includes('Location not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    syncVehicles,
    createVehicle,
    getVehicles,
    getVehicleByPlate,
    getVehicleLocation,
};