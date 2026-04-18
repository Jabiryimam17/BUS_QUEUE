const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connect_database } = require('./configs/database');
const { error_handler, not_found_handler } = require('./middleware/error_middleware');

// Import routers
const auth_router = require('./routers/auth_router');
const bus_router = require('./routers/bus_router');
const ticket_router = require('./routers/ticket_router');
const user_router = require('./routers/user_router');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'BusQueue Backend API is running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// API routes
app.use('/api/auth', auth_router);
app.use('/api/buses', bus_router);
app.use('/api/tickets', ticket_router);
app.use('/api/users', user_router);

// Error handling
app.use(not_found_handler);
app.use(error_handler);

// Start server
const start_server = async () => {
  try {
    // Connect to database
    await connect_database();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start_server();

module.exports = app;
