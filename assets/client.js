/* variables to hold information about the current user */
var employer;
var candidate;

var candidateProfile = {

};

var employeeProfile = {

};
/*connect to server*/
const socket = io();

socket.on('connect', function() {
    console.log("connected");
});
/* used for the logic screen*/
$("#login").click(function(){
	var user = $("#username").val();
	var pass = $("#pwd").val();
	socket.emit("userAuth", user,pass);
	return false;
});

/* if user is not found during login phases*/
socket.on("userNotfound",function(){
	$("#error").text("Invalid Credentials");
});

/* used on authentication need set variables from user info*/
socket.on("authentication",function(destination, user_info){
	window.location.href = destination;
});

/*not yet finished, but when a user enters a username that has already
been taken, we need to show an error*/
socket.on("userFound",function(){
	window.location.href = "/signup";
	$("#error").text("User exists");
});

socket.on("addedUser", function(){
	window.location.href = "/login";
});

/*for the sign up screen*/

/*identifying whether we have employee or candidate*/
$("#employeecheck").click(function(){
	$('#employee').show();
	$('.button').show();
	$('#candidate').hide();

	employer = true;
	candidate = false;
});


$("#candidatecheck").click(function(){
	$('#candidate').show();
	$('.button').show();
	$('#employee').hide();

	employer = false;
	candidate = true;
});

$("#highschool").click(function(){
	$('#program').hide();
});

$("#bachelor").click(function(){
	$('#program').show();
});

$("#masters").click(function(){
	$('#program').show();
});

$("#phd").click(function(){
	$('#program').show();
});


$("#submit").click(function(){
	if (employer){
		user_info = fillEmployeeInfo();
	}
	else if (candidate){
		user_info = fillCandidateInfo()
	}

	if (user_info !== false){
		socket.emit("newUser", user_info);
	}
	return false;
});

/* checking for empty strings */
function checkForEmpty(value){
	return (!value || value == undefined || value == "" || value.length == 0);
};

/* filling new employee info */
function fillEmployeeInfo(){
	var user_info = {
		userId: null,
		userPass: null,
		userEmail: null,
		userCompany: null,
		userType: null,
		userPosition: null,
		userDescription: null,
		userExperience: null,
		userProfile: null
	};

	temp = $("#username").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userId = temp;
	}
	else{
		 $("#error").text('Invalid Username');
		 return false;
	}

	temp = $("#password").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userPass = temp;
	}
	else{
		 $("#error").text('Invalid Password');
		 return false;
	}

	temp = $("#email").val();
	temp = temp.trimStart();
	if((!checkForEmpty(temp)) && (temp.includes('@'))){
		user_info.userEmail = temp;
	}
	else{
		 $("#error").text('Invalid Email');
		 return false;
	}

	temp = $("#companyName").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userCompany = temp;
	}
	else{
		 $("#error").text('Invalid Company name');
		 return false;
	}

	user_info.userType = "Employer"

	temp = $("#position").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userPosition = temp;
	}
	else{
		 $("#error").text('Invalid Position');
		 return false;
	}

	temp = $("#description").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userDescription= temp;
	}
	else{
		 $("#error").text('Invalid Position Description');
		 return false;
	}

	temp = $("#experience").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		temp = temp.split(",")
		user_info.userExperience= temp;
	}
	else{
		 $("#error").text('Invalid Experience Description');
		 return false;
	}

	temp = $("#profile")
	if (temp.get(0).files.length === 0) {
    	$("#error").text('No profile picture selected');
    	return false;
	}
	else{
		user_info.userProfile = temp.val();
	}

	return user_info;
};

function fillCandidateInfo(){
	var user_info = {
		userId: null,
		userPass: null,
		userFullName: null,
		userEmail: null,
		userType: null,
		userEducation: null,
		userProgram: null,
		userDescription: null,
		userExperience: null,
		userProfile: null
	};

	temp = $("#userName2").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userId = temp;
	}
	else{
		 $("#error").text('Invalid Username');
		 return false;
	}

	temp = $("#fullname").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userFullName = temp;
	}
	else{
		 $("#error").text('Invalid Password');
		 return false;
	}

	temp = $("#password2").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userPass = temp;
	}
	else{
		 $("#error").text('Invalid Password');
		 return false;
	}


	temp = $("#email2").val();
	temp = temp.trimStart();
	if((!checkForEmpty(temp)) && (temp.includes('@'))){
		user_info.userEmail = temp;
	}
	else{
		 $("#error").text('Invalid Email');
		 return false;
	}
	/*need to figure out how to education */

	if($('#highschool').is(':checked')){
		user_info.userEducation = "High School";
	}
	else{
		user_info = fillPostEducation(user_info);
		if (user_info === false){
			return false;
		}
	}

	temp = $("#description2").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userDescription = temp;
	}
	else{
		 $("#error").text('Invalid Description');
		 return false;
	}

	temp = $("#experience2").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		temp = temp.split(",")
		user_info.userExperience= temp;
	}

	temp = $("#profile2")
	if (temp.get(0).files.length === 0) {
    	$("#error").text('No profile picture selected');
    	return false;
	}
	else{
		user_info.userProfile = temp.val();
	}

	user_info.userType = "Candidate";
	return user_info;
};

/* filling post education */
function fillPostEducation(user_info){
	if($('#bachelor').is(':checked')){
		user_info.userEducation = "Bachelor's Degree";
	}
	else if($('#masters').is(':checked')){
		console.log("masters");
		user_info.userEducation = "Master's Degree";
	}
	else if($('#phd').is(':checked')){
		user_info.userEducation = "PhD Degree";
	}
	temp = $("#programDescription").val();
	temp = temp.trimStart();
	if(!checkForEmpty(temp)){
		user_info.userProgram = temp;
		return user_info
	}
	else{
		 $("#error").text('Invalid Description');
		 return false;
	}
}

