//Joseph Fuerst     5/13/12016
//GetPostCheck.js
//Description: Handles and returns GET and POST requests.

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/get-post-check',function(req,res){
  var qParams = [];
  var type = 'GET'
  for (var p in req.query){
    qParams.push({'name':p,'value':req.query[p]})
  }
  var context = {};
  context.dataList = qParams;
  context.type = type;
  res.render('get-post-check', context);
});



app.post('/get-post-check', function(req, res){
	var gParams = [];
	var pParams = [];
	var bRec = 'Recieved in body:'
	var uRec = 'recieved in url:'
	var type = 'POST'
	for (var p in req.body){
		pParams.push({'name':p,'value':req.body[p]})
	}
	for (var p in req.query){
    gParams.push({'name':p,'value':req.query[p]})
  }
	var context = {};
	context.bRec = bRec;
	context.uRec = uRec;
	context.dataList = pParams;
	context.dataList2 = gParams;
	context.type = type;
	res.render('get-post-check', context);	
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://52.36.74.92:' + app.get('port') + '; press Ctrl-C to terminate.');
});