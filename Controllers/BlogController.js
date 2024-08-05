const createBlogController = (req, res) => {
	console.log("bloggyyyy");
	res.send({
		message: "Blog created successfully",
		blog: req.body,
	});
};

module.exports = { createBlogController };
