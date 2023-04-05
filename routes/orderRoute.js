const express = require('express');
const router = express.Router();
const { OrderController } = require('../controllers/orderController');
const orderController = new OrderController();
const { authUser } = require('../middlewares/authentication');

// router API

router.get('/order', orderController.get);
router.post('/order', authUser, orderController.create);
router.post('/order/:id', authUser ,orderController.payOrder);
router.patch('/order', authUser, orderController.update);
router.delete('/order/:id', authUser, orderController.deleteByID);
 
module.exports = router;