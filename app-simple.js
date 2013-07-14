var express = require('express');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

var app = module.exports = express();

app.configure(function(){
	app.set('views',__dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({src: __dirname + '/public/'}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

var articleProvider = new ArticleProvider();

app.get('/',function(req, res){
	articleProvider.findAll(function(err, docs){
		res.render('index.jade', {
			title:'My Blog',
			articles:docs
		})
	});
});

/* new routes for adding a new blog post */
app.get('/blog/new', function(req, res){
	res.render('blog_new.jade', {
		title: 'New Post'

	})
});

app.post('/blog/new', function(req, res){
	articleProvider.save({
		title: req.param('title'),
		body: req.param('body')

	}, function(err, docs){
		res.redirect('/')
	});
});

/* listen on port 3000 */
app.listen(3000);
console.log('listening on port 3000');