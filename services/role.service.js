const RoleModel = require('../models/role.model');
const VALID_PERMISSIONS = require('../utils/permissionsValid');

class RoleService {
    static async createRole(data) {
        if (!data.name) {
            throw new Error('Role name is required');
        }

        if (data.permissions) {
            const invalid = data.permissions.filter(p => !VALID_PERMISSIONS.includes(p));
            if (invalid.length > 0) {
              throw new Error(`Invalid permissions: ${invalid.join(', ')}`);
            }
          }

        const role = new RoleModel(data);
        return await role.save();
    }

    static async getRoles() {
        try {
            return await RoleModel.find();
        } catch (error) {
            throw error;
        }
    }

    static async getRoleById(id) {
        try {
            const role = await RoleModel.findById(id);
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            throw error;
        }
    }

    static async updateRole(id, data) {
        if (data.permissions) {
            const invalid = data.permissions.filter(p => !VALID_PERMISSIONS.includes(p));
            if (invalid.length > 0) {
                throw new Error(`Invalid permissions: ${invalid.join(', ')}`);
            }
        }
    
        const role = await RoleModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        
        });
    
            if (!role) {
            throw new Error('Role not found');
        }
        return role;
    }

    static async deleteRole(id) {
        try {
            const role = await RoleModel.findByIdAndDelete(id);
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleService;
