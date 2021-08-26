const express = require('express');
const router = express.Router();

//add basicAuth so the not authorized user do not have access to these routers
const basicAuth = require('../middleware/basicAuth');
router.use(basicAuth);

router.get('/all', function(req, res, next) {
  res.json({users: 'respond with all resources'});
});

router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
