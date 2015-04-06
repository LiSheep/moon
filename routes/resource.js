var path = require('path');
var resource_db = require("../db/resource");
var resource = {};

resource.upload = function (req, res) {
	var c = {
		maxFileSize: config.upload.max_size,
		acceptFileTypes: config.upload.allow_type
	}
	res.render('resource/upload', c);
}

resource.list = function (req, res) {
	resource_db.list(function (err, results) {
		if(err){
			res.writeHead(404);
			res.end(err);
			return;
		}
		res.render('resource/list', {resource:results});
	});
}

resource.delete = function (req, res) {
	resource_db.delete(req.params.uri, function (err) {
		if(err){
			res.writeHead(404);
			res.end(err);
			return;
		}
		res.redirect("resource/list");
	})
}

resource.update_view = function (req, res) {
	resource_db.get(req.params.uri, function (err, data) {
		if(err){
			res.writeHead(404);
			res.end(err);
			return;
		}
		res.render("resource/update", data);
	});
}

resource.update = function (req, res) {
	var olduri = req.params.uri;
	var uri = req.body.uri;
	resource_db.update(olduri, uri, function (err) {
		if(err){
			res.writeHead(404);
			return res.end(err);
		}
		res.redirect("/resource/");
	});
}

resource.up = function (req, res) {

// 		{ files:
 //   [ { fieldName: 'files[]',
 //	   originalFilename: 'TED001.mp4',
 //	   path: 'E:\\WorkSpace-Node\\moon\\2296-173b9xy.mp4',
 //	   headers: [Object],
 //	   ws: [Object],
 //	   size: 272326843,
 //	   name: 'TED001.mp4',
 //	   type: 'video/mp4' } ] }
 	var files = req.files.files;
 	var file = files[0];
	var filepath = path.basename(file.path);
	var data = {
		uri: file.originalFilename,
		path: filepath
	};
	resource_db.add(data, function (err) {
		if(err){
			res.writeHead(404);
			res.end(err);
			return;
		}
		var result = {
			url: "/request/" + data.uri,
			thumbnail_url: "/request/" + data.uri,
			name: data.uri,
			type: file.type,
			size: file.size
		}

		res.end(JSON.stringify({files:[result]}));
	});
	
	// TODO: 返回json
	// { 
	//   files:
	//	 [
	//	   {
	//		 url: "http://url.to/file/or/page",
	//		 thumbnail_url: "http://url.to/thumnail.jpg ",
	//		 name: "thumb2.jpg",
	//		 type: "image/jpeg",
	//		 size: 46353,
	//		 delete_url: "http://url.to/delete /file/",
	//		 delete_type: "DELETE"
	//	   }
	//	 ]
	// }
	
}

module.exports = resource;