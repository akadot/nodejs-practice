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
	return res.status(200).json({ msg: "Alo" })
})

//Private Route
app.get("/user/:id", checkToken, async (req, res) => {
	const id = req.params.id

	const user = await User.findById(id, '-password') //delete password from return

	if (!user) {
		return res.status(404).json({ msg: "Error: User doesn't found." })
	}

	return res.status(200).json({ user })
})

function checkToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(" ")[1] //if authHeader exists, split the value by space and take the second index (token starts with 'Bearer . ..')

	if (!token) {
		return res.status(401).json({ msg: "Error: Invalid User." })
	}

	try {

		const secret = process.env.SECRET
		jwt.verify(token, secret)
		next()

	} catch (error) {

		return res.status(400).json({ msg: "Invalid Token" })
	}
}

//Register User
app.post("/auth/register", async (req, res) => {
	const { name, email, password, confirmPassword } = req.body

	if (!name || !email || !password) {
		return res.status(422).json({ msg: "Error: All fields must be filled." })
	} else if (password !== confirmPassword) {
		return res.status(422).json({ msg: "Error: Passwords do not match" })
	}

	//Check if user exists
	const userExists = await User.findOne({ email: email })

	if (userExists) {
		return res.status(422).json({ msg: "Error: User already exists." })
	}

	//Create password
	const salt = await bcrypt.genSalt(12);
	const passwordHashed = await bcrypt.hash(password, salt);

	//Create User
	const user = new User({
		name,
		email,
		password: passwordHashed
	});

	try {

		await user.save()
		return res.status(200).json({ msg: 'User created.' })

	} catch (error) {

		console.log(error);
		return res.status(500).json({ msg: 'Server Error.' })

	}
})

//Login/Auth User

app.post("/auth/login", async (req, res) => {

	const { email, password } = req.body

	if (!email || !password) {
		return res.status(422).json({ msg: "Error: Email and Password required." })
	}

	//check user exists
	const user = await User.findOne({ email: email })

	if (!user) {
		return res.status(404).json({ msg: "Error: User doesn't exist." })
	}

	//check password
	const checkPassword = await bcrypt.compare(password, user.password);

	if (!checkPassword) {
		return res.status(422).json({ msg: "Error: Wrong Password." })
	}

	try {
		const secret = process.env.SECRET

		const token = jwt.sign({
			id: user._id
		}, secret)

		return res.status(200).json({ msg: "Auth Ok.", token })

	} catch (error) {

		console.log(error);
		return res.status(500).json({ msg: 'Server Error.' })
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
