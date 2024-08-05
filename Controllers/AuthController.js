const User = require("../Models/UserModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { userDataValidation } = require("../Utils/authUtils");

const registerController = async (req, res) => {
	console.log(req.body);
	const { name, email, username, password } = req.body;

	// data validation
	try {
		const userDb = await userDataValidation({
			name,
			email,
			username,
			password,
		});
		console.log(userDb);
	} catch (error) {
		return res.send({
			status: 400,
			message: "User data invalid",
			error: error,
		});
	}
	// Implement user registration logic here
	const userObj = new User({ name, email, username, password });
	// to check if user is already registered
	try {
		const userDb = await userObj.emailAndUsernameExist();
		console.log(userDb);
	} catch (error) {
		res.send({
			status: 400,
			message: "User already exists",
			error: error,
		});
	}

	// save user to DB and return success response with user details
	try {
		const userDb = await userObj.userRegistration();
		console.log(userDb);
		return res.send({
			status: 201,
			message: "User registered successfully",
			user: userDb,
		});
	} catch (error) {
		res.send({
			status: 500,
			message: "Error while storing user registration data in DB",
			error: error,
		});
	}

	console.log("register api request");
	res.send("Registered user");
};

const loginController = async (req, res) => {
	const { loginId, password } = req.body;

	if (!loginId || !password) {
		res.send({ status: 400, message: "User credentials missing" });
	}

	// find the user --> then check for password
	try {
		const userDb = await User.findUserWithKey({ loginId });
		console.log("found user", userDb);

		const isMatch = await bcrypt.compare(password, userDb.password);
		if (!isMatch) {
			return res.send({ status: 400, message: "Password is incorrect" });
		}

		console.log(req.session);
		req.session.isAuth = true;
		req.session.user = {
			user_id: userDb._id,
			email: userDb.email,
			username: userDb.username,
		};

		res.send({
			status: 200,
			message: "user loggedin successfully",
			data: userDb,
		});
	} catch (error) {
		res.send({
			status: 500,
			message: "Internal Server Error",
			error: error,
		});
	}
};

const logoutController = (req, res) => {
	console.log(req.session.id);

	req.session.destroy((err) => {
		if (err) {
			console.error(err);
			return res.send({
				status: 500,
				message: "Error while logging out user",
			});
		}
		console.log("Session destroyed");

		console.log(req.session);

		res.send({
			status: 200,
			message: "User logged out successfully",
			data: req.session,
		});
	});
};

const logoutFromAllDevicesController = async (req, res) => {
	console.log(req.session);

	const username = req.session.user.username;
	// schema for session, with strict: false -->
	const sessionSchema = new Schema(
		{
			_id: String,
		},
		{
			strict: false,
		},
	);
	// model to work on db queries
	const session = mongoose.model("session", sessionSchema);

	try {
		const deleteDb = await session.deleteMany({
			"session.user.username": username,
		});

		console.log("Deleted sessions:", deleteDb);

		return res.send({
			status: 200,
			message:
				"Logged out from all devices successfully " +
				`count : ${deleteDb.deletedCount}`,
			data: {
				username: username,
				logoutFromAllDevices: deleteDb.deletedCount,
			},
		});
	} catch (error) {
		return response.send({
			status: 500,
			message: "Error while logging out from all devices",
			error: error,
		});
	}
};

module.exports = {
	registerController,
	loginController,
	logoutController,
	logoutFromAllDevicesController,
};
