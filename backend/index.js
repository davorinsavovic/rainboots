require('dotenv').config();

// Connect to MongoDB FIRST
const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/rainboots-leads';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch((err) => console.error('❌ MongoDB Connection error:', err));

console.log('🔍 Checking environment:');
console.log(
  '  ANTHROPIC_API_KEY:',
  process.env.ANTHROPIC_API_KEY ? '✅ Loaded' : '❌ Missing',
);
console.log('  MONGODB_URI:', MONGODB_URI);
console.log('  PORT:', process.env.PORT || '5001');

const express = require('express');
const cors = require('cors');

// Import routes
const auditRoutes = require('./routes/auditRoutes');
const sendEmailRoutes = require('./routes/sendEmailRoutes');
const leadRoutes = require('./routes/leadRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://rainbootsmarketing.com',
      'https://www.rainbootsmarketing.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// Routes
console.log('🔄 Mounting routes...');
app.use('/api', auditRoutes);
app.use('/api', sendEmailRoutes);
app.use('/api', leadRoutes);
app.use('/api', blogRoutes);
console.log('✅ Routes mounted');

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/send-email`);
  console.log(`   POST http://localhost:${PORT}/api/audit`);
  console.log(`   GET  http://localhost:${PORT}/api/leads`);
  console.log(`   POST http://localhost:${PORT}/api/leads/collect`);
});
