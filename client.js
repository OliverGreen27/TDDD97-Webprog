displayView = function() {
	// the code required to display a view
};
window.onload = function() {
	// code that is executed as the page is loaded.
	// You shall put your own custom code here.
	// window alert() is not allowed to be used in your implementation.
	//window.alert("Hello TDDD97!");
	document.getElementById("pagecontent").innerHTML = document.getElementById("welcomeview").innerText;
	var signupform = document.forms["signupform"]
	signupform.addEventListener("submit", function(event) {
		event.preventDefault();
		inputValidation(event);
	})
};

inputValidation = function(event) {
	let allInputs = document.forms["signupform"].elements;
	for(elem in allInputs) {
		if(element.type === "text" && element.value === "") {
			console.log("hejejeheh");
			return false;
		}
	}
	let emailText = document.forms["loginform"]["email"].value;
	if (!validateEmail(emailText)) {
		return false;
	}


}
function validateEmail(input) {
  var validRegex = /\w+@\w+\.\w+/
  if (input.value.match(validRegex)) {
    alert("Valid email address!");
    document.form1.text1.focus();
    return true;
  } else {
    alert("Invalid email address!");
    document.form1.text1.focus();
    return false;
  }

}