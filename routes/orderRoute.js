const express = require('express');
const router = express.Router();
const { OrderController } = require('../controllers/orderController');
const orderController = new OrderController();
const { authUser, authAdmin } = require('../middlewares/authentication');

// router API

router.get('/order', authAdmin, orderController.get);
router.get('/order/user', authUser, orderController.getOrderUser);
router.post('/order', authUser, orderController.create);
router.post('/order/:id', authUser ,orderController.payOrder);
router.patch('/order', authUser, orderController.update);
router.delete('/order/:id', authUser, orderController.deleteByID);

module.exports = router;