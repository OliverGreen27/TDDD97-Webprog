
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
			var signupRequest = new XMLHttpRequest();
			var loginRequest = new XMLHttpRequest();

            var email = signupform["email"].value;
            var password = signupform["password"].value;
            var firstname = signupform["fname"].value;
            var familyname = signupform["lname"].value;
            var gender = signupform["gender"].value;
            var country = signupform["country"].value;
            var city = signupform["city"].value;

			signupRequest.onreadystatechange = function() {
				if(this.readyState == 4) {
                    switch (this.status){
                        case 201:
                            loginRequest.open("POST", "/signin", true);
                            loginRequest.setRequestHeader("Content-Type", "application/json");
                            loginRequest.send(JSON.stringify({
                                "email"     : email,
                                "password"  : password,
                            }));
                            break;
                        case 400:
                            signupform["email"].value = "";
                            signupform["password"].value = "";
                            signupform["password2"].value = "";
                            signupform["email"].setAttribute("placeholder", "Invalid input.");
                            break;
                        case 409:
                            signupform["email"].value = "";
                            signupform["password"].value = "";
                            signupform["password2"].value = "";
                            signupform["email"].setAttribute("placeholder", "User already exist.");

                    }
				}
			}

			loginRequest.onreadystatechange = function() {
				if(this.readyState == 4 && this.status == 200) {
                    localStorage.setItem("logintoken", JSON.parse(loginRequest.responseText)['token']);
                    displayView();
				}
			}

			signupRequest.open("POST", "/signup", true);
			signupRequest.setRequestHeader("Content-Type", "application/json");
			signupRequest.send(JSON.stringify({
                "email"     : email,
                "password"  : password,
                "firstname" : firstname,
                "familyname": familyname,
                "gender"    : gender,
                "city"      : city,
                "country"   : country,
            }));
		}
	})
		
	loginform.addEventListener("submit", function(event) {
		event.preventDefault();
		var loginRequest = new XMLHttpRequest();

		loginRequest.onreadystatechange = function() {
			if(this.readyState == 4){
                switch (this.status) {
                    case 200:
                        localStorage.setItem("logintoken", JSON.parse(loginRequest.responseText)['token']);
                        displayView();
                        break;
                    case 400:
                        loginform["email"].value = "";
                        loginform["password"].value = "";
                        loginform["email"].setAttribute("placeholder", "Invalid input.");
                        break;
                    case 404:
                        loginform["email"].value = "";
                        loginform["password"].value = "";
                        loginform["email"].setAttribute("placeholder", "User does not exist.");
                        break;
                }
			}
		}

		loginRequest.open("POST", "/signin", true);
		loginRequest.setRequestHeader("Content-Type", "application/json");
		loginRequest.send(JSON.stringify({
			"email": loginform["email"].value,
			"password": loginform["password"].value
		}));
	})
}

