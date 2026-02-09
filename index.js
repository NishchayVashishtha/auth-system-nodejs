const express = require('express');
<<<<<<< HEAD
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

=======
const {UserModel, TodoModel} = require('./db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = "aezakmi";

mongoose.connect("mongodb+srv://nishchay:Vashishtha_4002@nishchay.5f5jqxw.mongodb.net/toto-nishchay-3");
const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email : email,
        password : password,
        name : name
    })

    res.json({
        message : "You have successfully signed up"
    })
})

app.post("/login", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;


    const user = await UserModel.findOne({
        email : email,
        password : password
    })

    console.log(user)

    if(user) {
        const token = jwt.sign({
            id : user._id.toString()
        }, JWT_SECRET);
>>>>>>> 1c8d5bc (Final cleanup: node_modules ignored and repository structured)
        res.json({
            token : token
        })
    } else {
<<<<<<< HEAD
        res.json({
            message : "Invalid Username or Password"
        })
    }
    console.log(users);
=======
        res.status(403).json({
            message : "Incorrect credentials"
        })
    }
})

app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done || false;
    await TodoModel.create({
        title,
        userId,
        done
    })

    res.json({
        message : "Todo created"
    })
})

app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId
    })

    res.json({
        todos
    })
>>>>>>> 1c8d5bc (Final cleanup: node_modules ignored and repository structured)
})

function auth(req, res, next) {
    const token = req.headers.token;

<<<<<<< HEAD
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

=======
    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData) {
        req.userId = decodedData.id;
        next();
    } else {
        res.status(402).json({
            message : "Incorrect Credentials"
        })
    }
}

>>>>>>> 1c8d5bc (Final cleanup: node_modules ignored and repository structured)
app.listen(3000);