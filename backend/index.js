require('dotenv').config();

console.log('🔍 Checking environment:');
console.log(
  '  OPENAI_API_KEY:',
  process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing',
);
console.log('  PORT:', process.env.PORT || '5001');

const express = require('express');
const cors = require('cors');

// Import routes
const auditRoutes = require('./routes/auditRoutes');
const sendEmailRoutes = require('./routes/sendEmailRoutes');

console.log('📦 Routes loaded:');
console.log(
  '  - auditRoutes:',
  typeof auditRoutes === 'function' ? '✅ Router' : '❌ Not a router',
);
console.log(
  '  - sendEmailRoutes:',
  typeof sendEmailRoutes === 'function' ? '✅ Router' : '❌ Not a router',
);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Routes
console.log('🔄 Mounting routes...');
app.use('/api', auditRoutes);
app.use('/api', sendEmailRoutes);
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
});
