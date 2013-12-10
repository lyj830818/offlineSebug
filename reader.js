var express = require('express')
  , fs      = require("fs")
  , config  = require('./config').default
  , db      = require("./db")
  , app     = express()
  ;

var app = express();
//app.use(express.basicAuth('ujs', 'ChiChou'));

//static files
for(var path in config.static)
	app.use(path, express.static(__dirname + config.static[path]));

app.set("view engine","ejs");
app.get("/", function(req, res) {
	//home
	res.status(200).render("index");
});
app.get('/dir', function(req, res) {
	db.dir("0", function(result) {
	  	res.send(JSON.stringify(result));
	});
});
app.get('/dir/:alphabet', function(req, res) {
	db.dir(req.params.alphabet, function(result) {
	  	res.send(JSON.stringify(result));
	});
});
app.get('/app/:title', function(req, res) {
	db.app(req.params.title, 0, function(result) {
		result.context = "app";
		res.send(JSON.stringify(result));
  	});
});
app.get('/app/:title/:page', function(req, res) {    
  	db.app(req.params.title, req.params.page, function(result) {
		result.context = "app";
		res.send(JSON.stringify(result));
  	});
});
app.get('/search/:keyword/:page', function(req, res) {
	var keyword = req.params.keyword, page = req.params.page;
  	db.search(keyword, page, function(result) {
		result.context = "search";
		res.send(JSON.stringify(result));
  	});
});
app.get('/search/:keyword', function(req, res) {
  	db.search(req.params.keyword, 0,  function(result) {
		result.context = "search";
		res.send(JSON.stringify(result));
  	});
});
app.get('/vul/:ssvid', function(req, res) {
	db.vul(req.params.ssvid, function(result) {
		res.send(JSON.stringify(result));
	});
});
app.get('/pdf/:id', function(req, res) {
	var id = req.params.id, path;

	if(!id.match(/^\w{32}$/)) id = require("crypto").createHash('md5').update(id).digest('hex');

	path = [config.pdf, id, ".pdf"].join("");
	fs.exists(path, function(exists) {
		if(exists)
			res.sendfile(path);
		else
			res.render('404', { url: req.url });
	});
});
app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) 
    res.render('404', { url: req.url });
  else
  	res.type('json').send('false');
});
app.listen(config.server.port);