const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const convertController = require('../controllers/convertController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// POST /api/convert
router.post(
  '/',
  authMiddleware,
  [
    body('code').isString().notEmpty().withMessage('Code is required.'),
    body('language').isIn(['javascript', 'python']).withMessage('Language must be javascript or python.'),
  ],
  validate,
  convertController.convert
);

module.exports = router; 