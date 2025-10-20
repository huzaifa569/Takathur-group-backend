import express from 'express';
import messageRoutes from './routes/api.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// ✅ FIXED: Only frontend domains allowed
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://takathur-backend.vercel.app', // Your frontend Vercel domain
  // Add more frontend domains here if needed
];

// ✅ FIXED: Better CORS configuration
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if(!origin) return callback(null, true); 
    
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: Origin ${origin} is not allowed.`;
      console.error(msg); // Log the blocked origin
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// ✅ Handle preflight requests explicitly (fixed for Express 5+)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', messageRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Email Service API is running',
    endpoints: {
      sendMessage: 'POST /api/send-message'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
});

export default app;