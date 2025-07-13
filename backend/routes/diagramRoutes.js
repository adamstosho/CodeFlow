const express = require('express');
const router = express.Router();
const diagramController = require('../controllers/diagramController');
const authMiddleware = require('../middleware/authMiddleware');

// Public shareable link
router.get('/share/:id', diagramController.getSharedDiagram);

// All routes below require authentication
router.use(authMiddleware);

// POST /api/diagrams
router.post('/', diagramController.createDiagram);

// GET /api/diagrams
router.get('/', diagramController.getDiagrams);

// GET /api/diagrams/:id
router.get('/:id', diagramController.getDiagramById);

// DELETE /api/diagrams/:id
router.delete('/:id', diagramController.deleteDiagram);

// POST /api/diagrams/export
router.post('/export', diagramController.exportDiagram);

// PATCH /api/diagrams/:id/share
router.patch('/:id/share', diagramController.toggleShareDiagram);

// PATCH /api/diagrams/:id (update diagram)
router.patch('/:id', diagramController.updateDiagram);

module.exports = router; 