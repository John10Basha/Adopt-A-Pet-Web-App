//Contains digital clock and client side validation for two forms
//#adoptionForm (FADC.html)
//#GAform (HAPTGA.html)

//Updates #current-time element with the current time in HH:MM:SS (24h)
//It runs every second and once DOMContentLoaded
function updateTime() {
    //Create instance of Date called now
    let now = new Date();

    //Zero-pad components to 2 digits for consistent layout
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');

    //Compose HH:MM:SS
    let timeString = `${hours}:${minutes}:${seconds}`;

    //Display time where id current-time is found
    document.getElementById("current-time").innerHTML = timeString;
  }

//Tick at every 1000 milliseconds
setInterval(updateTime, 1000);

//Draw after DOM is ready
document.addEventListener("DOMContentLoaded", updateTime);

//Validates the Find a Dog or Cat form before submission
//Checks for all missing fields and returns a single message for better UX
function validateFADCForm(event) {
    //If this was triggered by a real submit, pause the browser's auto-submit
    if (event) event.preventDefault();
    
    //Acquire user input values
    let petType = document.getElementById("pet_type").value;
    let breed = document.getElementById("breed").value;
    let ageSelected = document.querySelector('input[name="age"]:checked');
    let genderSelected = document.querySelector('input[name="gender"]:checked');
    let checkboxes = document.querySelectorAll('input[name="compatibility"]:checked');

    //Collect all errors so we can show a single alert
    let errorMessage = "";
  
    //Check each field
    if (!petType) {
      errorMessage += "Please select a type of pet.\n";
    }
    if (!breed) {
      errorMessage += "Please select a breed.\n";
    }
  
    if (!ageSelected) {
      errorMessage += "Please select a preferred age.\n";
    }
    if (!genderSelected) {
      errorMessage += "Please select a preferred gender.\n";
    }
  
    if (checkboxes.length === 0) {
      errorMessage += "Please select at least one compatibility option.\n";
    }

    //If there are no errors, then its safe to submit
    if (errorMessage !== "") {
      alert(errorMessage);
      return false;
    }

    //Send the form right now AFTER our validation passes
    //(prevents our submit handler from looping)
    document.getElementById("adoptionForm").submit();
}

//When the page finishes loading, hook our validator to the form
//Makes clicking "Submit" run validateFADCForm first
document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("adoptionForm");
    if (form) {
      form.addEventListener("submit", validateFADCForm);
    }
});

//Validates the "Have a Pet to Give Away" form before submission.
function validateHAPTGAForm(event) {
    //If this was triggered by a real submit, pause the browser's auto-submit
    if (event) event.preventDefault();

    //Acquire user input values
    let petTypeGA = document.getElementById("GA_pet_type").value;
    let breedGA = document.getElementById("GA_breed").value;
    let ageGA = document.querySelector('input[name="GA_age"]:checked');
    let genderGA = document.querySelector('input[name="GA_gender"]:checked');
    let compatibilityGA = document.querySelectorAll('[name="compatibility"]:checked');
    let bragGA = document.getElementById("GA_brag").value;
    let ownerFNGA = document.getElementById("FN").value;
    let ownerLNGA = document.getElementById("LN").value;
    let emailGA = document.getElementById("email").value;

    //Collect all errors so we can show a single alert
    let errorMessageGA = "";

    //Check each field
    if (!petTypeGA) {
        errorMessageGA += "Please select a type of pet.\n";
    }

    if (breedGA.trim() === '') {
        errorMessageGA += "Please specify a breed.\n";
    }

    if (!ageGA) {
        errorMessageGA += "Please select the age.\n";
    }

    if (!genderGA) {
        errorMessageGA += "Please select the gender.\n";
    }

    if (compatibilityGA.length === 0) {
        errorMessageGA += "Please select at least one compatibility option.\n";
    }

    if (bragGA.trim() === '') {
        errorMessageGA += "Please write a description.\n";
    }

    if (ownerFNGA.trim() === '') {
        errorMessageGA += "Please write your first name.\n";
    }

    if (ownerLNGA.trim() === '') {
        errorMessageGA += "Please write your last name.\n";
    }

    function isValidEmail(email) {
        let verificationEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return verificationEmail.test(email);
    }

    if (!isValidEmail(emailGA)) {
        errorMessageGA += "Please enter a correct email.\n";
    }

    //If there are no errors, then its safe to submit
    if (errorMessageGA !== "") {
        alert(errorMessageGA);
        return;
    }

    //Send the form right now AFTER our validation passes
    //(prevents our submit handler from looping)
    document.getElementById("GAform").submit();
}

//When the page finishes loading, hook our validator to the form
//Makes clicking "Submit" run validateHAPTGAForm first
document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("GAform");
    if (form) {
        form.addEventListener("submit", validateHAPTGAForm);
    }
});