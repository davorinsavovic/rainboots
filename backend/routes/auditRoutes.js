const express = require('express');
const { runAudit } = require('../controllers/auditController');

const router = express.Router();

router.post('/audit', runAudit);

module.exports = router;
