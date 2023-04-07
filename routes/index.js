const express = require('express');
const router = express.Router();
const user = require('./userRoute');
const order = require('./orderRoute');
const product = require('./productRoute');

router.get('/home', (req, res) => {
  res.render('home');
});

router.use('/', user);
router.use('/', order);
router.use('/', product);

module.exports = router;
