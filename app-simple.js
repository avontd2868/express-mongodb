var express = require('express');
/* use new mongodb article provider */
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = module.exports = express();

// Configuration

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

// new ArticleProvider using the mongo ArticleProvider
var articleProvider = new ArticleProvider('localhost', 27017);


// Routes
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

/* new new routes for going to a specific blogpost and adding comments */
app.get('/blog/:id', function(req, res){
	articleProvider.findById(req.params.id, function(error, article){
		res.render('blog_show.jade', {
			title: article.title,
			articles:article
		})
	});
});

app.post('/blog/addComment', function(req, res){
	articleProvider.addCommentToArticle(req.param('_id'), {
		person: req.param('person'),
		comment: req.param('comment'),
		created_at: new Date()
	}, function(error, docs){
		res.redirect('/blog/' + req.param('_id'))
	});
});

/* listen on port 3000 */
app.listen(3000);
console.log('listening on port 3000');