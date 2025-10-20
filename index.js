import express from 'express';
import messageRoutes from './routes/api.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

import cors from 'cors';
const allowedOrigins = [
  'http://localhost:3000',
  'https://takathur-backend.vercel.app',
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); 
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy: This origin is not allowed.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use('/api', messageRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Email Service API is running',
    endpoints: {
      sendMessage: 'POST /api/send-message'
    }
  });
});

// ✅ FIX: Always start server (both development and production)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;