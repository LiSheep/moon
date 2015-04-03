var upload = {};

upload.index = function (req, res) {
	var c = {
		maxFileSize: config.upload.max_size,
		acceptFileTypes: config.upload.allow_type
	}
	res.render('upload/index', c);
}

upload.up = function (req, res) {
	console.log(req.body, req.files);
	// TODO: 返回json
	// { 
	//   files:
	//     [
	//       {
	//         url: "http://url.to/file/or/page",
	//         thumbnail_url: "http://url.to/thumnail.jpg ",
	//         name: "thumb2.jpg",
	//         type: "image/jpeg",
	//         size: 46353,
	//         delete_url: "http://url.to/delete /file/",
	//         delete_type: "DELETE"
	//       }
	//     ]
	// }
	res.end();
}

module.exports = upload;