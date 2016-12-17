var fs = require('fs');
var express = require('express');
var router = express.Router();
var request = require('superagent');

router.get('/', function (req, res, next) {
	res.render('index', { title: '우리의 촛불은 꺼지지 않습니다.' });
});

router.get('/count', function (req, res, next) {
	request.put('https://api.mlab.com/api/1/databases/default/collections/yourcandle/584bfc97734d1d55b6dc8e92')
	.set('Accept', 'application/json')	
	.query({ apiKey: process.env.APIKEY })
	.send({ $inc: { count: 1 } })
	.end(function (err, mongoRes) {
		res.json({ count: mongoRes.body.count });
	});
});

router.get('/check', function (req, res, next) {
	request.get('https://api.mlab.com/api/1/databases/default/collections/yourcandle/584bfc97734d1d55b6dc8e92')
	.set('Accept', 'application/json')
	.query({ apiKey: process.env.APIKEY })
	.end(function (err, mongoRes) {
		res.json({ count: mongoRes.body.count });
	});
});

router.post('/download', function (req, res, next) {	
	var filename = Date.now().toString(36) + '.jpg';
	fs.writeFile('./' + filename, req.body.image.replace(/^data:image\/jpeg;base64,/, ''), 'base64', function () {
		res.render('redirect', { url: 'https://aidenahn.herokuapp.com/download/' + filename });
	});
});

router.get('/download/:filename', function (req, res, next) {
	var filename = req.params.filename;
	res.download('./' + filename, filename, function () {
		//1분뒤 삭제
		setTimeout(fs.unlinkSync, 60000, './' + filename);
	});
});

module.exports = router;
