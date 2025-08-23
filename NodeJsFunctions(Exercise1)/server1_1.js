const express = require("express");
const path = require("path");
const app = new express();

function findSummation(N){
    N = Number(N);
    if(isNaN(N) || N<=0){
        return "Invalid input";
    }
    else{
        return `The summation is ${((N*(N+1))/2)}`;
    }
}

function upperCaseFirstAndLast(aString){
    let words = aString.split(" ");

    let capWords = words.map(word => {
        if(word.length >= 2){
            let firstCh = word.charAt(0).toUpperCase();
            let lastCh = word.charAt(word.length - 1).toUpperCase();
            let restCh = word.substring(1, word.length - 1);
            return firstCh + restCh + lastCh;
        }
        else{
            return word.toUpperCase();
        }
    });

    let newString = capWords.join(" ");
    return `Our new string is ${newString}`;
}

function findAverageAndMedian(stringWCommas){
    let arrayNums = stringWCommas.split(",").map(Number);

    let sum = arrayNums.reduce((a,b) => a+b, 0);
    let average = sum/(arrayNums.length);

    let sorted = arrayNums.sort((a,b) => a-b);
    let median;
    if(sorted.length % 2 === 0){
        let mid = sorted.length / 2;
        median =(sorted[mid] + sorted[mid-1])/2
    }
    else{
        median = sorted[Math.floor(sorted.length / 2)];
    }

    return `The average was ${average} and the median was ${median}`;
}

function find4Digits(aString){
    let stringOfNums = aString.split(" "); 

    for(let num of stringOfNums){
        if(/^\d{4}$/.test(num)){
            return `The 4-digit number was ${num}`;
        }
    }

    return "No 4-digit number found";
}

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "A3Q1_1.html"));
});

app.get("/findSummation", (req, res) => {
    res.send(findSummation(req.query.number));
});

app.get("/upperCaseFirstAndLast", (req, res) => {
    res.send(upperCaseFirstAndLast(req.query.string))
});

app.get("/findAverageAndMedian", (req,res) => {
    res.send(findAverageAndMedian(req.query.numArr));
});

app.get("/find4Digits", (req, res) =>{
    res.send(find4Digits(req.query.fourDigits))
});

app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
});