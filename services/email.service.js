const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASS,
    }
});

/**
 * @param {string} email 
 * @param {string} passcode 
 */
const sendVerificationEmail = async (email, passcode) => {
    try {
        const expirationTime = new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(Date.now() + 5 * 60 * 1000));
        
        
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Xác nhận tài khoản của bạn',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border-radius: 10px; background-color: #f4f4f4;">
                    <h2 style="color: #007BFF;">Xác nhận tài khoản</h2>
                    <p style="font-size: 16px;">Cảm ơn bạn! Dưới đây là mã xác nhận của bạn:</p>
                    <div style="display: inline-block; background: #ffffff; padding: 15px; border-radius: 5px; border: 2px solid #007BFF;">
                        <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${passcode}</span>
                    </div>
                    <p style="font-size: 14px; color: #888;">Mã này sẽ có hiệu lực đến: <strong>${expirationTime}</strong>.</p>
                    <p style="margin-top: 20px;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    
                    <p style="margin-top: 10px;">Hoặc nếu có nghi vấn vui lòng liên hệ với Quản trị viên hệ thống thông qua thông tin bên dưới!</p>

                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #aaa;">Email này được gửi tự động, vui lòng không trả lời lại email này.<br/>Nếu có thắc mắc vui lòng liên hệ với Quản trị viên hệ thống qua email:
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email xác nhận đã được gửi.');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
    }
};

module.exports = { sendVerificationEmail };
