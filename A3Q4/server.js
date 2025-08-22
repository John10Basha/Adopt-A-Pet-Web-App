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

//In the create an account page (CAC.html), user submits potential username and password
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
        //Split the file into lines at every line. At every line, split the values between ":" and extract the value before ":", which is the username 
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

app.post("/login", (req, res) => {
    const { lUsername, lPassword } = req.body;

    if (!/^[a-zA-Z0-9]+$/.test(lUsername) || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(lPassword)) {
        return res.send("Invalid username or password format");
    }

    try {
        const data = fs.existsSync('myLogins.txt') ? fs.readFileSync('myLogins.txt', 'utf8') : "";
        const credentials = data.split('\n').map(line => line.split(':'));
        const matchedUser = credentials.find(cred => cred[0] === lUsername && cred[1] === lPassword);

        if (matchedUser) {
            //Start a new session
            req.session.username = lUsername;
            res.send("Login successful. Proceed to fill out the form.");
        } else {
            res.send("Login failed. Incorrect username or password.");
        }
    } catch (err) {
        console.error("Error reading myLogins.txt:", err);
        res.send("Server error.");
    }
});

app.post("/submit-pet-form", (req, res) => {
    const { GA_pet_type, GA_breed, GA_age, GA_gender, compatibility, GA_brag, First_Name, Last_Name, email } = req.body;
    const username = req.session.username;
    
    if (!username) {
        return res.send("You must be logged in to submit a pet.");
    }

    const filePath = 'availablePetInformation.txt';
    const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "";
    const lines = fileData.trim() === "" ? [] : fileData.trim().split('\n');
    const newId = lines.length + 1;

    const compatibilityStr = Array.isArray(compatibility)
        ? compatibility.join(",")
        : compatibility || "";

    const entry = `${newId}:${username}:${GA_pet_type}:${GA_breed}:${GA_age}:${GA_gender}:${compatibility}:${GA_brag}:${First_Name}:${Last_Name}:${email}`;

    try {
        fs.appendFileSync(filePath, `${entry}\n`);
        res.send("Pet information submitted successfully.");
    } catch (err) {
        console.error("Error writing to availablePetInformation.txt:", err);
        res.send("Server error.");
    }
});

app.post("/find-pets", (req, res) => {
    const { pet_type, breed, age, gender, compatibility } = req.body;
    const filePath = 'availablePetInformation.txt';

    try {
        const fileData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "";
        const pets = fileData.trim().split('\n').map(line => {
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

        const matches = pets.filter(pet => {
            return (pet.petType === pet_type) &&
                   (breed === "Doesn't matter" || pet.petBreed === breed) &&
                   (age === "Doesn't matter" || pet.petAge === age) &&
                   (gender === "Doesn't matter" || pet.petGender === gender) &&
                   (!compatibility || (pet.petCompatibility && pet.petCompatibility.includes(compatibility)));
        });

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
            res.send(`<pre>${text}</pre>`);
        } else {
            res.send("No pets match your criteria. Please try different options.");
        }

    } catch (err) {
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