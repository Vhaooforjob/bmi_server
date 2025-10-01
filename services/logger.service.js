const systemLog = require('../models/systemLog.model');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });  

class Logger {
  async logRequest(method, path, status, responseTime) {
    const logEntry = new systemLog({
      method,
      path,
      status,
      responseTime,
    });
    await logEntry.save();
  }

  async getSystemLogs(limit) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await systemLog.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });

    const totalLogs = await systemLog.countDocuments();

    const logs = await systemLog
    .find()
    .sort({ timestamp: -1 })
    .limit(limit);

    const earliestLog = await systemLog.findOne().sort({ timestamp: 1 });
    
    return { 
        total: totalLogs,  
        current: logs.length, 
        earliestLogTimestamp: earliestLog ? earliestLog.timestamp : null, 
        logs 
    };
  }

  async clearSystemLogs() {
    await systemLog.deleteMany({});
  }
}

module.exports = new Logger();
  