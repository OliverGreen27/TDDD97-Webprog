
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
	if (localStorage.getItem("logintoken") != null) {
		loadProfileView();
	} else {
		loadWelcomeView();
	}
};

loadWelcomeView = function() {
	document.getElementById("pagecontent").innerHTML = "";
	document.getElementById("pagecontent").innerText = "";
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
				message = serverstub.signIn(signupform["email"].value, signupform["password"].value);
				if(!message.success) {
					signupform["email"].setAttribute("placeholder", message.message);
				} else {
					localStorage.setItem("logintoken", message.data);
					loadProfileView();
				}
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
				localStorage.setItem("logintoken", message.data);
				loadProfileView();
			}
		}
	})

}

loadProfileView = function() {
	console.log("cookie loaded");
	console.log(localStorage.getItem("logintoken"));
	document.getElementById("pagecontent").innerHTML = "";
	document.getElementById("pagecontent").innerText = "";
	document.getElementById("pagecontent").innerHTML = document.getElementById("profileview").innerText;

	document.getElementById("defaultOpen").click();


	var changepassform = document.forms["changepassform"];
	changepassform.addEventListener("submit", function(event) {
		event.preventDefault();
		if (inputValidation("changepassform")) {
			var message = serverstub.changePassword(localStorage.getItem("logintoken"), changepassform["oldpassword"].value, changepassform["password"].value);
			changepassform["oldpassword"].value = "";
			changepassform["password"].value = "";
			changepassform["password2"].value = "";
			var messageBox = document.getElementById("message2");
			if(!message.success) {
				messageBox.style.color = "red";
			} else {
				messageBox.style.color = "green";
			}
			messageBox.innerText = message.message;
		}
	})

	document.getElementById("logoutbutton").addEventListener("click", function(event) {
		var message = serverstub.signOut(localStorage.getItem("logintoken"));
		if(!message.success) {
			document.getElementById("message1").innerText = message.message;
		} else {
			localStorage.removeItem("logintoken");
		}
		loadWelcomeView();
	})
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
	if (form["email"] != null && !validateEmail(form)) {
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
	if((formID == "signupform" || formID == "changepassform") && form["password"].value != form["password2"].value) {
		form["password"].value = "";
		form["password2"].value = "";
		form["password"].setAttribute("placeholder", "Passwords must match");
		form["password2"].setAttribute("placeholder", "Passwords must match");	
		return false;	
	}
	if((formID == "signupform" || formID == "changepassform") && form["password"].value.length < 8) {
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
