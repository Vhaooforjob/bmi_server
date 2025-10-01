const fs = require('fs');
const { google } = require('googleapis');
const ImageModel = require('../models/image.model');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gdrive-api-456703-fdeef124a436.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const fileMeta = {
      name: fileName,
      mimeType: req.file.mimetype,
      parents: [process.env.FOLDER_ID],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMeta,
      media,
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

    await ImageModel.create({
      url: publicUrl,
      fileId: fileId,
    });    

    fs.unlinkSync(filePath);

    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
};
exports.deleteImage = async (req, res) => {
  const { fileId } = req.params;  

  if (!fileId) return res.status(400).json({ error: 'File ID is required' });

  try {
    await drive.files.delete({
      fileId: fileId,
    });
    await ImageModel.deleteOne({ fileId: fileId });

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ error: 'Delete failed', detail: err.message });
  }
};
