console.log("server code initiated")
var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.use(express.static('public'));

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'student',
  password        : 'default',
  database        : 'student'
});





app.get('/', function(req,res, next){
	res.render('home');
});

//handles delete requests
app.post('/delete', function(req,res) {
	var id = req.body.id;
	//console.log("ID is: " + id);
    pool.query('DELETE FROM workouts WHERE id = (?)', [id], function(err, result){ //delete the item with the matching id
        if(err) {
            next(err);
            return;
        }
        pool.query("SELECT * FROM workouts", function(err, rows, fields){ //get all items to refresh table
            if(err){
                next(err);
                return;
            }
            res.type('text/plain');
            res.send(rows);
        });
    });
});

//handles edit requests
app.post('/edit', function(req,res,next) {
    var context = {}; 
	var name = req.body.name;  //get all the info from the body
	//console.log("Name is " + name);
	var weight = req.body.weight;
	var reps = req.body.reps;
	var date = req.body.date;
	var lbs = req.body.lbs;
	var id = req.body.id;
	
	//console.log("ID is: " + id);
	
	//update the item with the id
    pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', [name, reps, weight, date, lbs, id],  function(err, result){
            if(err) {
                next(err);
                return;
            }
			pool.query("SELECT * from workouts", function(err, rows, fields){ //get all items to refresh table
				if(err){
					next(err);
					return;
				}
				res.type('text/plain');
				res.send(rows);
			});
        });
});

//This funtion handles inserting a new item into the database
app.post('/insert', function(req,res, next){
	//console.log("Insert request recieved.");
	var name = req.body.name; //get the info from the body
	//console.log("Name is " + name);
	var weight = req.body.weight;
	var reps = req.body.reps;
	var date = req.body.date;
	var lbs = req.body.lbs
	//insert the new row
    pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)", [name, reps, weight, date, lbs], function(err, result) {
        if(err) {
            next(err);
            return;
        }
		pool.query("SELECT * from workouts", function(err, rows, fields){
			if(err){
                next(err);
                return;
            }
            res.type('text/plain');
            res.send(rows);
        });
    });
});

//resets the table
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255),"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
	console.log("table reset");
  });
});


//for errors
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