
displayView = function() {
	// the code required to display a view
	if (localStorage.getItem("logintoken") != null) {
		loadProfileView();
	} else {
		loadWelcomeView();
	}
};
window.onload = function() {
	displayView();
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
			var signupObject = {}
			signupObject["email"] = signupform["email"].value;
			signupObject["password"] = signupform["password"].value;
			signupObject["firstname"] = signupform["fname"].value;
			signupObject["familyname"] = signupform["lname"].value;
			signupObject["gender"] = signupform["gender"].value;
			signupObject["city"] = signupform["city"].value;
			signupObject["country"] = signupform["country"].value;

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
					displayView();
				}
			}
		}
	})
		
			
	loginform.addEventListener("submit", function(event) {
		event.preventDefault();
        var message = serverstub.signIn(loginform["email"].value, loginform["password"].value);
        console.log(message);
        if(!message.success) {
            loginform["email"].value = "";
            loginform["password"].value = "";
            loginform["email"].setAttribute("placeholder", message.message);
        } else {
            localStorage.setItem("logintoken", message.data);
            displayView();
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
	reloadBoard(document.getElementById("home-message-board"));

	// Account page
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
		displayView();
	})

    var userData = serverstub.getUserDataByToken(localStorage.getItem('logintoken')).data

    // Change the information displayed on the homepage to the user credentials 
    document.getElementById('home-username').innerText = userData.firstname + ' ' + userData.familyname;
    document.getElementById('home-gender').innerText = userData.gender;
    document.getElementById('home-location').innerText = userData.city + ', ' + userData.country;
    document.getElementById('home-email').innerText = userData.email;

	var postmessageform = document.forms["board-text-form"];
	postmessageform.addEventListener("submit", function(event) {
		event.preventDefault();
		postmessageform["comment"].value
		var message = serverstub.postMessage(localStorage.getItem("logintoken"), postmessageform["comment"].value);
		var messageBox = document.getElementById("message3");
		if(!message.success) {
			messageBox.innerText = "There was an error with sending your message.";
			messageBox.style.color = "red";
		} else {
			messageBox.innerText = message.message;
			messageBox.style.color = "green";
			reloadBoard(document.getElementById("home-message-board"));
		}
	})

	document.getElementById("reloadbutton").addEventListener("click", function(event) {
		reloadBoard(document.getElementById("home-message-board"));
	})

	// Browse page
	var searchform = document.forms["browse-search"];
	searchform.addEventListener("submit", function(event) {
		event.preventDefault();
		loadBrowseProfile();
	})
	var searchinput = searchform["search-value"];
	console.log(searchinput);
	searchinput.addEventListener("input", function(event) {
		document.getElementById("message5").innerText = "";
		console.log("JDIFJAIOSDJPIJ");
	})


}

loadBrowseProfile = function() {
	var searchEmail = document.forms["browse-search"]["search-value"].value;
    var message = serverstub.getUserDataByEmail(localStorage.getItem("logintoken"), searchEmail)
	if(!message.success) {
		document.getElementById("message5").innerText = message.message;
		document.getElementById("message5").style.color = "red";	
		return;
	}
	document.getElementById("message5").innerText = "";
	
	document.getElementById("browse-window").style.display = "block";

	var userData = message.data;
    // Change the information displayed on the browsepage to the user credentials 
    document.getElementById('browse-username').innerText = userData.firstname + ' ' + userData.familyname;
    document.getElementById('browse-gender').innerText = userData.gender;
    document.getElementById('browse-location').innerText = userData.city + ', ' + userData.country;
    document.getElementById('browse-email').innerText = userData.email;
	var postmessageform = document.forms["browse-board-text-form"];
	postmessageform.addEventListener("submit", function(event) {
		event.preventDefault();
		postmessageform["comment"].value
		var message = serverstub.postMessage(localStorage.getItem("logintoken"), postmessageform["comment"].value, searchEmail);
		var messageBox = document.getElementById("message4");
		if(!message.success) {
			messageBox.innerText = "There was an error with sending your message.";
			messageBox.style.color = "red";
		} else {
			messageBox.innerText = message.message;
			messageBox.style.color = "green";
			reloadBoard(document.getElementById("browse-message-board"), searchEmail);
		}
	})

	reloadBoard(document.getElementById("browse-message-board"), searchEmail);
	document.getElementById("browse-reloadbutton").addEventListener("click", function(event) {
		reloadBoard(document.getElementById("browse-message-board"), searchEmail);
	})

}

reloadBoard = function(board, email=null) {

	var boardBox = board;
	boardBox.innerHTML = "";
	boardBox.innerText = "";
	var messageBoardData;
	if(email != null) {
		messageBoardData = serverstub.getUserMessagesByEmail(localStorage.getItem("logintoken"), email);
	} else {
		messageBoardData = serverstub.getUserMessagesByToken(localStorage.getItem("logintoken"));
	}
	console.log(messageBoardData.data);
	console.log(boardBox);
	for(var i = 0; i < messageBoardData.data.length; i++) {
		var messageHTML = document.createElement('div');
		var title = document.createElement('h2')
		title.innerText = messageBoardData.data[i]["writer"];
		messageHTML.appendChild(title);

		var contentHTML = document.createElement('textarea');
		contentHTML.setAttribute("readonly", "");
		contentHTML.setAttribute("rows", "5");
		contentHTML.setAttribute("max-rows", "5");
		contentHTML.setAttribute("cols", "50");
		contentHTML.innerText = messageBoardData.data[i]["content"];
		messageHTML.appendChild(contentHTML);
		messageHTML.appendChild(document.createElement('br'));
			
		boardBox.appendChild(messageHTML);
	}
}

inputValidation = function(formID) {
	var form = document.forms[formID];	
    var emptyField = false;
	form.querySelectorAll("input").forEach(function(elem) {
		if(elem.type === "text" && elem.value === "") {
			elem.setAttribute("placeholder", "Don't leave blank");
            emptyField = true;
		}
    })
	return !emptyField && validateEmail(form) && validatePassword(form)
}

function validateEmail(form) {
    var valid = form["email"].value.match(/\w+@\w+\.\w+/)
	if (!valid) {
		email.value = "";
		email.setAttribute("placeholder", "Invalid email");
	} 
	return valid;
}

function validatePassword(form) {
    if (form['password'].value == form['password2'].value && form['password'].value.length >= 8) {
        return true
    }
    if (form['password'].value != form['password2'].value) {
		form["password"].setAttribute("placeholder", "Passwords must match");
    }
    else if (form['password'].value.length < 8) {
		form["password"].setAttribute("placeholder", "Password must be 8 characters or longer");
    }
    form["password"].value = "";
    form["password2"].value = "";
    return false;	
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

	if(tabName === "Home") {
		reloadBoard(document.getElementById("home-message-board"));
	} 
}
