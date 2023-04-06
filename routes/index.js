const express = require('express');
const router = express.Router();
const user = require('./userRoute');
const order = require('./orderRoute');
const product = require('./productRoute');
const chat = require('./chatRoute');

router.get('/home', (req, res) => {
  res.render('home');
});

router.use('/', user);
router.use('/', order);
router.use('/', product);
router.use('/', chat);

module.exports = router;
