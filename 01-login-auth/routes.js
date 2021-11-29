import express from "express";
import SessionController from "./controllers/SessionController.js";
import UserController from "./controllers/UserController.js";

const routes = express.Router();

routes.get("/", (req, res) => {
	res.render("index.ejs", { name: "Zumiro" });
});

routes.get("/login", SessionController.store);

routes.get("/register", UserController.show);

routes.post('/login')

routes.post('/register', UserController.store)

export default routes;