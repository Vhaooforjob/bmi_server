const express = require('express');
const router = express.Router();
const statisticalController = require('./../controllers/statistical.controller');
const verifyApiKey = require('../middleware/verifyApiKey');

router.get('/countuser', statisticalController.countUsers);
router.get('/countuserlogs', statisticalController.countUserLogs);
router.get('/user-logs', verifyApiKey, statisticalController.getUserLogs);
router.get('/countdocuments', statisticalController.countDocuments);
router.get('/countimages', statisticalController.countImages);

module.exports = router;