const express = require('express');
const multer = require('multer');
const router = express.Router();
const imageController = require('../controllers/image.controller');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), imageController.uploadImage);
router.delete('/delete/:fileId', imageController.deleteImage);

module.exports = router;
