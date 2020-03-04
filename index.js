// Group 20
// Blandon Tang, Edison Mendoza, Heavenel Cerna, John Salazer, Ryan Doering, Teddy Kalp

// Server side code
/**
 * 
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html'); // We can serve whatever file we want to here - just using index as an example
});

io.on('connection', function(socket) {
	console.log('A user has connected with ID: ' + socket.id);
	
	socket.on('disconnect', function() {
		console.log('User'  + socket.id + 'has disconnected');
	});

});

http.listen(8080, function() {
	console.log('Listening on port *8080');
});