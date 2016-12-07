var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/health', function (req, res, next) {
	res.status(200).end();
});

router.post('/download', function (req, res, next) {	
	var filename = Date.now().toString(36) + '.png';
	fs.writeFile('./' + filename, req.body.image.replace(/^data:image\/png;base64,/, ''), 'base64', function () {
		res.redirect(302, '/download/' + filename);
	});
});

router.get('/download/:filename', function (req, res, next) {
	res.download('./' + req.params.filename);
});

module.exports = router;
