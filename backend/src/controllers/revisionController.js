const pool = require('../config/db');

const scheduleRevision = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const { vehicleId, scheduledDate, items } = req.body;

        const [revResult] = await conn.query(
            'INSERT INTO revisions (vehicle_id, scheduled_date) VALUES (?, ?)',
            [vehicleId, scheduledDate]
        );
        const revisionId = revResult.insertId;

        for (const item of items) {
            await conn.query(
                'INSERT INTO revision_items (revision_id, item_name) VALUES (?, ?)',
                [revisionId, item]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Revision scheduled successfully.', revisionId });

    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to schedule revision.' });
    } finally {
        conn.release();
    }
};

const getPendingRevisions = async (req, res) => {
     try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(`
            SELECT 
                r.id as revision_id,
                r.scheduled_date,
                v.plate,
                v.brand,
                v.line,
                v.model,
                GROUP_CONCAT(
                    JSON_OBJECT('id', ri.id, 'item_name', ri.item_name, 'technician', ri.technician, 'comments', ri.comments)
                ) as items
            FROM revisions r
            JOIN vehicles v ON r.vehicle_id = v.id
            JOIN revision_items ri ON r.id = ri.revision_id
            WHERE r.status = 'PENDING'
            GROUP BY r.id
            ORDER BY r.scheduled_date ASC
        `);
        conn.release();

        // Parsear el string JSON de items
        const revisions = rows.map(row => ({
            ...row,
            items: JSON.parse(`[${row.items}]`)
        }));

        res.json(revisions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending revisions.' });
    }
};

const updateRevisionItem = async (req, res) => {
    try {
        const { revisionId, itemId } = req.params;
        const { technician, comments } = req.body;

        const conn = await pool.getConnection();
        await conn.query(
            'UPDATE revision_items SET technician = ?, comments = ? WHERE id = ?',
            [technician, comments, itemId]
        );

        // Opcional: verificar si todos los items de la revisión están completos
        // para marcar la revisión como 'COMPLETED'.
        const [items] = await conn.query(
            'SELECT COUNT(*) as pending_items FROM revision_items WHERE revision_id = ? AND technician IS NULL',
            [revisionId]
        );

        if (items[0].pending_items === 0) {
            await conn.query('UPDATE revisions SET status = "COMPLETED" WHERE id = ?', [revisionId]);
        }
        
        conn.release();
        res.status(200).json({ message: 'Item updated successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update revision item.' });
    }
};

module.exports = {
    scheduleRevision,
    getPendingRevisions,
    updateRevisionItem,
};