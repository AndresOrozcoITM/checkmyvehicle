const express = require('express');
const router = express.Router();
const dbService = require('../services/dbService');

// Get all revisions
router.get('/', async (req, res) => {
  try {
    const revisions = await dbService.getAllRevisions();
    res.json(revisions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revisions', error: error.message });
  }
});

// Get revisions for a specific vehicle
router.get('/:placa', async (req, res) => {
  const { placa } = req.params;
  try {
    const revisions = await dbService.getRevisionsByPlaca(placa);
    res.json(revisions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revisions for vehicle', error: error.message });
  }
});

// Schedule a new revision
router.post('/', async (req, res) => {
  const { placa, fecha, items } = req.body;
  if (!placa || !fecha || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Placa, fecha y items son requeridos.' });
  }
  try {
    const result = await dbService.addRevision({ placa, fecha, items });
    res.status(201).json({ message: 'Revision scheduled successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling revision', error: error.message });
  }
});

// Update revision results (e.g., for a specific revision ID or based on placa and date)
router.put('/:revisionId/items', async (req, res) => {
    const { revisionId } = req.params;
    const { items } = req.body; // Expecting an array of items with technician and comments
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Items are required and must be an array.' });
    }
    try {
        const result = await dbService.updateRevisionItems(revisionId, items);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Revision not found or no items updated.' });
        }
        res.json({ message: 'Revision items updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating revision items', error: error.message });
    }
});


module.exports = router;