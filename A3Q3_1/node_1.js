const express = require("express");
const path = require("path");

const app = new express();

function phoneNumberChecker(aPhoneNumber) {
    const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    if(phonePattern.test(aPhoneNumber)){
        return `<h2 style="color: green;">This is a valid phone number: ${aPhoneNumber}</h2>`;
    }
    else{
        return `<h2 style="color: red;">This is not a valid phone number: ${aPhoneNumber}</h2>`;
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index_1.html"));
});

app.get("/phoneNumberChecker", (req, res) => {
    res.send(phoneNumberChecker(req.query.pn));
});


app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});