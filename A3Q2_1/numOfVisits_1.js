const express = require("express");
const app = new express();

app.use((req, res, next) => {
    req.cookies = getCookies(req);
    next();
});

app.get("/", (req, res) => {
    let visitNum = req.cookies.visits ? parseInt(req.cookies.visits) + 1 : 1;
    let currentDate = new Date();

    res.cookie("visits", visitNum, {path: "/"});
    res.cookie("lastVisited", currentDate.toUTCString(), {path: "/"});

    let message;
    if(visitNum === 1){
        message = "Welcome to the page, its your first time";
    }
    else{
        let lastVisit = req.cookies.lastvisited ? new Date(req.cookies.lastvisited) : new Date();
        message = `Hello, this your ${visitNum}th time visiting the page. You last visited the page on ${oldDate(lastVisit)}`;
    }

    res.status(200).send(message);
});

app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});

function getCookies(req) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        return {};
    }
    return cookieHeader.split(";").reduce((cookies, cookie) => {
        const [key, ...value] = cookie.split("=");
        cookies[key.trim()] = decodeURIComponent(value.join("="));
        return cookies;
    }, {});
}

function oldDate(date) {
    if (isNaN(date.getTime())) {
        return "Unknown";
    }
    return date.toLocaleString("en-US", {
        weekday: "short", month: "short", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"
    });
}