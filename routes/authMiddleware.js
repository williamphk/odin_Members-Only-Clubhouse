const { ObjectId } = require("bson");

const Post = require("../models/post");

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ msg: "You are not authorized to view this resource" });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not authorized to view this resource because you are not an admin.",
    });
  }
};

module.exports.isUser = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.params.id === new ObjectId(req.user._id).toString()
  ) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not this user",
    });
  }
};

module.exports.isUserPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("created_by");
  if (
    req.isAuthenticated() &&
    post.created_by._id.toString() === new ObjectId(req.user._id).toString()
  ) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not this user",
    });
  }
};
