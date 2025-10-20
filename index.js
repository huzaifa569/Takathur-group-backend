import express from 'express';
import messageRoutes from './routes/api.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// ✅ CORS - Allow all origins (production ready)
app.use(cors({
  origin: true, // Accept all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api', messageRoutes);

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Email Service API is running',
    endpoints: {
      sendMessage: 'POST /api/send-message'
    },
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS: Enabled for all origins`);
});

export default app;