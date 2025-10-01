const RoleService = require('../services/role.service');

class RoleController {
    static async createRole(req, res) {
        try {
            if (!req.body.name) {
            return res.status(400).json({ error: 'Role name is required' });
            }

            const role = await RoleService.createRole(req.body);
            res.status(201).json(role);
          } catch (error) {
            if (error.message === 'Role name is required') {
              return res.status(400).json({ error: error.message });
            }
            if (error.message.startsWith('Invalid permissions')) {
              return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'An error occurred while creating the role' });
        }
    }

    static async getRoles(req, res) {
        try {
            const roles = await RoleService.getRoles();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching roles' });
        }
    }

    static async getRoleById(req, res) {
        try {
            const role = await RoleService.getRoleById(req.params.id);
            res.json(role);
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'An error occurred while fetching the role' });
        }
    }

    static async updateRole(req, res) {
        try {
            const role = await RoleService.updateRole(req.params.id, req.body);
            res.json(role);
          } catch (error) {
            if (error.message === 'Role not found') {
              return res.status(404).json({ error: error.message });
            }
            if (error.message.startsWith('Invalid permissions')) {
              return res.status(400).json({ error: error.message });
            }
            res.status(400).json({ error: 'An error occurred while updating the role' });
        }
    }

    static async deleteRole(req, res) {
        try {
            await RoleService.deleteRole(req.params.id);
            res.json({ message: 'Role deleted' });
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'An error occurred while deleting the role' });
        }
    }
}

module.exports = RoleController;
