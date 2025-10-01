const uaParser = require('ua-parser-js');
const geoip = require('geoip-lite');

class LogHelper {
    static getClientInfo(req) {
        const userAgent = req.headers['user-agent'];
        const parsedUa = uaParser(userAgent);
        const os = parsedUa.os.name || "Unknown OS";
        const browser = parsedUa.browser.name || "Unknown Browser";
        const deviceType = parsedUa.device.type || "PC";

        const forwarded = req.headers['x-forwarded-for'];
        const ipList = forwarded ? forwarded.split(',').map(ip => ip.trim()) : [req.socket.remoteAddress];

        const primaryIp = ipList.length > 0 ? ipList[0] : "Unknown IP";
        const geo = geoip.lookup(primaryIp);
        const location = geo ? `${geo.city}, ${geo.country}` : "Unknown Location";

        return {
            ipAddress: ipList.join(', '),
            location,  
            deviceType,
            os,
            browser,
            userAgent
        };
    }
}

module.exports = LogHelper;
