var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/download', function(req, res, next) {	
  var filename = Date.now().toString(36);
  fs.writeFile('./' + Date.now().toString(36), req.body.image.replace(/^data:image\/png;base64,/, ''), 'base64', function () {
    res.redirect(302, '/download/' + filename);
  });
});

router.get('/download/:filename', function (req, res, next) {
	res.download('./' + req.params.filename, 'profile.png', function () {
		fs.unlinkSync('./' + req.params.filename);
	});
});

module.exports = router;
