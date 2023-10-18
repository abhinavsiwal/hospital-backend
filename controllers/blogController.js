const Blog = require("../models/Blog");

const { body, validationResult } = require("express-validator");
const moment = require("moment");

exports.createBlog = [
  body("title").notEmpty().withMessage("Please enter a valid title."),
  body("body").notEmpty().withMessage("Please enter a valid body."),
  body("category").notEmpty().withMessage("Please enter a valid category."),
  body("image").notEmpty().withMessage("Please enter a valid image url."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { title, body, category, image } = req.body;
    const userId = req.user._id;
    try {
      const blog = await Blog.create({
        title,
        body,
        category,
        image,
        author: userId,
      });

      res.status(201).json({
        message: "Blog created.",
        blog,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Blog creation failed.");
      error.status = 500;
      return next(error);
    }
  },
];

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({
      status: "published",
    }).populate("author", "name email");
    res.status(200).json({
      blogs,
    });
  } catch (err) {
    console.log(err);
    const error = new Error("Failed to fetch Blogs.");
    error.status = 500;
    return next(error);
  }
};

exports.getLatestBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name email");
    res.status(200).json({
      blogs,
    });
  } catch (err) {
    console.log(err);
    const error = new Error("Failed to fetch Blogs.");
    error.status = 500;
    return next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email"
    );
    res.status(200).json({
      blog,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to fetch Blog.");
    err.status = 500;
    return next(err);
  }
};
