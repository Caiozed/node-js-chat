//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();

app.use(express.static(__dirname, 'client'));

app.get('/', function(req, res){
  res.send("hello");
});

app.listen(8080, function(){
  console.log("Listening on port 8080!");
});


