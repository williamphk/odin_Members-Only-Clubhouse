const Post = require("../models/post");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

// Display list of all Posts
exports.post_list = async (req, res, next) => {
  try {
    const post_list = await Post.find({}, "title").sort({
      title: 1,
    });
    if (req.isAuthenticated()) {
      res.render("post_list", {
        title: "Post List",
        user: req.user.fullname,
        post_list,
      });
    } else {
      res.render("post_list", {
        title: "Post List",
        post_list,
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific Post
exports.post_detail = async (req, res, next) => {
  try {
    const post_detail = await Post.findById(req.params.id).populate(
      "created_by"
    );
    if (req.isAuthenticated()) {
      res.render("post_detail", {
        title: "Post Detail",
        post_detail,
      });
    } else {
      const limitedPostDetail = {
        title: post_detail.title,
        content: post_detail.content,
        created_by: "",
      };
      res.render("post_detail", {
        title: "Post Detail",
        post_detail: limitedPostDetail,
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Display Post create form on GET
exports.post_create_get = (req, res, next) => {
  res.render("post_form", { title: "Create Post" });
};

// Handle Post create on POST
exports.post_create_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Topic is required")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
    });

    if (req.isAuthenticated()) {
      post.created_by = req.user._id;
    }

    if (!errors.isEmpty()) {
      res.render("post_form", { post, errors: errors.array() });
    }

    try {
      await post.save();
      res.redirect(post.url);
    } catch (err) {
      return next(err);
    }
  },
];

// Display Post delete form on GET
exports.post_delete_get = async (req, res, next) => {
  try {
    const post_delete = await Post.findById(req.params.id);
    if (post_delete == null) {
      res.redirect("/posts");
    }
    res.render("post_delete", {
      title: "Delete Post",
      post_delete,
    });
  } catch (err) {
    next(err);
  }
};

// Handle Post delete on POST
exports.post_delete_post = async (req, res, next) => {
  try {
    const post_delete = await Post.findById(req.params.id);
    if (post_delete == null) {
      res.redirect("/posts");
    }
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};

// Display Post update form on GET
exports.post_update_get = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }
    res.render("post_form", { title: "Update Post", post });
  } catch (err) {
    return next(err);
  }
};

// Handle Post update on POST
exports.post_update_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Topic is required")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required")
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      _id: req.params.id,
    });

    if (req.isAuthenticated()) {
      post.created_by = req.user._id;
    }

    if (!errors.isEmpty()) {
      res.render("post_form", { title: "Update Post", post });
    }

    try {
      await Post.updateOne({ _id: req.params.id }, post);
      res.redirect(post.url);
    } catch (err) {
      return next(err);
    }
  },
];
