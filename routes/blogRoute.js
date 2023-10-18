const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const { checkRole } = require("../middlewares/checkRole");

const {
  createBlog,
  getAllBlogs,
  getLatestBlogs,
  getBlogById,
} = require("../controllers/blogController");

router.post("/createBlog", checkAuth, createBlog);
router.get("/getAllBlogs", getAllBlogs);
router.get("/getLatestBlogs", getLatestBlogs);
router.get("/getBlogById/:id", getBlogById);

module.exports = router;
