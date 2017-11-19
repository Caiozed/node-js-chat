//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require('express');
var mysql = require('mysql');
var path = require('path');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();

app.use(express.static('client'));

app.post('/', function(req, res){
    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});

app.listen(process.env.PORT, function(){
  console.log("Listening on port 8080!");
});


