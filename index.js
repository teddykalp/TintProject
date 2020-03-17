// Group 20
// Blandon Tang, Edison Mendoza, Heavenel Cerna, John Salazer, Ryan Doering, Teddy Kalp

// Server side code
/**
 * 
 */

var express = require('express');
// var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PouchDB = require('pouchdb');


app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html');
});

// Example of serving multiple files - on localhost:8080/testing url we instead serve the index.html instead of login.html

// navigation to /testing can be done by setting an href with just /testing as the address <a href = "/testing">
app.get('/testing', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req,res){
    res.sendFile(__dirname + '/login.html');
});

// On login success serve a home page
app.get('/home', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(req,res){
  res.sendFile(__dirname + '/signup.html');
});



passport.use(new GoogleStrategy({
    clientID: '623488379336-4qr8e0qrcpu8ibfafl1a5g8mpv8mnqmt.apps.googleusercontent.com',
    clientSecret: 'x_TwAOsTGjH2f4PTZpwZ6vJN',
    callbackURL: "/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('callback time baby');
	  console.log(profile);
	return done(); // invoke done when the callback with passed in data is finished

	// At this point we now have the logged in user data so now we would either write stuff to a database/in memory
	// and deal with the data however we want to
  }
));

/**
 * @param google the strategy we use - could be fb, twitter, github etc (although they all differ a little bit in setup)
 * @param scope tells passport what we want to retrieve from user profile ie: ['profile']
 * Grabbing the guid for the user (placed into querystring)
 */
app.get('/auth/google',
 passport.authenticate('google',{
	 scope: ['profile']
 })
);

/**
 * @param passport.authenticate passport reads the incoming code and is exchanged with profile information (hence second call), then following function fires
 * @param failureRedirect redirects user to specified route on authentication failure
 * callback route for google to redirect to
 */
app.get('/auth/google/redirect',passport.authenticate('google', { failureRedirect: '/testing' }), 
 (req, res) => {
	res.send('wow you got authenticated');
 }
);
// app.get('/auth/google/redirect', (req, res) => {
// 	res.redirect('/testing');
// });




io.on('connection', function(socket) {
  socket.on('userAuth', function(user,pass){
    /** creates new data or loads an existing database**/
      db = new PouchDB("users");
    /**gets data from specific id**/
    /* returns information regarding the id, in this case, it would return data contained the _id of user*/
      db.get(user).then(function(doc) {
      console.log("found");
      console.log(doc.password);
      if (pass === doc.password){
          console.log('right pass');
          socket.emit("authentication","/home",doc);
      }
      }).then(function(response) {
            
      }).catch(function (err) {
          socket.emit("userNotfound");
      });
    });

  /* used for the sign up process*/
  socket.on("newUser",function(user_info){
      var valid = addToDatabase(user_info)
      if (valid){
        socket.emit("addedUser");
      }
      else{
        socket.emit("userExists");
      }
  });
	
	socket.on('disconnect', function() {
		console.log('User'  + socket.id + 'has disconnected');
	});

});


http.listen(8080, function() {
	console.log('Listening on port *8080');
});

function addToDatabase(user_info){
  db = new PouchDB("users");
  db.get(user_info.userId).then(function(doc) {
      /* if a user already exists, we don't add the info to the database*/
      console.log('user found');
      return false;
  }).then(function(response) {
            
  }).catch(function (err) {
    //** how to add a new entry in the database **/
    /* if a user creates a new account, we add to the database */
      if (user_info.userType === "Employer"){
        db.put({
          _id: user_info.userId,
          password: user_info.userPass,
          email: user_info.userEmail,
          companyName : user_info.userCompany,
          Type : "Employee",
          position: user_info.userPosition,
          description: user_info.userDescription,
          experience: user_info.userExperience,
          profile: user_info.userProfile
        }).then(function (response) {
        // handle response
        }).catch(function (err) {
            console.log(err);
        });
      }
      if (user_info.userType === "Candidate"){
        db.put({
          _id: user_info.userId,
          password: user_info.userPass,
          email: user_info.userEmail,
          candidateFullName : user_info.userCompany,
          userType : "Candidate",
          education: user_info.userEducation, 
          program: user_info.userProgram,
          description: user_info.userDescription,
          experience: user_info.userExperience,
          profile: user_info.userProfile
        }).then(function (response) {
        // handle response
        }).catch(function (err) {
            console.log(err);
        });
      }
  });

  return true;
}