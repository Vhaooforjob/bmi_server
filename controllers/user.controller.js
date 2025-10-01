const User = require('./../models/user.model');
const UserService = require('./../services/user.service');
const RoleService = require('./../services/role.service');
const UserLogModel = require('../models/userLog.model');
const LogHelper = require('../utils/logHelper');
const crypto = require('crypto');
const VerificationCodeModel = require('../models/verificationCode.model');
const  { sendVerificationEmail }  = require('../services/email.service');

exports.registerUser = async (req, res) => {
    try {
        const { email, username, password, full_name } = req.body;

        const [emailExists, usernameExists] = await Promise.all([
            UserService.checkEmailUser(email),
            UserService.checkUsernameUser(username)
        ]);
        
        if (emailExists) {
            return res.status(400).json({ status: false, message: "Email đã tồn tại" });
        }
        if (usernameExists) {
            return res.status(400).json({ status: false, message: "Username đã tồn tại" });
        }

        const newUser = await UserService.registerUser(email, username, password, full_name);

        const passcode = crypto.randomInt(100000, 999999).toString();
        await VerificationCodeModel.create({
            userId: newUser._id,
            code: passcode,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
        });
        await sendVerificationEmail(email, passcode);

        res.json({ status: true, message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};

exports.verifyPasscode = async (req, res) => {
    const { email, passcode } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }

        const verification = await VerificationCodeModel.findOne({ userId: user._id });
        if (!verification || verification.code !== passcode || new Date() > verification.expiresAt) {
            return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' });
        }

        user.verified = true;
        user.active_status = '1';
        await user.save();
        await VerificationCodeModel.deleteOne({ _id: verification._id });

        res.json({ message: 'Xác nhận thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xác nhận', error });
    }
};

exports.reverifyUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: "Email không tồn tại" });
        }

        if (user.verified) {
            return res.status(400).json({ status: false, message: "Tài khoản đã được xác minh trước đó" });
        }

        const newPasscode = crypto.randomInt(100000, 999999).toString();
        await VerificationCodeModel.findOneAndUpdate(
            { userId: user._id },
            { code: newPasscode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
            { upsert: true, new: true }
        );

        await sendVerificationEmail(email, newPasscode);
        res.json({ status: true, message: "Mã xác minh mới đã được gửi" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi khi gửi lại mã xác minh", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.checkEmailUser(email);
        
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }

        if (user.active_status === '0') {
            return res.status(403).json({ status: false, message: "Account is deactivated. Please contact support." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ status: false, message: "Password is incorrect" });
        }

        const tokenData = { _id: user._id, email: user.email };
        // const token = await UserService.generateToken(tokenData, "secretKey", "1h");
        const token = await UserService.generateToken(tokenData, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
        const refreshToken = await UserService.generateRefreshToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE);

        const clientInfo = LogHelper.getClientInfo(req);

        await UserLogModel.create({
            action: 'LOGIN',
            userId: user._id,
            email: user.email,
            role: user.roleId ? user.roleId.name : 'User', 
            ...clientInfo 
        });

        res.status(200).json({ status: true, token: token, expiresIn : process.env.JWT_EXPIRE, refreshToken: refreshToken,});
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.checkEmailUser(email);
  
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }
      
        if (user.active_status === '0') {
            return res.status(403).json({ status: false, message: "Account is deactivated. Please contact support." });
        }
        const isMatch = await user.comparePassword(password);
            if (!isMatch) {
            return res.status(400).json({ status: false, message: "Password is incorrect" });
        }
      
        const populatedUser = await User.findById(user._id).populate('roleId');
        const role = populatedUser.roleId;

        if (!role || !role.permissions.includes('ACCESS_LOGIN_ADMIN')) {
            return res.status(403).json({ status: false, message: "Access denied. You do not have permission to log in as admin." });
        }
        const roleName = 'Admin';
        const permissions = role.permissions;
        const tokenData = { _id: user._id, email: user.email,  roleName: roleName, permissions: permissions };
        const token = await UserService.generateToken(tokenData, process.env.JWT_SECRET, process.env.JWT_EXPIRE);
        const refreshToken = await UserService.generateRefreshToken(tokenData, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRE);
  
        const clientInfo = LogHelper.getClientInfo(req);

        await UserLogModel.create({
            action: 'LOGIN_ADMIN',
            userId: user._id,
            email: user.email,
            role: roleName, 
            permissions: permissions,
            ...clientInfo 
        });

      res.status(200).json({ status: true, token: token, expiresIn: process.env.JWT_EXPIRE, refreshToken: refreshToken, roleName, permissions });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
};
  
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const newAccessToken = await UserService.refreshAccessToken(refreshToken);

        res.status(200).json({
            status: true,
            token: newAccessToken.accessToken 
        });
    } catch (error) {
        res.status(401).json({ status: false, message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roleId', 'name');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // Extract the token
        const user = await UserService.getUserById(token, req.params.id);
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: err.message }); 
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ status: false, message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.deleteUser(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};