const User = require('../models/user.model');
const userLog = require('../models/userLog.model');
const Document = require('../models/document.model');
const Image = require('../models/image.model');
const { BSON } = require('bson');

exports.countUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ status: true, count: userCount });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi đếm người dùng", error: error.message });
    }
};

exports.countUserLogs = async (req, res) => {
    try {
        const userLogCount = await userLog.countDocuments();
        res.status(200).json({ status: true, count: userLogCount });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi đếm nhật ký người dùng", error: error.message });
    }
};

exports.getUserLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            userLog
                .find()
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'full_name -_id'),
            userLog.countDocuments()
        ]);

        const cleanedLogs = logs.map(log => {
            const { userId, ...rest } = log.toObject();
            return {
                ...rest,
                user: userId ? { full_name: userId.full_name } : null
            };
        });

        res.status(200).json({
            status: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total,
            logs: cleanedLogs
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Lỗi khi lấy nhật ký người dùng",
            error: error.message
        });
    }
};

exports.countDocuments = async (req, res) => {
    try {
        const documentCount = await Document.countDocuments();
        res.status(200).json({ status: true, count: documentCount });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi đếm tài liệu", error: error.message });
    }
};

exports.countImages = async (req, res) => {
    try {
        const imageCount = await Image.countDocuments();
        res.status(200).json({ status: true, count: imageCount });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi đếm hình ảnh", error: error.message });
    }
};


function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function calculateTotalSize(Model) {
    const docs = await Model.find({});
    return {
        count: docs.length,
        sizeInBytes: docs.reduce((sum, doc) => sum + BSON.calculateObjectSize(doc.toObject()), 0)
    };
}
