// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // Parse JSON request body
app.use(cors());          // Enable CORS
app.use(morgan('dev'));   // Logging

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running 🚀' });
});

// Example API Route
app.get('/api/example', (req, res) => {
  res.json({ data: 'This is an example API endpoint' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
