
class SignUp {	
	constructor(email, password, fname, lname, gender, city, country) {
		this.email = email;
		this.password = password;
		this.firstname = fname;
		this.familyname = lname;
		this.gender = gender;
		this.city = city;
		this.country = country;
	}
}

displayView = function() {
	// the code required to display a view
};
window.onload = function() {
	// code that is executed as the page is loaded.
	// You shall put your own custom code here.
	// window alert() is not allowed to be used in your implementation.
	//window.alert("Hello TDDD97!");
	if (localStorage.getItem("logintoken") != null) {
		loadProfileView();
	} else {
		loadWelcomeView();
	}
};

loadWelcomeView = function() {

	document.getElementById("pagecontent").innerHTML = document.getElementById("welcomeview").innerText;
	var loginform = document.forms["loginform"];
	var signupform = document.forms["signupform"];
	signupform.addEventListener("submit", function(event) {
		event.preventDefault();
		if(inputValidation("signupform")) {
			var signupObject = new SignUp(signupform["email"].value,
									signupform["password"].value,
									signupform["fname"].value,
									signupform["lname"].value,
									signupform["gender"].value,
									signupform["city"].value,
									signupform["country"].value);
			var message = serverstub.signUp(signupObject);
			console.log(message);
			if (!message.success) {
				signupform["email"].value = "";
				signupform["email"].setAttribute("placeholder", message.message);
			} else {
				document.getElementById("pagecontent").innerHTML = "";
				document.getElementById("pagecontent").innerText = "";
				document.getElementById("pagecontent").innerHTML = document.getElementById("profileview").innerText;
				localStorage.setItem("logintoken", message.data);
				console.log(message.data);
			}
		}
	})
		
			
	loginform.addEventListener("submit", function(event) {
		event.preventDefault();
		if (inputValidation("loginform")) {
			var message = serverstub.signIn(loginform["email"].value, loginform["password"].value);
			console.log(message);
			if(!message.success) {
				loginform["email"].value = "";
				loginform["password"].value = "";
				loginform["email"].setAttribute("placeholder", message.message);
			} else {
				document.getElementById("pagecontent").innerHTML = "";
				document.getElementById("pagecontent").innerText = "";
				document.getElementById("pagecontent").innerHTML = document.getElementById("profileview").innerText;
				localStorage.setItem("logintoken", message.data);
				console.log(message.data);
			}
		}
	})

}

loadProfileView = function() {
		console.log("cookie loaded");
		console.log(localStorage.getItem("logintoken"));
		document.getElementById("pagecontent").innerHTML = document.getElementById("profileview").innerText;
}

inputValidation = function(formID) {
	var form = document.forms[formID];	
	let allInputs = form.querySelectorAll("input");
	var valid = true;
	allInputs.forEach(function(elem) {
		if(elem.type === "text" && elem.value === "") {
			elem.setAttribute("placeholder", "Don't leave blank");
			valid = false;
		} })
	if (!validateEmail(form)) {
		valid = false;
	}
	valid = validatePassword(form, formID); 
	return valid;
}

function validateEmail(form) {
  var validRegex = /\w+@\w+\.\w+/
  var email = form["email"];
  if (!email.value.match(validRegex)) {
	email.value = "";
    email.setAttribute("placeholder", "Invalid email");
    return false;
  } 
  return true;
}

function validatePassword(form, formID) {
	if(formID == "signupform" && form["password"].value != form["password2"].value) {
		form["password"].value = "";
		form["password2"].value = "";
		form["password"].setAttribute("placeholder", "Passwords must match");
		form["password2"].setAttribute("placeholder", "Passwords must match");	
		return false;	
	}
	if(formID == "signupform" && form["password"].value.length < 8) {
		form["password"].value = "";
		form["password2"].value = "";
		form["password"].setAttribute("placeholder", "Password must be 8 characters or longer");
		return false;
	}
	if(formID == "loginform" && form["password"].value.length < 8) {
		form["password"].value = "";
		form["password"].setAttribute("placeholder", "Wrong password");
		return false;
	}
	return true;
}

function openTab(event, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	event.currentTarget.className += " active";

}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();