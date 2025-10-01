const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 
module.exports = function (req, res, next) {
    const apiKey = req.headers['apikey'] || req.query.apiKey;

    const validApiKey = process.env.FOLDER_ID;
    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({
            status: false,
            message: 'API key không hợp lệ hoặc thiếu'
        });
    }
    next();
};