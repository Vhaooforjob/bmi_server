const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller');

router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post("/registration",userController.registerUser);
router.post("/login",userController.loginUser);
router.post("/loginAdmin",userController.loginAdmin);
router.post('/refresh-token', userController.refreshToken);
router.post('/verifyPasscode', userController.verifyPasscode);
router.post('/reverifyUser', userController.reverifyUser);
module.exports = router;
