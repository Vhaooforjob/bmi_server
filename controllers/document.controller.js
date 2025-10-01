const DocumentService = require('../services/document.service');

class DocumentController {
    static async createDocument(req, res) {
        try {
          const documentData = req.body;
          if (!documentData.userId) {
            return res.status(400).json({ message: 'User ID is required' });
          }
    
          const newDocument = await DocumentService.createDocument(documentData);
          res.status(201).json(newDocument);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

    static async getAllDocuments(req, res) {
        try {
        const documents = await DocumentService.getAllDocuments();
        res.status(200).json(documents);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    static async getDocumentById(req, res) {
        try {
        const document = await DocumentService.getDocumentById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    static async updateDocument(req, res) {
        try {
        const updatedDocument = await DocumentService.updateDocument(req.params.id, req.body);
        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(updatedDocument);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }

    static async deleteDocument(req, res) {
        try {
        const deletedDocument = await DocumentService.deleteDocument(req.params.id);
        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
    static async getRelatedDocumentsByTitle(req, res) {
        try {
          const title = req.params.title;
          const documents = await DocumentService.getRelatedDocumentsByTitle(title);
          if (!documents || documents.length === 0) {
            return res.status(404).json({ message: 'No related documents found' });
          }
          res.status(200).json(documents);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
}

module.exports = DocumentController;