loadProfileView = function() {
	document.getElementById("pagecontent").innerHTML = "";
	document.getElementById("pagecontent").innerText = "";
	document.getElementById("pagecontent").innerHTML = document.getElementById("profileview").innerText;

	document.getElementById("defaultOpen").click();
	// reloadBoard(document.getElementById("home-message-board"));

	// Account page
	var changepassform = document.forms["changepassform"];
	changepassform.addEventListener("submit", function(event) {
		event.preventDefault();

        var token = localStorage.getItem("logintoken");

		if (inputValidation("changepassform")) {
            var oldPassword = changepassform["oldpassword"].value
            var newPassword = changepassform["password"].value
			var messageBox = document.getElementById("message2");

            var changepassRequest = new XMLHttpRequest();
            changepassRequest.onreadystatechange = function() {
                if(this.readyState == 4){
                    changepassform["oldpassword"].value = "";
                    changepassform["password"].value = "";
                    changepassform["password2"].value = "";
                    switch (this.status) {
                        case 200:
				            messageBox.style.color = "green";
                            messageBox.innerText = "Password changed."
                            break;
                        case 400:
				            messageBox.style.color = "red";
                            messageBox.innerText = "Bad argument."
                            break;
                        case 401:
				            messageBox.style.color = "red";
                            messageBox.innerText = "Authentication error."
                            break;
                        case 404:
				            messageBox.style.color = "red";
                            messageBox.innerText = "Wrong password."
                            break;
                    }
                }
            }

            changepassRequest.open("PUT", "/changepass", true);
            changepassRequest.setRequestHeader("Content-Type", "application/json");
            changepassRequest.setRequestHeader("Authorization", token)
            changepassRequest.send(JSON.stringify({
                "oldPassword": oldPassword,
                "newPassword": newPassword,
            }));
		}
	})

	document.getElementById("logoutbutton").addEventListener("click", function(event) {
        var logoutRequest = new XMLHttpRequest();
        var token = localStorage.getItem("logintoken");

		logoutRequest.onreadystatechange = function() {
			if(this.readyState == 4){
			    localStorage.removeItem("logintoken");
		        displayView();
			}
		}

		logoutRequest.open("POST", "/signout", true);
		logoutRequest.setRequestHeader("Content-Type", "application/json");
        logoutRequest.setRequestHeader("Authorization", token);
		logoutRequest.send();
	})


    var userdataRequest = new XMLHttpRequest();
    var token = localStorage.getItem("logintoken");

    userdataRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var userData = JSON.parse(userdataRequest.responseText);
            // Change the information displayed on the homepage to the user credentials 
            document.getElementById('home-username').innerText = userData.firstname + ' ' + userData.familyname;
            document.getElementById('home-gender').innerText = userData.gender;
            document.getElementById('home-location').innerText = userData.city + ', ' + userData.country;
            document.getElementById('home-email').innerText = userData.email;
        }
    }

    userdataRequest.open("GET", "/get_user_data_by_token", true);
    userdataRequest.setRequestHeader("Content-Type", "application/json");
    userdataRequest.setRequestHeader("Authorization", token);
    userdataRequest.send();


	var postmessageform = document.forms["board-text-form"];
	postmessageform.addEventListener("submit", function(event) {
		event.preventDefault();

		var messageBox = document.getElementById("message3");

        var postmessageRequest = new XMLHttpRequest();

        var token = localStorage.getItem("logintoken");
        var message = postmessageform["comment"].value;

        postmessageRequest.onreadystatechange = function() {
            if(this.readyState == 4) {

                if (this.status == 201){
                    messageBox.innerText = "Message posted.";
                    messageBox.style.color = "green";
                    reloadBoard(document.getElementById("home-message-board"));
                } else {
                    messageBox.innerText = "There was an error with sending your message.";
                    messageBox.style.color = "red";
                }
            }

        }

        postmessageRequest.open("POST", "/post_message", true);
        postmessageRequest.setRequestHeader("Content-Type", "application/json");
        postmessageRequest.setRequestHeader("Authorization", token);
        postmessageRequest.send(JSON.stringify({
            "message" : message,
        }));
	})

    return;

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
    console.log("reloatBoard",board,email)
	var boardBox = board;
	boardBox.innerHTML = "";
	boardBox.innerText = "";
    var token = localStorage.getItem("logintoken")

	var reloadBoardRequest = new XMLHttpRequest();

    reloadBoardRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var messageBoardData = JSON.parse(reloadBoardRequest.responseText)['messages'];

            for(var i = messageBoardData.length-1; i >=0; i--) {
                var messageHTML = document.createElement('div');
                var title = document.createElement('h2')
                title.innerText = messageBoardData[i]["writer"];
                messageHTML.appendChild(title);

                var contentHTML = document.createElement('textarea');
                contentHTML.setAttribute("readonly", "");
                contentHTML.setAttribute("rows", "5");
                contentHTML.setAttribute("max-rows", "5");
                contentHTML.setAttribute("cols", "50");
                contentHTML.innerText = messageBoardData[i]["content"];
                messageHTML.appendChild(contentHTML);
                messageHTML.appendChild(document.createElement('br'));
                    
                boardBox.appendChild(messageHTML);
            }
        }
    }

	if(email == null) {
		reloadBoardRequest.open("GET", "/get_user_messages_by_token", true);
        reloadBoardRequest.setRequestHeader("Content-Type", "application/json");
        reloadBoardRequest.setRequestHeader("Authorization", token)
        reloadBoardRequest.send();
	} else {
		reloadBoardRequest.open("GET", "/get_user_messages_by_email", true);
        reloadBoardRequest.setRequestHeader("Content-Type", "application/json");
        reloadBoardRequest.setRequestHeader("Authorization", token)
        reloadBoardRequest.send(JSON.stringify({
            "email" : email,
        }));
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
    if (formID != "changepassform") {
	    return !emptyField && validateEmail(form) && validatePassword(form)
    } else {
        return !emptyField && validatePassword(form)
    }
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
