const User = require("../models/user");
const Post = require("../models/post");
const passport = require("passport");

const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");

// Display list of all Users
exports.user_list = async (req, res, next) => {
  try {
    const user_list = await User.find({}, "first_name last_name").sort({
      first_name: 1,
    });
    res.render("user_list", { title: "User List", user_list });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific User
exports.user_detail = async (req, res, next) => {
  try {
    const [user_detail, post] = await Promise.all([
      User.findById(req.params.id),
      Post.find({ created_by: req.params.id }),
    ]);

    res.render("user_detail", {
      title: "User Detail",
      user_detail,
      post,
    });
  } catch (err) {
    return next(err);
  }
};

// Display User create form on GET
exports.user_create_get = (req, res, next) => {
  res.render("user_form", { title: "Create User" });
};

// Handle User create on POST
exports.user_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email: email });
      if (user) {
        // If a user with the provided email exists, throw an error
        throw new Error("Email already exists");
      }
      return true;
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        // If the password do not match, throw an error
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin === "true",
    });

    if (!errors.isEmpty()) {
      res.render("user_form", { user, errors: errors.array() });
    }
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      user.password = hashedPassword;
      try {
        await user.save();
        res.redirect(user.url);
      } catch (err) {
        return next(err);
      }
    });
  },
];

// Display User delete form on GET
exports.user_delete_get = async (req, res, next) => {
  try {
    const user_delete = await User.findById(req.params.id);
    if (user_delete == null) {
      res.redirect("/users");
    }
    res.render("user_delete", {
      title: "Delete User",
      user_delete,
    });
  } catch (err) {
    next(err);
  }
};

// Handle User delete on POST
exports.user_delete_post = async (req, res, next) => {
  try {
    const user_delete = await User.findById(req.params.id);
    if (user_delete == null) {
      res.redirect("/users");
    }
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/users");
  } catch (err) {
    next(err);
  }
};

// Display User update form on GET
exports.user_update_get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    res.render("user_form", { title: "Update User", user });
  } catch (err) {
    return next(err);
  }
};

// Handle User update on POST
exports.user_update_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email: email });
      if (user) {
        // If a user with the provided email exists, throw an error
        throw new Error("Email already exists");
      }
      return true;
    })
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .escape(),
  body("confirm_password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        // If the password do not match, throw an error
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin === "true",
      _id: req.params.id,
    });
    console.log("success");

    if (!errors.isEmpty()) {
      res.render("user_form", { title: "Update User", user });
    }
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      user.password = hashedPassword;
      try {
        await User.updateOne({ _id: req.params.id }, user);
        res.redirect(user.url);
      } catch (err) {
        return next(err);
      }
    });
  },
];

exports.user_login_get = (req, res, next) => {
  res.render("user_login");
};

exports.user_login_post = passport.authenticate("local", {
  failureRedirect: "/login-failure",
  successRedirect: "/login-success",
});

exports.user_logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
};
