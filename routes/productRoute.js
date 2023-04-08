const express = require('express');
const router = express.Router();
const { ProductController } = require('../controllers/productController');
const productController = new ProductController();
const validation  = require('../middlewares/validation');
const { productValidator } = require ('../helpers/validator')
const { authAdmin, authUser } = require('../middlewares/authentication');
const { upload } = require('../middlewares/multer')

//   router API

router.get('/product', authAdmin, productController.get);
router.post('/product', authAdmin, upload.single('avatar'), validation(productValidator), productController.create);
router.patch('/product/:id', authAdmin, validation(productValidator), productController.update);
router.delete('/product/:id', authAdmin, productController.deleteByID);

module.exports = router;