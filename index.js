// package imports
const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

// DB+File imports
const db = require("./db");
// router imports
const AuthRouter = require("./Routers/AuthRouter");
const BlogRouter = require("./Routers/BlogRouter");

//constants
const app = express();
const PORT = process.env.PORT || 8001;
const store = new mongodbSession({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});

//middlewares
app.use(express.json());

app.use(
	session({
		secret: process.env.SECRET_KEY,
		store: store,
		resave: false,
		saveUninitialized: false,
	}),
);

// router - middlewares
// check for /auth/register --> after /auth/:whatever --> making nested routing configuration
app.use("/auth", AuthRouter);
app.use("/blog", BlogRouter);

app.get("/", (req, res) => {
	return res.send("Server started");
});

app.listen(PORT, () => {
	console.log(
		clc.blue.bgCyan.underline.bold(`Server is listening on port :${PORT}`),
	);
});
