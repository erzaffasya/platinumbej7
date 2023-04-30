const express = require('express');
const router = express.Router();
const { TweetController } = require('../controllers/tweetController');
const tweetController = new TweetController();
const validation  = require('../middlewares/validation');
const { tweetValidator } = require ('../helpers/validator')
const { auth } = require('../middlewares/authentication');
const { upload } = require('../middlewares/multer')

//   router API

router.get('/tweet', auth, tweetController.get);
router.post('/tweet', auth, validation(tweetValidator), tweetController.create);
router.get('/tweet/:id', auth, tweetController.show);
router.patch('/tweet/:id', auth, validation(tweetValidator), tweetController.update);
router.delete('/tweet/:id', auth, tweetController.deleteByID);

module.exports = router;