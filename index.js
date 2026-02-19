const bcrypt = require('bcrypt');
const express = require('express');
const {UserModel, TodoModel} = require('./db');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = "aezakmi";
const { z } = require('zod');

mongoose.connect("mongodb+srv://nishchay:Vashishtha_4002@nishchay.5f5jqxw.mongodb.net/toto-nishchay");
const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const requireBody = z.object({
        email : z.string().min(3).max(50).email(),
        name : z.string().min(3).max(20),
        password : z.string().min(3).max(20)
    })
    
    const parsedDataWithSuccess = requireBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success) {
        res.json({
            message : "Incorrect Format"
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log(hashedPassword);

        await UserModel.create({
            email : email,
            password : hashedPassword,
            name : name
        })
        throw new Error("User already Exists")
    } catch(e) {
        res.json({
            message : "User already Exists!"
        })
        errorThrown = true;
    }
    

    if(!errorThrown) {
        res.json({
        message : "You have successfully signed up"
    })
    }
})

app.post("/login", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;


    const response = await UserModel.find({
        email : email,
    });

    if(!response) {
        res.status(403).json({
            message : "User does not exist in our db"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, response.password);

    if(passwordMatch) {
        const token = jwt.sign({
            id : response._id.toString()
        }, JWT_SECRET);
        res.json({
            token : token
        })
    } else {
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
})

function auth(req, res, next) {
    const token = req.headers.token;

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

app.listen(3000);