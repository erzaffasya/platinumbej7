const express = require('express');
const router = express.Router();
const { TweetController } = require('../controllers/tweetController');
const tweetController = new TweetController();
const validation  = require('../middlewares/validation');
const { tweetValidator } = require ('../helpers/validator')
const { authAdmin, authUser } = require('../middlewares/authentication');
const { upload } = require('../middlewares/multer')

//   router API

router.get('/tweet', authAdmin, tweetController.get);
router.post('/tweet', authAdmin, upload.single('avatar'), validation(tweetValidator), tweetController.create);
router.patch('/tweet/:id', authAdmin, validation(tweetValidator), tweetController.update);
router.delete('/tweet/:id', authAdmin, tweetController.deleteByID);

module.exports = router;