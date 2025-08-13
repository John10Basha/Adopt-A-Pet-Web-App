function updateTime() {
    let now = new Date();
  
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
  
    let timeString = `${hours}:${minutes}:${seconds}`;
  
    document.getElementById("current-time").innerHTML = timeString;
  }
  
  setInterval(updateTime, 1000);
  
  document.addEventListener("DOMContentLoaded", updateTime);

function validateFADCForm(event) {
    if (event) event.preventDefault();
  
    let petType = document.getElementById("pet_type").value;
    let breed = document.getElementById("breed").value;
    let ageSelected = document.querySelector('input[name="age"]:checked');
    let genderSelected = document.querySelector('input[name="gender"]:checked');
    let checkboxes = document.querySelectorAll('input[name="compatibility"]:checked');
  
    let errorMessage = "";
  
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
  
    if (errorMessage !== "") {
      alert(errorMessage);
      return false;
    }
  
    document.getElementById("adoptionForm").submit();
}
  
document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("adoptionForm");
    if (form) {
      form.addEventListener("submit", validateFADCForm);
    }
});

function validateHAPTGAForm(event) {
    if (event) event.preventDefault();

    let petTypeGA = document.getElementById("GA_pet_type").value;
    let breedGA = document.getElementById("GA_breed").value;
    let ageGA = document.querySelector('input[name="GA_age"]:checked');
    let genderGA = document.querySelector('input[name="GA_gender"]:checked');
    let compatibilityGA = document.querySelectorAll('[name="compatibility"]:checked');
    let bragGA = document.getElementById("GA_brag").value;
    let ownerFNGA = document.getElementById("FN").value;
    let ownerLNGA = document.getElementById("LN").value;
    let emailGA = document.getElementById("email").value;

    let errorMessageGA = "";

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

    if (errorMessageGA !== "") {
        alert(errorMessageGA);
        return;
    }

    document.getElementById("GAform").submit();
}

document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("GAform");
    if (form) {
        form.addEventListener("submit", validateHAPTGAForm);
    }
});