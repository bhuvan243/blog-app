const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log(clc.yellowBright("Connected to MongoDB"));
	})
	.catch((error) => console.log(clc.redBright(error)));
