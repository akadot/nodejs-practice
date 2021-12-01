require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

app.use(express.json())

//Models
const User = require("./models/User.js")

//Open/Public Routes
app.get("/", (req, res) => {
	res.status(200).json({ msg: "Alo" })
})

//Register User
app.post("/auth/register", async (req, res) => {
	const { name, email, password, confirmPassword } = req.body

	if (!name || !email || !password) {
		res.status(422).json({ msg: "Error: All fields must be filled." })
	} else if (password !== confirmPassword) {
		res.status(422).json({ msg: "Error: Passwords do not match" })
	}
})

//Credentials
const dbUser = process.env.DB_USER;
const dbPassowrd = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassowrd}@cluster0.oj374.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
	.then(() => {
		console.log("Database Connected")
		app.listen(3333)
	})
	.catch((err) => {
		console.log(err)
	})
