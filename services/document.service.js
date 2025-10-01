const DocumentModel = require('../models/document.model');

class DocumentService {
  static async createDocument(documentData) {
    try {
      const newDocument = new DocumentModel(documentData);
      return await newDocument.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllDocuments() {
    try {
      return await DocumentModel.find().populate('userId');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getDocumentById(id) {
    try {
      return await DocumentModel.findById(id).populate('userId');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateDocument(id, updateData) {
    try {
      return await DocumentModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteDocument(id) {
    try {
      return await DocumentModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getRelatedDocumentsByTitle(title) {
    try {
      const regex = new RegExp(title, 'i');
      return await DocumentModel.find({ title: regex }).limit(10).populate('userId');
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DocumentService;
