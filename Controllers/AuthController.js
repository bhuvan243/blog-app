const registerController = (req, res) => {
	console.log("register api request");
	res.send("Register user");
};

const loginController = (req, res) => {
	console.log("login api request");
	res.send("Login user");
};

module.exports = { registerController, loginController };
