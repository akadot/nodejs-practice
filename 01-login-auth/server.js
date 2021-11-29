import express from 'express';
import routes from './routes.js';

const app = express();

app.set("view-engine", "ejs");

app.use(express.urlencoded({ extended: false })) // to get fields values without do a request (req.body.name)

app.use(routes);

app.listen(3333)