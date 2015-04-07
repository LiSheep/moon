var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

var auth = require("../auth");
var resource = require('./resource');
var server = require('./server');
var request = require('./request');

router.get('/', function(req, res) {
	res.render('main/index');
});


// router.get('/login', function(req, res) {
// 	if(req.isAuth) {
// 		res.redirect('/');
// 	}else{
// 		res.render("login");
// 	}
// });

// router.post('/login', function(req, res) {
// 	req.login(req.body.username, req.body.password, function (err) {
// 		if (err){
// 			res.redirect('/login');
// 		}else {
// 			res.redirect('/')
// 		}
// 	})
// });

// router.get('/logout', function(req, res) {
// 	req.logout(function (err) {
// 		if(err){
// 			// Impossible
// 			res.writeHead(404);
// 			res.end();
// 		}else {
// 			res.redirect('/login');
// 		}
// 	});
// });

var multipartMiddleware = multipart({ uploadDir: config.upload.save_path });

router.get("/resource/", resource.list);
router.get("/resource/list", resource.list);
router.get("/resource/list/:page", resource.list);
router.post("/resource/list/", resource.list);
router.post("/resource/list/:page", resource.list);
router.get("/resource/upload", resource.upload);
router.get("/resource/update/:uri", resource.update_view);
router.post("/resource/up", multipartMiddleware, resource.up);
router.delete("/resource/:uri", resource.delete);
router.post("/resource/update/:uri", resource.update);

router.get("/server", server.list);
router.get("/server/list", server.list);
router.get("/server/add", server.addView);
router.post("/server", server.add);
router.delete("/server/:host", server.delete);
router.post("/server/up/:host", server.up);
router.post("/server/down/:host", server.down);

router.get("/request/:uri", request.get);
// router.all("/regex/add", auth.Auth, regex.add);

module.exports = router;