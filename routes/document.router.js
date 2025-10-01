const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/document.controller');

router.post('/', DocumentController.createDocument);
router.get('/', DocumentController.getAllDocuments);
router.get('/search/:title', DocumentController.getRelatedDocumentsByTitle);
router.get('/:id', DocumentController.getDocumentById);
router.put('/:id', DocumentController.updateDocument);
router.delete('/:id', DocumentController.deleteDocument);

module.exports = router;
