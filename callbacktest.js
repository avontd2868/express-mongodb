app.get('/', function(req, res){
  
  articleProvider.findAll(  function(error, docs){res.send(docs);}  );

});


ArticleProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};
