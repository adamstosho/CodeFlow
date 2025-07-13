const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const convertRoutes = require('./routes/convertRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const diagramRoutes = require('./routes/diagramRoutes');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Security middlewares
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
}));

// Body parser
app.use(express.json());

// Swagger Setup
const swaggerOptions = {
  definition: require('./config/swagger.json'),
  apis: ['./routes/*.js'], // Scan route files for potential JSDoc
};

if (process.env.NODE_ENV === 'production') {
  swaggerOptions.definition.servers = [
    {
      url: 'https://codeflow-i39a.onrender.com/api',
      description: 'Deployed Server',
    },
  ];
} else {
  swaggerOptions.definition.servers = [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api`,
      description: 'Local Development Server',
    },
  ];
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/diagrams', diagramRoutes);

// Health check and for pinging
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;