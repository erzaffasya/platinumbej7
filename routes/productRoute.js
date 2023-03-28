const express = require('express');
const router = express.Router();
const { ProductController } = require('../controllers/productController');
const productController = new ProductController();
const validation  = require('../middlewares/validation');
const { productValidator } = require ('../helpers/validator')
const { authAdmin, authUser } = require('../middlewares/authentication');
const multer = require('../middlewares/multer')

//   router API

router.get('/product', productController.get);
router.post('/product', authAdmin, multer.single('avatar'), validation(productValidator), productController.create);
router.patch('/product/:id', authAdmin, productController.update);
router.delete('/product/:id', authAdmin, productController.deleteByID);

module.exports = router;