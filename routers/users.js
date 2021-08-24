const express = require('express');
const router = express.Router();

const basicAuth = require('../middleware/basicAuth');
router.use(basicAuth);

/* GET user listing. */
router.get('/all', function(req, res, next) {
  res.send('respond with all resources');
});

router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
