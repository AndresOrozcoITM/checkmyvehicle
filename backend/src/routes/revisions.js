const express = require('express');
const router = express.Router();
const {
    scheduleRevision,
    getPendingRevisions,
    updateRevisionItem,
} = require('../controllers/revisionController');

router.post('/', scheduleRevision);
router.get('/pending', getPendingRevisions);
router.put('/:revisionId/items/:itemId', updateRevisionItem);

module.exports = router;