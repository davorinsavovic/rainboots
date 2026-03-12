const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import your email route
const sendEmailRoutes = require('./routes/sendEmailRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes - ONLY email functionality
app.use('/api', sendEmailRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Email server running on port ${PORT}`);
  console.log(`📧 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📨 Send email: POST http://localhost:${PORT}/api/send-email`);
});
