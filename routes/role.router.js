const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');

router.post('/createRoles', RoleController.createRole);
router.get('/getRoles', RoleController.getRoles);
router.get('/getRoles/:id', RoleController.getRoleById);
router.put('/updateRoles/:id', RoleController.updateRole);
router.delete('/DeleteRoles/:id', RoleController.deleteRole);

module.exports = router;
