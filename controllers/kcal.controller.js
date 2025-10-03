const KcalService = require('../services/kcal.service');

exports.create = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || null;
    const doc = await KcalService.createOrReplace(req.body, userId);
    res.json({ status: true, id: doc._id, data: doc });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const items = await KcalService.listRecords({ userId: req.query.userId });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.detail = async (req, res) => {
  try {
    const item = await KcalService.getRecordById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const item = await KcalService.getRecordByUserId(req.params.userId);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await KcalService.updateRecord(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await KcalService.deleteRecord(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
