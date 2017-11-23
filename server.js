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
app.post('/new/user', function(req, res){
    var query = "INSERT INTO users(username, password) VALUES (?, ?)";
    var username = req.body.username;
    var password = req.body.password;
    con.query(query,[username, password], function(err, results, fields){
        if(err){
            res.json({status:400, msg:"<div class='alert alert-danger'>User already exists</div>"}); 
        }
    });
});

app.post('/new/login', function(req, res){
    var query = "SELECT * FROM users WHERE username = ? AND password = ?";
    var username = req.body.username;
    var password = req.body.password;
    con.query(query, [username,password], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }else{
            res.send(JSON.stringify({results: results, redirect: "#chats"}));
        }
    });
});

app.post('/new/chat', function(req, res){
    var query = "INSERT INTO chats (user_id, name, description) VALUES (?, ?, ?)";
    var user_id = req.body.user_id;
    var name = req.body.name;
    var desc = req.body.description;
    con.query(query, [user_id, name, desc], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>Chat already exists!</div>"});
        }else{
            res.json({status: 200, msg: "<div class='alert alert-success'>Chat created!</div>"});
        }
    });
});

app.post('/chats', function(req, res){
    var query = "SELECT * FROM chats";
    con.query(query, function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.post('/chat/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM messages WHERE chat_id = ?";
    var query2 = "SELECT * FROM members WHERE chat_id = ?";
    con.query(query, [id], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.post('/new/member', function(req, res){
    var query = "INSERT INTO members (user_id, chat_id) VALUES (?, ?)";
    var user_id = req.body.user_id;
    var chat_id = req.body.chat_id;
    con.query(query, [user_id, chat_id], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>You'r Already a member!</div>"});
        }
    });
});

app.post('/new/message', function(req, res){
    var query = "INSERT INTO messages (user_id, chat_id, content) VALUES (?, ?, ?)";
    var user_id = req.body.user_id;
    var chat_id = req.body.chat_id;
    var content = req.body.content;
    con.query(query, [user_id, chat_id, content], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }
    });
});

app.listen(process.env.PORT, function(){
    console.log("Listening on port 8080!");
});


