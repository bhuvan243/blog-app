const express = require("express");
const { createBlogController } = require("../Controllers/BlogController");
const BlogRouter = express.Router();

BlogRouter.post("/create-blog", createBlogController);

module.exports = BlogRouter;
