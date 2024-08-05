const isAuth = (req, res, next) => {
	if (req.session.isAuth) {
		next();
	} else {
		res.send({
			status: 401,
			message: "Your session is expired. Please login again",
		});
	}
};

module.exports = isAuth;
