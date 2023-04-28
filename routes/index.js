const express = require('express');
const router = express.Router();
const user = require('./userRoute');
const tweet = require('./tweetRoute');

router.get('/', (req, res) => {
  res.render('home');
});

router.use('/', user);
router.use('/', tweet);

module.exports = router;
