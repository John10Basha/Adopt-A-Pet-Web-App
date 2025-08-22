//This file starts the Adopt A Pet server
//It defines GET routes to show/read info and POST routes to receive form data and do actions like create account or find pets)

//Importing web framework (Express), path/files helpers, body parsing (req.body), and session support
//Then create the Express app instance and start
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const app = express();

//Lets the server serve files directly from this folder. Anything in project root is reachable by url
app.use(express.static(__dirname));
//Reads HTML form posts and puts the fields on req.body
app.use(bodyParser.urlencoded({ extended: true }));

//Remembers users between requests
//secret: signs the session cookie
//resave: false: don’t rewrite the session if nothing changed
//saveUninitialized: true: give new visitors a session right away
app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: true,
}));

//In the create an account page (CAC.html), user submits potential username and password to be saved
//Both fields get checked here, if they both pass, they get appended to myLogins.txt 
app.post("/create-account", (req, res) => {
    //Pulling username and password from the form body into variables
    const { username, password } = req.body;

    //Ensuring username is only letters/digits (no spaces or symbols)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.send("Username must be alphanumeric.");
    }
    //Password must contain at least a letter, at least a digit, composed of only letters and digits, and 4 characters minimum
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password)) {
        return res.send("Password must be at least 4 characters long with letters and numbers.");
    }

    try {
        //If myLogins.txt exists, read it as text. If it does not exist, read it as an empty string
        const data = fs.existsSync('myLogins.txt') ? fs.readFileSync('myLogins.txt', 'utf8') : "";
        //Split the file into lines at every newline. At every line, split the values between ":" and extract the value before ":", which is the username 
        const usernames = data.split('\n').map(line => line.split(':')[0]);
        //If the username submitted by the user matches with one of the usernames in myLogins.txt send a message that its taken
        if (usernames.includes(username)) {
            return res.send("Username is already taken.");
        }
    //If something goes wrong dont crash server    
    } catch (err) {
        console.error("Error reading myLogins.txt:", err);
    }

    //If username was able to pass the try block above we reach this try block
    try {
        //Add the username and password to myLogins.txt
        fs.appendFileSync('myLogins.txt', `${username}:${password}\n`);
        res.send("Account created successfully.");
        //res.redirect("/CAC.html");
    } 
    //If something goes wrong dont crash server
    catch (err) {
        console.error("Error writing to myLogins.txt:", err);
        res.send("Server error.");
    }
});

//In the login page (login.html), the user submits username and password in order to start a session
//If the username and password can match a pair in myLogins.txt, we can start a new session
app.post("/login", (req, res) => {
    //Extracting username and password from the form body into variables
    const { lUsername, lPassword } = req.body;

    //Ensuring username is only letters/digits (no spaces or symbols)
    //Or password must contain at least a letter, at least a digit, composed of only letters and digits, and 4 characters minimum
    //If one of these criterias are not met we send a message to user
    if (!/^[a-zA-Z0-9]+$/.test(lUsername) || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(lPassword)) {
        return res.send("Invalid username or password format");
    }

    try {
        //If myLogins.txt exists, read it as text. If it does not exist, read it as an empty string
        const data = fs.existsSync('myLogins.txt') ? fs.readFileSync('myLogins.txt', 'utf8') : "";
        //Split the file into lines at every newline. At every line, split the values between ":", what is found at [0] is the username and at [1] is the password
        const credentials = data.split('\n').map(line => line.split(':'));
        //Compare creds from myLogins.txt with lUsername and lPassword
        const matchedUser = credentials.find(cred => cred[0] === lUsername && cred[1] === lPassword);

        //matchedUser will only be true if lUsername and lPassword match with a pair myLogins.txt
        if (matchedUser) {
            //Start a new session
            req.session.username = lUsername;
            res.send("Login successful. Proceed to fill out the form.");
        } else {
            //If user did not enter valid credentials to login and they did not match with any pair in myLogins.txt display a message
            res.send("Login failed. Incorrect username or password.");
        }
    }
    //If something goes wrong dont crash server 
    catch (err) {
        console.error("Error reading myLogins.txt:", err);
        res.send("Server error.");
    }
});

