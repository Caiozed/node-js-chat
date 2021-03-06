//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var con;
var db_config = {};
if(!process.env.ENVIROMENT){
    db_config = {
      host: process.env.IP,
      user: "caiozed",
      password: "",
      database: "c9",
      multipleStatements: true
    }; 
}else{
    db_config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    }; 
}


function handleDisconnect() {
  con = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//


app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.post('/new/user', function(req, res){
    var query = "INSERT INTO users(username, password) VALUES (?, ?)";
    var username = req.body.username;
    var password = req.body.password;
    con.query(query,[username, password], function(err, results, fields){
        if(err){
            res.send(JSON.stringify({status:400, msg:"<div class='alert alert-danger'>User already exists</div>"})); 
        }else{
            res.send(JSON.stringify({status:200}));
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
            res.send(JSON.stringify({results: results}));
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
            res.end();
        }else{
           res.send(JSON.stringify({status: 200}));
        }
    });
});

app.post('/chats', function(req, res){
    var query = "SELECT * FROM chats ORDER BY name";
    con.query(query, function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.get('/chat/:id', function(req, res){
    var id = req.params.id;
    var query = "SELECT * FROM chats WHERE id = ?";
    con.query(query, [id], function(err, results, fields){
        if(err){
            res.json(JSON.stringify({status: 400, msg: "<div class='alert alert-danger'>Something is wrong</div>"})); 
            res.end();
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.post('/edit/chat/:id', function(req, res){
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var query = "UPDATE chats SET name = ?, description = ? WHERE id = ?";
    con.query(query, [name, description, id], function(err, results, fields){
        if(err){
            res.json(JSON.stringify({status: 400, msg: "<div class='alert alert-danger'>Something is wrong</div>"})); 
            res.end();
        }else{
            res.send(JSON.stringify({status: 200})); 
        }
    });
});

app.post('/delete/chat/:id', function(req, res){
    var id = req.params.id;
    var query = "DELETE messages FROM messages WHERE chat_id = ?";
    var query2 = "DELETE members FROM members WHERE chat_id = ?";
    var query3 = "DELETE chats FROM chats WHERE id = ?";
    con.query(query, [id], function(err, results, fields){
        if(err){
            res.json(JSON.stringify({status: 400, msg: "<div class='alert alert-danger'>Something is wrong</div>"})); 
            res.end();
        }
    });
    
    con.query(query2, [id], function(err, results, fields){
        if(err){
            res.json(JSON.stringify({status: 400, msg: "<div class='alert alert-danger'>Something is wrong</div>"})); 
            res.end();
        }
    });
    
    con.query(query3, [id], function(err, results, fields){
        if(err){
            res.json(JSON.stringify({status: 400, msg: "<div class='alert alert-danger'>Something is wrong</div>"})); 
            res.end();
        }else{
            res.send(JSON.stringify({status: 200})); 
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
            res.end();
        }else{
            res.send(JSON.stringify({status: 200})); 
        }
    });
});

app.post('/members', function(req, res){
    var query = "SELECT * FROM users INNER JOIN members ON members.user_id = users.id WHERE members.chat_id = ?";
    var chat_id = req.body.chat_id;
    con.query(query, [chat_id], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>You'r Already a member!</div>"});
            res.end();
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.post('/delete/member', function(req, res){
    var query = "DELETE FROM members WHERE chat_id = ? AND user_id = ?";
    var user_id = req.body.user_id;
    var chat_id = req.body.chat_id;
    con.query(query, [chat_id, user_id], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>You'r Already a member!</div>"});
            res.end();
        }else{
            res.send({status: 200});
        }
    });
});


app.post('/new/message', function(req, res){
    var query = "INSERT INTO messages (user_id, chat_id, content, sent_date) VALUES (?, ?, ?, ?)";
    var user_id = req.body.user_id;
    var chat_id = req.body.chat_id;
    var content = req.body.msg;
    var sent_date = req.body.date;
    con.query(query, [user_id, chat_id, content, sent_date], function(err, results, fields){
        if(err){
            res.send("<div class='alert alert-danger'>Something is wrong</div>"); 
        }
    });
});

app.post('/messages', function(req, res){
    var query = "SELECT * FROM messages INNER JOIN users ON messages.user_id = users.id WHERE messages.chat_id = ? ORDER BY sent_date ASC";
    var chat_id = req.body.chat_id;
    con.query(query, [chat_id], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>You'r Already a member!</div>"});
            res.end();
        }else{
            res.send(JSON.stringify(results));
        }
    });
});

app.post('/messages_count', function(req, res){
    var query = "SELECT COUNT(*) AS messages FROM messages WHERE messages.chat_id = ?";
    var chat_id = req.body.chat_id;
    con.query(query, [chat_id], function(err, results, fields){
        if(err){
            res.json({status: 400, msg: "<div class='alert alert-danger'>You'r Already a member!</div>"});
            res.end();
        }else{
            res.send(JSON.stringify(results));
        }
    });
});


app.listen(process.env.PORT, function(){
    console.log("Listening on port 8080!");
});


