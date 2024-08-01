const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8001;
const clc = require("cli-color");

// DB import
const db = require("./db");

// router imports
const AuthRouter = require("./Routers/AuthRouter");

//middlewares
// check for /auth/register --> after /auth/:whatever --> making nested routing configuration
app.use("/auth", AuthRouter);

app.get("/", (req, res) => {
	return res.send("Server started");
});

app.listen(PORT, () => {
	console.log(
		clc.blue.bgCyan.underline.bold(`Server is listening on port :${PORT}`),
	);
});
