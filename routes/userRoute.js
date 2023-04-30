const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/userController');
const userController = new UserController();
const { registerValidator, loginValidator } = require('../helpers/validator');
const { authAdmin,authUser } = require('../middlewares/authentication');
const validation = require ('../middlewares/validation')
const { upload } = require('../middlewares/multer')

//   router API

router.get('/user', authAdmin, userController.get);
router.get('/user/verify', userController.verify)
router.post('/register', validation(registerValidator), userController.register);
router.post('/login', validation(loginValidator), userController.login);
router.post('/avatar', authAdmin, upload.single('avatar'), userController.updateAvatar);
router.patch('/user', authUser, userController.update);
router.delete('/user', authUser, userController.deleteByID);

module.exports = router;
