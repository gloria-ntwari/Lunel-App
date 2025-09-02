const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Email validation for allowed domains
const validateEmailDomain = (req, res, next) => {
  const { email } = req.body;
  
  // Check if it's the super admin email
  if (email === 'admin@lunel.com') {
    return next();
  }
  
  // Check if email ends with @mail.louisenlund.de
  if (!email.endsWith('@mail.louisenlund.de')) {
    return res.status(400).json({
      success: false,
      message: 'Email must be from @mail.louisenlund.de domain'
    });
  }
  
  next();
};

// Email validation for login (more permissive)
const validateEmailDomainForLogin = (req, res, next) => {
  const { email } = req.body;
  
  // Allow admin email for login
  if (email === 'admin@lunel.com') {
    return next();
  }
  
  // Allow @mail.louisenlund.de emails for login
  if (email.endsWith('@mail.louisenlund.de')) {
    return next();
  }
  
  // For login, we don't restrict domains as strictly
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateEmailDomain,
  validateEmailDomainForLogin,
  handleValidationErrors
};
