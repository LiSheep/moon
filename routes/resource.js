var path = require('path');
var resource_db = require("../db/resource");
var resource = {};

resource.index = function (req, res) {
	var c = {
		maxFileSize: config.upload.max_size,
		acceptFileTypes: config.upload.allow_type
	}
	res.render('resource/index', c);
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
	console.log("upload file:", data.uri);
	resource_db.add(data, function (err) {
		if(err){
			res.writeHead(404);
			res.end(err);
			return;
		}
		res.end();
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