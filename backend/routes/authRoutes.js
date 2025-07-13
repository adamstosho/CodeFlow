const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  authController.login
);

module.exports = router; 