//In the Have A Pet To Give Away page (HAPTGA.html), the user submits the info for a pet they want to put up for adoption
//The user may only give away a pet if they are logged in
app.post("/submit-pet-form", (req, res) => {
    //Extracting entered fields from the form body into variables
    const { GA_pet_type, GA_breed, GA_age, GA_gender, compatibility, GA_brag, First_Name, Last_Name, email } = req.body;
    
    //Grab the logged-in username from the session
    const username = req.session.username;
    //If there’s no username in the session, stop right here and tell them they must log in
    if (!username) {
        return res.send("You must be logged in to submit a pet.");
    }

    //Shortcut variable for the filename we’ll read/write
    const filePath = 'availablePetInformation.txt';
    //If availablePetInformation.txt exists, read it as text. If it does not exist, read it as an empty string
    const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "";
    //If the file is empty, use an empty list; otherwise we split the text into one array item per line.
    const lines = fileData.trim() === "" ? [] : fileData.trim().split('\n');
    //Make a new numeric ID by taking how many lines already exist and adding 1
    const newId = lines.length + 1;

    //The compatibility field might be an array or a single string.
    //If it’s an array we join them with a comma. If it’s a single value or missing we use that value or ""
    const compatibilityStr = Array.isArray(compatibility)
        ? compatibility.join(",")
        : compatibility || "";

    //Building our entry with values we obtained from object deconstructing
    const entry = `${newId}:${username}:${GA_pet_type}:${GA_breed}:${GA_age}:${GA_gender}:${compatibility}:${GA_brag}:${First_Name}:${Last_Name}:${email}`;

    //Adding our entry to the availablePetInformation.txt
    try {
        fs.appendFileSync(filePath, `${entry}\n`);
        res.send("Pet information submitted successfully.");
    } 
    //If something goes wrong dont crash server 
    catch (err) {
        console.error("Error writing to availablePetInformation.txt:", err);
        res.send("Server error.");
    }
});

//In Find A Dog/Cat page (FADC.html), the user can enter the criterias they are interested in
//Based on their interests, the server will return to them with any possible matches
app.post("/find-pets", (req, res) => {
    //Extracting entered fields from the form body into variables
    const { pet_type, breed, age, gender, compatibility } = req.body;
    //Path where all listings are found
    const filePath = 'availablePetInformation.txt';

    try {
        //If availablePetInformation.txt exists, read it as text. If it does not exist, read it as an empty string
        const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "";
        //Building an array of pet objects from the text file
        //Dropping stray newlines/spaces at the edges
        //one line = one pet record
        const pets = fileData.trim().split('\n').map(line => {
             // Break the line into its 11 fields using ":"
            const [petId, username, petType, petBreed, petAge, petGender, petCompatibility, petDescription, firstName, lastName, email] = line.split(':');
            return {
                petId,
                username,
                petType,
                petBreed,
                petAge,
                petGender,
                petCompatibility,
                petDescription,
                firstName,
                lastName,
                email
            };
        });

        //Filter pets that match the user's choices in new array
        const matches = pets.filter(pet => {
            return (pet.petType === pet_type) &&
                   (breed === "Doesn't matter" || pet.petBreed === breed) &&
                   (age === "Doesn't matter" || pet.petAge === age) &&
                   (gender === "Doesn't matter" || pet.petGender === gender) &&
                   (!compatibility || (pet.petCompatibility && pet.petCompatibility.includes(compatibility)));
        });

        //If matches array is filled, display the findings
        if (matches.length > 0) {
            let text = `Matching Pets Found:\n\n`;
            matches.forEach(pet => {
                text += `Type: ${pet.petType}\n`;
                text += `Breed: ${pet.petBreed}\n`;
                text += `Age: ${pet.petAge}\n`;
                text += `Gender: ${pet.petGender}\n`;
                text += `Compatibility: ${pet.petCompatibility}\n`;
                text += `Description: ${pet.petDescription}\n`;
                text += `Contact: ${pet.firstName} ${pet.lastName} | Email: ${pet.email}\n`;
                text += `-----------------------------\n`;
            });
            //<pre> preserves newlines/spaces so it renders nicely
            res.send(`<pre>${text}</pre>`);
        } else {
            res.send("No pets match your criteria. Please try different options.");
        }

    } 
    //If something goes wrong dont crash server 
    catch (err) {
        console.error("Error reading pet file:", err);
        res.send("Server error while finding pets.");
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/FADC", (req, res) => {
    res.sendFile(path.join(__dirname, "FADC.html"));
});

app.get("/DC", (req, res) => {
    res.sendFile(path.join(__dirname, "DC.html"));
});

app.get("/CC", (req, res) => {
    res.sendFile(path.join(__dirname, "CC.html"));
});

app.get("/CAC", (req, res) => {
    res.sendFile(path.join(__dirname, "CAC.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/HAPTGA", (req, res) => {
    res.sendFile(path.join(__dirname, "HAPTGA.html"));
});

app.get("/CU", (req, res) => {
    res.sendFile(path.join(__dirname, "CU.html"));
});

app.get("/logout", (req, res) => {
    if (!req.session.username) {
        return res.send("Cannot log out. You are not logged in.");
    }

    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.send("Error logging out.");
        }
        res.send("Successfully logged out.");
    });
});

app.get("/PD", (req, res) => {
    res.sendFile(path.join(__dirname, "PD.html"));
});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});