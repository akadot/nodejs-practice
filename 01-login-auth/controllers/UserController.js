import bcrypt from "bcrypt";
import updateUsers from '../utils/file-update.js'

export default {

	show(req, res) {
		res.render("register.ejs")
	},

	async store(req, res) {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);

			const user = {
				id: Date.now().toString(),
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword
			};

			updateUsers("./users.json", user)

			res.redirect('/login');

		} catch (error) {
			console.log("Error", error)
			res.redirect('/register')
		}
	}
}