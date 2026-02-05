const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "kyahaalhain!"

const app = express();

app.use(express.json());

const users = [];

function logger(req, res, next) {
    console.log(`${req.method} request came`);
    next();
}


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html")
})
app.post("/signup",logger, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username : username,
        password : password
    })

    res.json({
        message : "User created successfully"
    })

    console.log(users);
})

app.post("/signin",logger, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    //Maps and Filters
    let foundUser = null;

    for(let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i];
        }
    }

    if(foundUser) {
        const token = jwt.sign({
            username : username,
        }, JWT_SECRET);

        res.json({
            token : token
        })
    } else {
        res.json({
            message : "Invalid Username or Password"
        })
    }
    console.log(users);
})

function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.username = decodedData.username;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
}

app.get("/me", logger, auth, function(req, res) {
    
    let foundUser = null;

    for(let i = 0; i < users.length; i++) {
        if (users[i].username == req.username) {
            foundUser = users[i];
        }
    }

    res.json({
        username : foundUser.username,
        password : foundUser.password
    })
})

app.listen(3000);