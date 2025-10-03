const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/kcal.controller');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/user/:userId', ctrl.getByUserId); 
router.get('/:id', ctrl.detail);          
router.put('/:id', ctrl.update);         
router.delete('/:id', ctrl.remove);  

module.exports = router;
