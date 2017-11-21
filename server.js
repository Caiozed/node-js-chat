//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var con = mysql.createConnection({
  host: process.env.IP,
  user: "caiozed",
  password: "",
  database: "c9"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//


app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "shhh", 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true}
}));

app.use(bodyParser.json());

var sess;
app.post('/signup', function(req, res){
    var query = "INSERT INTO users(username, password) VALUES (?, ?)";
    var username = req.body.username;
    var password = req.body.password;
    con.query(query,[username, password], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>User already exists</div>"); 
        }
    });
});

app.post('/login', function(req, res){
    var query = "SELECT * FROM users WHERE username = ? AND password = ?";
    var username = req.body.username;
    var password = req.body.password;
    con.query(query, [username,password], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }else{
            res.send(JSON.stringify({results: results, redirect: "#"}));
        }
    });
});

app.listen(process.env.PORT, function(){
    console.log("Listening on port 8080!");
});


