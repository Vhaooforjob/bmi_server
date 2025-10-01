const express = require('express');
const Logger = require('../services/logger.service');
const verifyApiKey = require('../middleware/verifyApiKey');
const router = express.Router();

router.use(verifyApiKey);

router.get('/sys', async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit <= 0) limit = 10;

    const logsData = await Logger.getSystemLogs(limit);
    res.status(200).json({
      status: true,
      ...logsData,
    });

  } catch (error) {
    const code = error.message.includes('API key') ? 401 : 500;
    res.status(code).json({
      status: false,
      message: error.message,
    });
  }
});


router.delete('/sys', async (req, res) => {
  try {
    await Logger.clearSystemLogs();
    res.status(200).json({ status: true, message: 'Đã xóa toàn bộ log' });

  } catch (error) {
    const code = error.message.includes('API key') ? 401 : 500;
    res.status(code).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
