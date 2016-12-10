var fs = require('fs');
var express = require('express');
var router = express.Router();
var storage = require('node-persist');

router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/count', function (req, res, next) {
	storage.getItem('count').then(function (count) {
		count = count ? ++count : 1;
		res.json({ count });
		return storage.setItem('count', count);
	});
});

router.get('/check', function (req, res, next) {
	storage.getItem('count').then(function (count) {
		res.json({ count });
	});
});

router.post('/download', function (req, res, next) {	
	var filename = Date.now().toString(36) + '.png';
	fs.writeFile('./' + filename, req.body.image.replace(/^data:image\/png;base64,/, ''), 'base64', function () {
		res.render('redirect', { url: 'https://aidenahn.herokuapp.com/download/' + filename });
	});
});

router.get('/download/:filename', function (req, res, next) {
	res.download('./' + req.params.filename, req.params.filename, function () {
		
		//5분뒤 삭제
		setTimeout(fs.unlinkSync, 60000, './' + req.params.filename);
	});
});

module.exports = router;
