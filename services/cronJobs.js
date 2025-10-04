const cron = require('node-cron');
const VerificationCodeModel = require('../models/verificationCode.model');
const systemLogModel = require('../models/systemLog.model');

cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const result = await VerificationCodeModel.deleteMany({ expiresAt: { $lte: now } });
        console.log(`[CRON JOB] Xóa ${result.deletedCount} passcode hết hạn`);
    } catch (error) {
        console.error('[CRON JOB] Lỗi khi xóa passcode hết hạn:', error);
    }
});

cron.schedule('0 0 * * *', async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await systemLogModel.deleteMany({
            timestamp: { $lt: thirtyDaysAgo },
        });

        console.log(`[CRON JOB] Xóa ${result.deletedCount} logs cũ hơn 30 ngày`);
    } catch (error) {
        console.error('[CRON JOB] Lỗi khi xóa logs cũ:', error);
    }
});

cron.schedule('*/10 * * * *', async () => {
    try {
        const res = await axios.get('https://bmi-server-tj6r.onrender.com/');
        console.log(`[CRON JOB] Ping thành công server Render: ${res.status}`);
    } catch (error) {
        console.error('[CRON JOB] Lỗi khi ping server Render:', error.message);
    }
});
